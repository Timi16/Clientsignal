import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { and, eq, isNull } from "drizzle-orm";
import { Request, Response } from "express";
import type ms from "ms";
import { createHash, randomBytes } from "node:crypto";
import * as argon2 from "argon2";
import { DatabaseService } from "../database/database.service";
import { auditLogs, refreshSessions, User, UserRole, users } from "../database/schema";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AccessTokenPayload, AuthUser } from "./types";

const REFRESH_COOKIE = "cs_refresh";

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto, request: Request, response: Response) {
    const role = dto.role || "client";
    this.assertSelfRegistrableRole(role);

    const normalizedEmail = dto.email.trim().toLowerCase();
    const existing = await this.findUserByEmail(normalizedEmail);
    if (existing) {
      throw new BadRequestException("Email is already registered");
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    });

    const [user] = await this.database.db.insert(users).values({
      email: normalizedEmail,
      name: dto.name.trim(),
      role,
      passwordHash,
    }).returning();

    await this.audit(user.id, "auth.register", request);
    return this.issueTokens(user, request, response);
  }

  async login(dto: LoginDto, request: Request, response: Response) {
    const user = await this.findUserByEmail(dto.email.trim().toLowerCase());
    if (!user || user.disabledAt) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.database.db.update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id));
    await this.audit(user.id, "auth.login", request);

    return this.issueTokens(user, request, response);
  }

  async refresh(request: Request, response: Response) {
    const refreshToken = this.getRefreshCookie(request);
    const tokenHash = this.hashToken(refreshToken);
    const [session] = await this.database.db
      .select()
      .from(refreshSessions)
      .where(and(eq(refreshSessions.tokenHash, tokenHash), isNull(refreshSessions.revokedAt)))
      .limit(1);

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      this.clearRefreshCookie(response);
      throw new UnauthorizedException("Refresh session is invalid");
    }

    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user || user.disabledAt) {
      this.clearRefreshCookie(response);
      throw new UnauthorizedException("User is not active");
    }

    await this.database.db.update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(eq(refreshSessions.id, session.id));

    await this.audit(user.id, "auth.refresh", request);
    return this.issueTokens(user, request, response);
  }

  async logout(request: Request, response: Response) {
    const refreshToken = request.cookies?.[REFRESH_COOKIE] as string | undefined;

    if (refreshToken) {
      await this.database.db.update(refreshSessions)
        .set({ revokedAt: new Date() })
        .where(eq(refreshSessions.tokenHash, this.hashToken(refreshToken)));
    }

    this.clearRefreshCookie(response);
    return { ok: true };
  }

  toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private async issueTokens(user: User, request: Request, response: Response) {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = this.createRefreshToken();
    const refreshDays = this.config.get<number>("REFRESH_TOKEN_TTL_DAYS", 30);
    const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    await this.database.db.insert(refreshSessions).values({
      userId: user.id,
      tokenHash: this.hashToken(refreshToken),
      ipAddress: this.ipAddress(request),
      userAgent: request.headers["user-agent"] || null,
      expiresAt,
    });

    response.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>("NODE_ENV") === "production",
      sameSite: "lax",
      domain: this.config.get<string>("COOKIE_DOMAIN") || undefined,
      path: "/api/auth",
      expires: expiresAt,
    });

    return {
      accessToken,
      user: this.toAuthUser(user),
    };
  }

  private async signAccessToken(user: User) {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const expiresIn = this.config.get<string>("JWT_ACCESS_TTL", "15m") as ms.StringValue;

    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn,
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
    return randomBytes(48).toString("base64url");
  }

  private hashToken(token: string) {
    return createHash("sha256")
      .update(this.config.getOrThrow<string>("JWT_REFRESH_SECRET"))
      .update(token)
      .digest("hex");
  }

  private getRefreshCookie(request: Request) {
    const token = request.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!token) {
      throw new UnauthorizedException("Missing refresh cookie");
    }
    return token;
  }

  private clearRefreshCookie(response: Response) {
    response.clearCookie(REFRESH_COOKIE, {
      domain: this.config.get<string>("COOKIE_DOMAIN") || undefined,
      path: "/api/auth",
    });
  }

  private assertSelfRegistrableRole(role: UserRole) {
    const allowAdminRegistration = this.config.get<string>("ALLOW_ADMIN_REGISTRATION") === "true";
    if (role === "admin" && !allowAdminRegistration) {
      throw new BadRequestException("Admin users cannot self-register");
    }
  }

  private async audit(userId: string, action: string, request: Request) {
    await this.database.db.insert(auditLogs).values({
      userId,
      action,
      ipAddress: this.ipAddress(request),
      userAgent: request.headers["user-agent"] || null,
    });
  }

  private ipAddress(request: Request) {
    return request.ip || request.socket.remoteAddress || null;
  }
}
