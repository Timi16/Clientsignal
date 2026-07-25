import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { and, count as countFn, eq, inArray, isNull } from 'drizzle-orm';
import { createHash, randomBytes } from 'node:crypto';
import * as argon2 from 'argon2';
import { RpcException } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';
import { auditLogs, refreshSessions, verificationTokens, User, users } from '../database/schema';
import { NatsSubjects, Services } from '@cs/common';
import type { UserRegisteredEvent, UserDisabledEvent, PasswordResetRequestedEvent } from '@cs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @Inject(Services.NATS) private readonly natsClient: ClientProxy,
  ) {}

  async register(data: {
    email: string;
    name: string;
    password: string;
    role?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const role = (data.role as 'client' | 'attorney' | 'admin') || 'client';
    this.assertSelfRegistrableRole(role);

    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await this.findUserByEmail(normalizedEmail);
    if (existing) {
      throw new RpcException('Email is already registered');
    }

    const passwordHash = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    });

    const [user] = await this.database.db.insert(users).values({
      email: normalizedEmail,
      name: data.name.trim(),
      role,
      passwordHash,
    }).returning();

    await this.audit(user.id, 'auth.register', data.ipAddress, data.userAgent);

    // Generate email verification token
    const verifyToken = randomBytes(32).toString('base64url');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await this.database.db.insert(verificationTokens).values({
      userId: user.id,
      tokenHash: this.hashToken(verifyToken),
      type: 'email_verify',
      expiresAt: verifyExpires,
    });

    // Publish user.registered event (includes verification token for mail-service)
    const event: UserRegisteredEvent = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verifyToken,
      verifyExpiresAt: verifyExpires.toISOString(),
    };
    this.natsClient.emit(NatsSubjects.USER_REGISTERED, event);

    return this.issueTokens(user, data.ipAddress, data.userAgent);
  }

  async login(data: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const user = await this.findUserByEmail(data.email.trim().toLowerCase());
    if (!user || user.disabledAt) {
      throw new RpcException('Invalid credentials');
    }

    const ok = await argon2.verify(user.passwordHash, data.password);
    if (!ok) {
      throw new RpcException('Invalid credentials');
    }

    await this.database.db.update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id));
    await this.audit(user.id, 'auth.login', data.ipAddress, data.userAgent);

    return this.issueTokens(user, data.ipAddress, data.userAgent);
  }

  async refresh(data: {
    refreshToken: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const tokenHash = this.hashToken(data.refreshToken);
    const [session] = await this.database.db
      .select()
      .from(refreshSessions)
      .where(and(eq(refreshSessions.tokenHash, tokenHash), isNull(refreshSessions.revokedAt)))
      .limit(1);

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      throw new RpcException('Refresh session is invalid');
    }

    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user || user.disabledAt) {
      throw new RpcException('User is not active');
    }

    await this.database.db.update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(eq(refreshSessions.id, session.id));

    await this.audit(user.id, 'auth.refresh', data.ipAddress, data.userAgent);
    return this.issueTokens(user, data.ipAddress, data.userAgent);
  }

  async logout(data: { refreshToken: string }) {
    if (data.refreshToken) {
      await this.database.db.update(refreshSessions)
        .set({ revokedAt: new Date() })
        .where(eq(refreshSessions.tokenHash, this.hashToken(data.refreshToken)));
    }
    return { ok: true };
  }

  async getUser(data: { id: string }) {
    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, data.id))
      .limit(1);

    if (!user) {
      throw new RpcException('User not found');
    }

    return { user: this.toUserMessage(user) };
  }

  async getUsersByIds(data: { ids: string[] }) {
    if (!data.ids.length) return { users: [] };

    const rows = await this.database.db
      .select()
      .from(users)
      .where(inArray(users.id, data.ids));

    return { users: rows.map((u) => this.toUserMessage(u)) };
  }

  async findUserByEmailRpc(data: { email: string }) {
    const user = await this.findUserByEmail(data.email.trim().toLowerCase());
    if (!user) {
      throw new RpcException('User not found');
    }
    return { user: this.toUserMessage(user) };
  }

  async disableUser(data: { id: string; disabledBy: string }) {
    const [user] = await this.database.db
      .update(users)
      .set({ disabledAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, data.id))
      .returning();

    if (!user) {
      throw new RpcException('User not found');
    }

    const event: UserDisabledEvent = {
      userId: user.id,
      email: user.email,
      disabledBy: data.disabledBy,
    };
    this.natsClient.emit(NatsSubjects.USER_DISABLED, event);

    return { ok: true };
  }

  async verifyEmail(data: { token: string }) {
    const tokenHash = this.hashToken(data.token);
    const [record] = await this.database.db.select().from(verificationTokens)
      .where(and(
        eq(verificationTokens.tokenHash, tokenHash),
        eq(verificationTokens.type, 'email_verify'),
        isNull(verificationTokens.usedAt),
      ))
      .limit(1);

    if (!record || record.expiresAt.getTime() <= Date.now()) {
      throw new RpcException('Invalid or expired verification token');
    }

    await this.database.db.update(verificationTokens)
      .set({ usedAt: new Date() })
      .where(eq(verificationTokens.id, record.id));

    await this.database.db.update(users)
      .set({ emailVerifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, record.userId));

    return { ok: true };
  }

  async resendVerificationEmail(data: { userId: string }) {
    const [user] = await this.database.db.select().from(users)
      .where(eq(users.id, data.userId)).limit(1);
    if (!user) throw new RpcException('User not found');
    if (user.emailVerifiedAt) throw new RpcException('Email already verified');

    const verifyToken = randomBytes(32).toString('base64url');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.database.db.insert(verificationTokens).values({
      userId: user.id,
      tokenHash: this.hashToken(verifyToken),
      type: 'email_verify',
      expiresAt: verifyExpires,
    });

    const event: UserRegisteredEvent = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verifyToken,
      verifyExpiresAt: verifyExpires.toISOString(),
    };
    this.natsClient.emit(NatsSubjects.USER_REGISTERED, event);

    return { ok: true };
  }

  async requestPasswordReset(data: { email: string }) {
    const user = await this.findUserByEmail(data.email.trim().toLowerCase());
    // Always return ok to prevent email enumeration
    if (!user || user.disabledAt) return { ok: true };

    const resetToken = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.database.db.insert(verificationTokens).values({
      userId: user.id,
      tokenHash: this.hashToken(resetToken),
      type: 'password_reset',
      expiresAt,
    });

    const event: PasswordResetRequestedEvent = {
      userId: user.id,
      email: user.email,
      name: user.name,
      resetToken,
      expiresAt: expiresAt.toISOString(),
    };
    this.natsClient.emit(NatsSubjects.PASSWORD_RESET_REQUESTED, event);

    return { ok: true };
  }

  async resetPassword(data: { token: string; newPassword: string }) {
    const tokenHash = this.hashToken(data.token);
    const [record] = await this.database.db.select().from(verificationTokens)
      .where(and(
        eq(verificationTokens.tokenHash, tokenHash),
        eq(verificationTokens.type, 'password_reset'),
        isNull(verificationTokens.usedAt),
      ))
      .limit(1);

    if (!record || record.expiresAt.getTime() <= Date.now()) {
      throw new RpcException('Invalid or expired reset token');
    }

    const passwordHash = await argon2.hash(data.newPassword, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    });

    await this.database.db.update(verificationTokens)
      .set({ usedAt: new Date() })
      .where(eq(verificationTokens.id, record.id));

    await this.database.db.update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, record.userId));

    // Revoke all refresh sessions for this user
    await this.database.db.update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(refreshSessions.userId, record.userId),
        isNull(refreshSessions.revokedAt),
      ));

    return { ok: true };
  }

  async listAuditLogs(data: { userId?: string; limit?: number; offset?: number }) {
    const limit = data.limit || 50;
    const offset = data.offset || 0;

    let query = this.database.db.select().from(auditLogs).$dynamic();

    if (data.userId) {
      query = query.where(eq(auditLogs.userId, data.userId));
    }

    const rows = await query
      .orderBy(auditLogs.createdAt)
      .limit(limit)
      .offset(offset);

    let countQuery = this.database.db.select({ total: countFn() }).from(auditLogs).$dynamic();
    if (data.userId) {
      countQuery = countQuery.where(eq(auditLogs.userId, data.userId));
    }
    const [{ total }] = await countQuery;

    return {
      logs: rows.map((log) => ({
        id: log.id,
        userId: log.userId || '',
        action: log.action,
        ipAddress: log.ipAddress || '',
        createdAt: log.createdAt.toISOString(),
      })),
      total: Number(total),
    };
  }

  /* ── Private helpers ─────────────────────────────────────── */

  private async issueTokens(user: User, ipAddress?: string, userAgent?: string) {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = this.createRefreshToken();
    const refreshDays = this.config.get<number>('REFRESH_TOKEN_TTL_DAYS', 30);
    const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    await this.database.db.insert(refreshSessions).values({
      userId: user.id,
      tokenHash: this.hashToken(refreshToken),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: this.toUserMessage(user),
    };
  }

  private async signAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TTL', '15m') as any,
    });
  }

  private async findUserByEmail(email: string) {
    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  private createRefreshToken() {
    return randomBytes(48).toString('base64url');
  }

  private hashToken(token: string) {
    return createHash('sha256')
      .update(this.config.getOrThrow<string>('JWT_REFRESH_SECRET'))
      .update(token)
      .digest('hex');
  }

  private assertSelfRegistrableRole(role: string) {
    const allowAdmin = this.config.get<string>('ALLOW_ADMIN_REGISTRATION') === 'true';
    if (role === 'admin' && !allowAdmin) {
      throw new RpcException('Admin users cannot self-register');
    }
  }

  private async audit(userId: string, action: string, ipAddress?: string, userAgent?: string) {
    await this.database.db.insert(auditLogs).values({
      userId,
      action,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    });
  }

  private toUserMessage(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() || '',
      disabledAt: user.disabledAt?.toISOString() || '',
      lastLoginAt: user.lastLoginAt?.toISOString() || '',
      createdAt: user.createdAt.toISOString(),
    };
  }
}
