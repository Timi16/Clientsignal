import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { and, count as countFn, eq, inArray, isNull, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import {
  attorneys, attorneySpecialties, attorneyPreferences,
  attorneyIntegrations, firms, verifications, Attorney,
} from '../database/schema';
import { NatsSubjects, Services } from '@cs/common';
import type { AttorneyOnboardedEvent, AttorneyVerifiedEvent, AttorneyRejectedEvent } from '@cs/common';
import { VerificationAiService } from './verification-ai.service';

const DEFAULT_INTEGRATIONS = [
  { name: 'Clio', description: 'Sync leads to your Clio Grow pipeline', category: 'CRM', color: '#1E64D7' },
  { name: 'MyCase', description: 'Create matters from accepted leads', category: 'CRM', color: '#0EA5A5' },
  { name: 'Lawmatics', description: 'Trigger intake automations', category: 'Marketing', color: '#6D4AFF' },
  { name: 'Calendly', description: 'Auto-book consults from messages', category: 'Scheduling', color: '#1A1A1A' },
  { name: 'Twilio', description: 'Custom SMS alert routing', category: 'Comms', color: '#E1153C' },
  { name: 'Zapier', description: 'Connect 6,000+ apps', category: 'Automation', color: '#FF4F00' },
];

@Injectable()
export class AttorneyService {
  private readonly logger = new Logger(AttorneyService.name);

  constructor(
    private readonly database: DatabaseService,
    private readonly config: ConfigService,
    @Inject(Services.NATS) private readonly natsClient: ClientProxy,
    private readonly verificationAi: VerificationAiService,
  ) {}

  async createProfile(data: {
    userId: string;
    barNumber: string;
    bio?: string;
    yearsExperience?: number;
    city?: string;
    state?: string;
    firmName?: string;
    specialties?: string[];
  }) {
    const existing = await this.database.db
      .select().from(attorneys).where(eq(attorneys.userId, data.userId)).limit(1);
    if (existing.length) {
      throw new RpcException('Attorney profile already exists');
    }

    // Create firm if provided
    let firmId: string | undefined;
    if (data.firmName) {
      const [firm] = await this.database.db.insert(firms).values({
        name: data.firmName,
        city: data.city,
        state: data.state,
      }).returning();
      firmId = firm.id;
    }

    const [attorney] = await this.database.db.insert(attorneys).values({
      userId: data.userId,
      firmId,
      barNumber: data.barNumber,
      bio: data.bio,
      yearsExperience: data.yearsExperience || 0,
      city: data.city,
      state: data.state,
    }).returning();

    // Insert specialties
    if (data.specialties?.length) {
      await this.database.db.insert(attorneySpecialties).values(
        data.specialties.map((area) => ({
          attorneyId: attorney.id,
          practiceArea: area as any,
        })),
      );
    }

    // Create default preferences
    await this.database.db.insert(attorneyPreferences).values({
      attorneyId: attorney.id,
    });

    // ── AI-Powered Real-Time Verification ──────────────────
    // Gather existing bar numbers for duplicate check
    const existingBars = await this.database.db
      .select({ barNumber: attorneys.barNumber })
      .from(attorneys)
      .where(sql`${attorneys.id} != ${attorney.id}`);

    const verificationResult = await this.verificationAi.verify({
      name: data.firmName ? '' : '', // name comes from auth service, not available here
      barNumber: data.barNumber,
      bio: data.bio,
      yearsExperience: data.yearsExperience,
      city: data.city,
      state: data.state,
      firmName: data.firmName,
      specialties: data.specialties,
      email: '',
      existingBarNumbers: existingBars.map(b => b.barNumber),
      documentMetadata: (data as any).documentMetadata,
    });

    this.logger.log(
      `Verification result for attorney ${attorney.id}: ` +
      `decision=${verificationResult.decision} trust=${verificationResult.trustRating} ` +
      `method=${verificationResult.method}`,
    );

    // Update attorney status based on AI decision
    const statusMap = { approve: 'approved', review: 'review', reject: 'rejected' } as const;
    await this.database.db.update(attorneys)
      .set({
        status: statusMap[verificationResult.decision] as any,
        trustRating: verificationResult.trustRating as any,
        updatedAt: new Date(),
      })
      .where(eq(attorneys.id, attorney.id));

    // Store verification record with full AI analysis
    await this.database.db.insert(verifications).values({
      attorneyId: attorney.id,
      decision: verificationResult.decision === 'approve' ? 'approve'
        : verificationResult.decision === 'reject' ? 'reject'
        : undefined,
      checklistJson: JSON.stringify({
        systemChecks: verificationResult.systemChecks,
        aiAnalysis: verificationResult.aiAnalysis,
        barLookup: verificationResult.barLookup,
        method: verificationResult.method,
        model: verificationResult.model,
      }),
      reason: verificationResult.aiAnalysis?.reasoning || verificationResult.systemChecks.failures.join('; '),
      decidedAt: verificationResult.decision !== 'review' ? new Date() : undefined,
      slaDeadline: verificationResult.decision === 'review'
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h SLA for manual review
        : undefined,
    });

    const event: AttorneyOnboardedEvent = {
      attorneyId: attorney.id,
      userId: data.userId,
      name: '',
      email: '',
      barNumber: data.barNumber,
      specialties: (data.specialties || []) as any,
    };
    this.natsClient.emit(NatsSubjects.ATTORNEY_ONBOARDED, event);

    // Emit verified/rejected events for auto-decided profiles
    if (verificationResult.decision === 'approve') {
      const verifiedEvent: AttorneyVerifiedEvent = {
        attorneyId: attorney.id,
        userId: data.userId,
        name: '',
        email: '',
        adminUserId: 'ai-verification',
        trustRating: verificationResult.trustRating as any,
      };
      this.natsClient.emit(NatsSubjects.ATTORNEY_VERIFIED, verifiedEvent);
    } else if (verificationResult.decision === 'reject') {
      const rejectedEvent: AttorneyRejectedEvent = {
        attorneyId: attorney.id,
        userId: data.userId,
        name: '',
        email: '',
        adminUserId: 'ai-verification',
        reason: verificationResult.aiAnalysis?.reasoning || 'Failed automated verification checks',
      };
      this.natsClient.emit(NatsSubjects.ATTORNEY_REJECTED, rejectedEvent);
    }

    // Re-fetch attorney with updated status
    const [updatedAttorney] = await this.database.db.select().from(attorneys)
      .where(eq(attorneys.id, attorney.id)).limit(1);

    return {
      attorney: await this.toAttorneyMessage(updatedAttorney || attorney),
      verification: {
        decision: verificationResult.decision,
        trustRating: verificationResult.trustRating,
        method: verificationResult.method,
        reasoning: verificationResult.aiAnalysis?.reasoning || undefined,
        legitimacyScore: verificationResult.aiAnalysis?.legitimacy,
        consistencyScore: verificationResult.aiAnalysis?.consistency,
        riskFlags: verificationResult.aiAnalysis?.riskFlags || [],
        documentFlags: verificationResult.aiAnalysis?.documentFlags || [],
        systemCheckFailures: verificationResult.systemChecks.failures,
        barLookup: verificationResult.barLookup ? {
          status: verificationResult.barLookup.status,
          attorneyName: verificationResult.barLookup.attorneyName,
          barStatus: verificationResult.barLookup.barStatus,
          state: verificationResult.barLookup.state,
          source: verificationResult.barLookup.source,
        } : null,
      },
    };
  }

  async updateProfile(data: {
    attorneyId: string;
    bio?: string;
    city?: string;
    state?: string;
    specialties?: string[];
  }) {
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (data.bio !== undefined) updates.bio = data.bio;
    if (data.city !== undefined) updates.city = data.city;
    if (data.state !== undefined) updates.state = data.state;

    const [attorney] = await this.database.db.update(attorneys)
      .set(updates)
      .where(eq(attorneys.id, data.attorneyId))
      .returning();

    if (!attorney) throw new RpcException('Attorney not found');

    if (data.specialties?.length) {
      await this.database.db.delete(attorneySpecialties)
        .where(eq(attorneySpecialties.attorneyId, data.attorneyId));
      await this.database.db.insert(attorneySpecialties).values(
        data.specialties.map((area) => ({
          attorneyId: data.attorneyId,
          practiceArea: area as any,
        })),
      );
    }

    this.natsClient.emit(NatsSubjects.ATTORNEY_PROFILE_UPDATED, { attorneyId: data.attorneyId });

    return { attorney: await this.toAttorneyMessage(attorney) };
  }

  async getAttorney(data: { id: string }) {
    const [attorney] = await this.database.db
      .select().from(attorneys).where(eq(attorneys.id, data.id)).limit(1);
    if (!attorney) throw new RpcException('Attorney not found');
    return { attorney: await this.toAttorneyMessage(attorney) };
  }

  async getAttorneyByUserId(data: { userId: string }) {
    const [attorney] = await this.database.db
      .select().from(attorneys).where(eq(attorneys.userId, data.userId)).limit(1);
    if (!attorney) throw new RpcException('Attorney not found');
    return { attorney: await this.toAttorneyMessage(attorney) };
  }

  async listAttorneys(data: {
    status?: string;
    specialty?: string;
    state?: string;
    limit?: number;
    offset?: number;
  }) {
    const limit = data.limit || 50;
    const offset = data.offset || 0;
    const conditions: any[] = [];

    if (data.status) conditions.push(eq(attorneys.status, data.status as any));
    if (data.state) conditions.push(eq(attorneys.state, data.state));

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const rows = await this.database.db.select().from(attorneys)
      .where(whereClause)
      .limit(limit).offset(offset);

    const [{ total }] = await this.database.db.select({ total: countFn() }).from(attorneys)
      .where(whereClause);

    const messages = await Promise.all(rows.map((a) => this.toAttorneyMessage(a)));
    return { attorneys: messages, total: Number(total) };
  }

  async findMatchingAttorneys(data: {
    practiceArea: string;
    city?: string;
    state?: string;
  }) {
    // Find attorneys who have the matching specialty, are approved, and preferably in the same state/city
    const specialtyRows = await this.database.db
      .select({ attorneyId: attorneySpecialties.attorneyId })
      .from(attorneySpecialties)
      .where(eq(attorneySpecialties.practiceArea, data.practiceArea as any));

    const matchingIds = specialtyRows.map((r) => r.attorneyId);
    if (!matchingIds.length) return { attorneys: [], total: 0 };

    const rows = await this.database.db.select().from(attorneys)
      .where(and(
        inArray(attorneys.id, matchingIds),
        eq(attorneys.status, 'approved'),
      ))
      .orderBy(attorneys.totalLeads);

    // Sort by location proximity (same state first, then same city)
    const sorted = rows.sort((a, b) => {
      const aScore = (a.state === data.state ? 2 : 0) + (a.city === data.city ? 1 : 0);
      const bScore = (b.state === data.state ? 2 : 0) + (b.city === data.city ? 1 : 0);
      return bScore - aScore;
    });

    const messages = await Promise.all(sorted.map((a) => this.toAttorneyMessage(a)));
    return { attorneys: messages, total: sorted.length };
  }

  async getVerificationQueue(data: { limit?: number; offset?: number }) {
    const limit = data.limit || 50;
    const offset = data.offset || 0;

    const rows = await this.database.db.select().from(verifications)
      .where(isNull(verifications.decidedAt))
      .orderBy(verifications.createdAt)
      .limit(limit).offset(offset);

    const results = await Promise.all(rows.map(async (v) => {
      const [attorney] = await this.database.db.select().from(attorneys)
        .where(eq(attorneys.id, v.attorneyId)).limit(1);
      return {
        id: v.id,
        attorneyId: v.attorneyId,
        adminUserId: v.adminUserId || '',
        checklistJson: v.checklistJson || '',
        decision: v.decision || '',
        slaDeadline: v.slaDeadline?.toISOString() || '',
        decidedAt: v.decidedAt?.toISOString() || '',
        createdAt: v.createdAt.toISOString(),
        attorney: attorney ? await this.toAttorneyMessage(attorney) : undefined,
      };
    }));

    const [{ total }] = await this.database.db.select({ total: countFn() }).from(verifications)
      .where(isNull(verifications.decidedAt));
    return { verifications: results, total: Number(total) };
  }

  async decideVerification(data: {
    verificationId: string;
    attorneyId: string;
    adminUserId: string;
    decision: string;
    trustRating?: string;
    checklistJson?: string;
    reason?: string;
  }) {
    const [verification] = await this.database.db.update(verifications)
      .set({
        adminUserId: data.adminUserId,
        decision: data.decision as any,
        checklistJson: data.checklistJson,
        reason: data.reason,
        decidedAt: new Date(),
      })
      .where(eq(verifications.id, data.verificationId))
      .returning();

    if (!verification) throw new RpcException('Verification not found');

    const newStatus = data.decision === 'approve' ? 'approved' : 'rejected';
    const updates: Record<string, any> = {
      status: newStatus,
      updatedAt: new Date(),
    };
    if (data.trustRating) updates.trustRating = data.trustRating;

    await this.database.db.update(attorneys)
      .set(updates)
      .where(eq(attorneys.id, data.attorneyId));

    // Emit event
    if (data.decision === 'approve') {
      const event: AttorneyVerifiedEvent = {
        attorneyId: data.attorneyId,
        userId: '',
        name: '',
        email: '',
        adminUserId: data.adminUserId,
        trustRating: (data.trustRating || 'green') as any,
      };
      this.natsClient.emit(NatsSubjects.ATTORNEY_VERIFIED, event);
    } else {
      const event: AttorneyRejectedEvent = {
        attorneyId: data.attorneyId,
        userId: '',
        name: '',
        email: '',
        adminUserId: data.adminUserId,
        reason: data.reason,
      };
      this.natsClient.emit(NatsSubjects.ATTORNEY_REJECTED, event);
    }

    return {
      verification: {
        id: verification.id,
        attorneyId: verification.attorneyId,
        adminUserId: data.adminUserId,
        checklistJson: data.checklistJson || '',
        decision: data.decision,
        slaDeadline: verification.slaDeadline?.toISOString() || '',
        decidedAt: verification.decidedAt?.toISOString() || '',
        createdAt: verification.createdAt.toISOString(),
      },
    };
  }

  async getPreferences(data: { attorneyId: string }) {
    const [prefs] = await this.database.db.select().from(attorneyPreferences)
      .where(eq(attorneyPreferences.attorneyId, data.attorneyId)).limit(1);

    if (!prefs) {
      return {
        preferences: {
          attorneyId: data.attorneyId,
          notificationSms: true,
          notificationEmail: true,
          notificationPush: true,
          leadVolumeTarget: 10,
          maxBudget: 0,
        },
      };
    }

    return { preferences: prefs };
  }

  async updatePreferences(data: {
    attorneyId: string;
    notificationSms?: boolean;
    notificationEmail?: boolean;
    notificationPush?: boolean;
    leadVolumeTarget?: number;
    maxBudget?: number;
  }) {
    const updates: Record<string, any> = {};
    if (data.notificationSms !== undefined) updates.notificationSms = data.notificationSms;
    if (data.notificationEmail !== undefined) updates.notificationEmail = data.notificationEmail;
    if (data.notificationPush !== undefined) updates.notificationPush = data.notificationPush;
    if (data.leadVolumeTarget !== undefined) updates.leadVolumeTarget = data.leadVolumeTarget;
    if (data.maxBudget !== undefined) updates.maxBudget = data.maxBudget;

    const [prefs] = await this.database.db
      .insert(attorneyPreferences)
      .values({ attorneyId: data.attorneyId, ...updates })
      .onConflictDoUpdate({
        target: attorneyPreferences.attorneyId,
        set: updates,
      })
      .returning();

    this.natsClient.emit(NatsSubjects.ATTORNEY_PREFERENCES_UPDATED, { attorneyId: data.attorneyId });

    return { preferences: prefs };
  }

  async getIntegrations(data: { attorneyId: string }) {
    const rows = await this.database.db.select().from(attorneyIntegrations)
      .where(eq(attorneyIntegrations.attorneyId, data.attorneyId));

    const connectedNames = new Set(rows.filter((r) => r.connected).map((r) => r.integrationName));

    return {
      integrations: DEFAULT_INTEGRATIONS.map((i) => ({
        name: i.name,
        description: i.description,
        category: i.category,
        connected: connectedNames.has(i.name),
        color: i.color,
      })),
    };
  }

  async toggleIntegration(data: {
    attorneyId: string;
    integrationName: string;
    connected: boolean;
  }) {
    const [existing] = await this.database.db.select().from(attorneyIntegrations)
      .where(and(
        eq(attorneyIntegrations.attorneyId, data.attorneyId),
        eq(attorneyIntegrations.integrationName, data.integrationName),
      )).limit(1);

    if (existing) {
      await this.database.db.update(attorneyIntegrations)
        .set({
          connected: data.connected,
          connectedAt: data.connected ? new Date() : null,
        })
        .where(eq(attorneyIntegrations.id, existing.id));
    } else {
      await this.database.db.insert(attorneyIntegrations).values({
        attorneyId: data.attorneyId,
        integrationName: data.integrationName,
        connected: data.connected,
        connectedAt: data.connected ? new Date() : null,
      });
    }

    const info = DEFAULT_INTEGRATIONS.find((i) => i.name === data.integrationName);
    return {
      integration: {
        name: data.integrationName,
        description: info?.description || '',
        category: info?.category || '',
        connected: data.connected,
        color: info?.color || '',
      },
    };
  }

  async getAnalytics(data: { attorneyId: string }) {
    const [attorney] = await this.database.db.select().from(attorneys)
      .where(eq(attorneys.id, data.attorneyId)).limit(1);

    return {
      totalLeads: attorney?.totalLeads || 0,
      acceptanceRate: 0,
      avgResponseTime: attorney?.responseTimeAvg || '—',
      revenueCents: 0,
      leadTrends: [],
    };
  }

  async incrementTotalLeads(attorneyId: string) {
    await this.database.db.update(attorneys)
      .set({ totalLeads: sql`${attorneys.totalLeads} + 1`, updatedAt: new Date() })
      .where(eq(attorneys.id, attorneyId));
  }

  /* ── Helpers ─────────────────────────────────────────────── */

  private async toAttorneyMessage(attorney: Attorney) {
    const specialties = await this.database.db.select().from(attorneySpecialties)
      .where(eq(attorneySpecialties.attorneyId, attorney.id));

    let firmName = '';
    if (attorney.firmId) {
      const [firm] = await this.database.db.select().from(firms)
        .where(eq(firms.id, attorney.firmId)).limit(1);
      firmName = firm?.name || '';
    }

    return {
      id: attorney.id,
      userId: attorney.userId,
      barNumber: attorney.barNumber,
      bio: attorney.bio || '',
      yearsExperience: attorney.yearsExperience || 0,
      city: attorney.city || '',
      state: attorney.state || '',
      status: attorney.status,
      trustRating: attorney.trustRating || '',
      totalLeads: attorney.totalLeads || 0,
      responseTimeAvg: attorney.responseTimeAvg || '—',
      firmName,
      firmId: attorney.firmId || '',
      specialties: specialties.map((s) => s.practiceArea),
      name: '',
      email: '',
      createdAt: attorney.createdAt.toISOString(),
    };
  }
}
