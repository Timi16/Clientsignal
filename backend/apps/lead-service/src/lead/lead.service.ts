import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { eq, and, sql, count as countFn, ilike, desc, asc } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { intakeSubmissions, leads, leadClaims, leadDocuments, Lead } from '../database/schema';
import { ScoringService } from '../scoring/scoring.service';
import { MatchingService } from '../matching/matching.service';
import { NatsSubjects, Services, createPresignedUploadUrl, createPresignedDownloadUrl } from '@cs/common';
import type {
  LeadCreatedEvent, LeadScoredEvent, LeadMatchedEvent,
  LeadViewedEvent, LeadClaimedEvent,
} from '@cs/common';

@Injectable()
export class LeadService {
  constructor(
    private readonly database: DatabaseService,
    private readonly scoring: ScoringService,
    private readonly matching: MatchingService,
    @Inject(Services.NATS) private readonly natsClient: ClientProxy,
  ) {}

  async submitIntake(data: {
    clientUserId: string;
    clientName?: string;
    clientEmail?: string;
    practiceArea: string;
    subType?: string;
    description?: string;
    city?: string;
    state?: string;
    urgent?: boolean;
    consent?: boolean;
    phone?: string;
    channel?: string;
  }) {
    // 1. Create intake submission
    const [intake] = await this.database.db.insert(intakeSubmissions).values({
      clientUserId: data.clientUserId,
      practiceArea: data.practiceArea as any,
      subType: data.subType,
      description: data.description,
      city: data.city,
      state: data.state,
      urgent: data.urgent || false,
      consent: data.consent || false,
      phone: data.phone,
      channel: data.channel,
    }).returning();

    // 2. Score
    const scores = this.scoring.score({
      practiceArea: data.practiceArea,
      subType: data.subType,
      description: data.description,
      urgent: data.urgent || false,
      consent: data.consent || false,
      channel: data.channel,
      docCount: 0,
    });

    // 3. Create lead
    const summary = data.description?.slice(0, 200) || '';
    const [lead] = await this.database.db.insert(leads).values({
      intakeId: intake.id,
      clientUserId: data.clientUserId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      practiceArea: data.practiceArea as any,
      subType: data.subType,
      qualityScore: scores.qualityScore,
      urgencyScore: scores.urgencyScore,
      city: data.city,
      state: data.state,
      summary,
      estimatedValue: scores.estimatedValue,
      phone: data.phone,
      consent: data.consent || false,
      channel: data.channel,
    }).returning();

    // Emit lead.created
    const createdEvent: LeadCreatedEvent = {
      leadId: lead.id,
      clientUserId: data.clientUserId,
      practiceArea: data.practiceArea as any,
      city: data.city || '',
      state: data.state || '',
    };
    this.natsClient.emit(NatsSubjects.LEAD_CREATED, createdEvent);

    // Emit lead.scored
    const scoredEvent: LeadScoredEvent = {
      leadId: lead.id,
      qualityScore: scores.qualityScore,
      urgencyScore: scores.urgencyScore,
      estimatedValue: scores.estimatedValue,
    };
    this.natsClient.emit(NatsSubjects.LEAD_SCORED, scoredEvent);

    // 4. Broadcast model — lead is visible to ALL matching attorneys
    // No exclusive match at creation; attorneys compete to claim
    // Still find best match for notifications / case creation
    const match = await this.matching.findBestMatch({
      practiceArea: data.practiceArea,
      city: data.city || '',
      state: data.state || '',
    });

    if (match) {
      // Fetch any uploaded documents to include in the event
      const docs = await this.database.db.select().from(leadDocuments)
        .where(eq(leadDocuments.leadId, lead.id));

      const matchedEvent: LeadMatchedEvent = {
        leadId: lead.id,
        clientUserId: data.clientUserId,
        clientName: data.clientName || '',
        clientEmail: data.clientEmail || '',
        attorneyId: match.attorneyId,
        attorneyUserId: match.attorneyUserId,
        attorneyName: match.attorneyName,
        attorneyEmail: match.attorneyEmail,
        practiceArea: data.practiceArea as any,
        qualityScore: scores.qualityScore,
        urgencyScore: scores.urgencyScore,
        summary,
        city: data.city || '',
        state: data.state || '',
        documents: docs.map(d => ({
          fileKey: d.fileKey || '',
          fileName: d.fileName,
          mimeType: d.mimeType || undefined,
        })),
      };
      this.natsClient.emit(NatsSubjects.LEAD_MATCHED, matchedEvent);
    }

    return {
      lead: this.toLeadMessage(lead),
      matchedAttorney: match ? {
        name: match.attorneyName,
        firmName: match.firmName,
        yearsExperience: match.yearsExperience,
        responseTimeAvg: match.responseTimeAvg,
      } : null,
    };
  }

  async getLead(data: { id: string }) {
    const [lead] = await this.database.db.select().from(leads)
      .where(eq(leads.id, data.id)).limit(1);
    if (!lead) throw new RpcException('Lead not found');
    return { lead: await this.toLeadMessageWithDocs(lead) };
  }

  async listLeads(data: {
    attorneyId?: string;
    attorneySpecialties?: string[];
    status?: string;
    practiceArea?: string;
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    city?: string;
    state?: string;
  }) {
    const limit = data.limit || 50;
    const offset = data.offset || 0;
    const conditions: any[] = [];

    if (data.attorneyId) {
      // Broadcast model: show leads that are either:
      // (a) unclaimed AND match the attorney's specialties, OR
      // (b) already claimed/matched to this attorney
      const specialties = data.attorneySpecialties?.length
        ? data.attorneySpecialties
        : [];

      if (specialties.length) {
        conditions.push(
          sql`(
            (${leads.status} IN ('new', 'viewed') AND ${leads.practiceArea} IN (${sql.join(specialties.map(s => sql`${s}`), sql`, `)}))
            OR ${leads.matchedAttorneyId} = ${data.attorneyId}
          )`,
        );
      } else {
        // No specialties known — fall back to showing only their matched leads
        conditions.push(eq(leads.matchedAttorneyId, data.attorneyId));
      }
    }
    if (data.status) {
      conditions.push(eq(leads.status, data.status as any));
    }
    if (data.practiceArea) {
      conditions.push(eq(leads.practiceArea, data.practiceArea as any));
    }
    if (data.city) {
      conditions.push(ilike(leads.city, `%${data.city}%`));
    }
    if (data.state) {
      conditions.push(eq(leads.state, data.state));
    }
    if (data.search) {
      const term = `%${data.search}%`;
      conditions.push(
        sql`(${leads.clientName} ILIKE ${term} OR ${leads.summary} ILIKE ${term} OR ${leads.city} ILIKE ${term})`,
      );
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    // Sorting
    const sortColumn = {
      quality: leads.qualityScore,
      urgency: leads.urgencyScore,
      created: leads.createdAt,
    }[data.sortBy || 'created'] || leads.createdAt;

    const orderFn = data.sortOrder === 'asc' ? asc : desc;

    const rows = await this.database.db.select().from(leads)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit).offset(offset);

    const [{ total }] = await this.database.db.select({ total: countFn() }).from(leads)
      .where(whereClause);

    return {
      leads: rows.map((l) => this.toLeadMessage(l)),
      total: Number(total),
    };
  }

  async viewLead(data: { leadId: string; attorneyId: string }) {
    const [lead] = await this.database.db.select().from(leads)
      .where(eq(leads.id, data.leadId)).limit(1);
    if (!lead) throw new RpcException('Lead not found');

    if (lead.status === 'new') {
      await this.database.db.update(leads)
        .set({ status: 'viewed', updatedAt: new Date() })
        .where(eq(leads.id, data.leadId));

      const event: LeadViewedEvent = {
        leadId: data.leadId,
        attorneyId: data.attorneyId,
      };
      this.natsClient.emit(NatsSubjects.LEAD_VIEWED, event);
    }

    return { ok: true };
  }

  async claimLead(data: {
    leadId: string;
    attorneyId: string;
    attorneyUserId?: string;
    attorneyName?: string;
  }) {
    const [lead] = await this.database.db.select().from(leads)
      .where(eq(leads.id, data.leadId)).limit(1);
    if (!lead) throw new RpcException('Lead not found');

    if (lead.status === 'claimed' || lead.status === 'responded') {
      throw new RpcException('Lead already claimed');
    }

    // Create claim
    await this.database.db.insert(leadClaims).values({
      leadId: data.leadId,
      attorneyId: data.attorneyId,
    });

    // Update lead status
    await this.database.db.update(leads)
      .set({
        status: 'claimed',
        matchedAttorneyId: data.attorneyId,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, data.leadId));

    const event: LeadClaimedEvent = {
      leadId: data.leadId,
      attorneyId: data.attorneyId,
      attorneyUserId: data.attorneyUserId || '',
      attorneyName: data.attorneyName || '',
      clientUserId: lead.clientUserId,
      clientName: lead.clientName || '',
      clientEmail: lead.clientEmail || '',
      practiceArea: lead.practiceArea as any,
      phone: lead.phone || '',
    };
    this.natsClient.emit(NatsSubjects.LEAD_CLAIMED, event);

    return {
      lead: this.toLeadMessage({ ...lead, status: 'claimed' }),
      phone: lead.phone || '',
      success: true,
    };
  }

  async adminListLeads(data: { status?: string; limit?: number; offset?: number }) {
    return this.listLeads(data);
  }

  async adminUpdateLeadQA(data: {
    leadId: string;
    qualityScore?: number;
    urgencyScore?: number;
    status?: string;
  }) {
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (data.qualityScore !== undefined) updates.qualityScore = data.qualityScore;
    if (data.urgencyScore !== undefined) updates.urgencyScore = data.urgencyScore;
    if (data.status) updates.status = data.status;

    await this.database.db.update(leads).set(updates).where(eq(leads.id, data.leadId));
    return { ok: true };
  }

  async getDocumentUploadUrl(data: { leadId: string; fileName: string; mimeType: string }) {
    const fileKey = `leads/${data.leadId}/${Date.now()}_${data.fileName}`;

    const [doc] = await this.database.db.insert(leadDocuments).values({
      leadId: data.leadId,
      fileKey,
      fileName: data.fileName,
      mimeType: data.mimeType,
    }).returning();

    const { uploadUrl } = await createPresignedUploadUrl({
      fileKey,
      mimeType: data.mimeType,
    });

    return {
      url: uploadUrl,
      documentId: doc.id,
      fileKey,
    };
  }

  async getDocumentDownloadUrl(data: { documentId: string }) {
    const [doc] = await this.database.db.select().from(leadDocuments)
      .where(eq(leadDocuments.id, data.documentId)).limit(1);
    if (!doc) throw new RpcException('Document not found');
    if (!doc.fileKey) throw new RpcException('Document has no file uploaded');

    const url = await createPresignedDownloadUrl({ fileKey: doc.fileKey });
    return { url, fileName: doc.fileName };
  }

  /* ── Helpers ─────────────────────────────────────────────── */

  private toLeadMessage(lead: Lead) {
    return {
      id: lead.id,
      clientUserId: lead.clientUserId,
      name: lead.clientName || '',
      practiceArea: lead.practiceArea,
      subType: lead.subType || '',
      qualityScore: lead.qualityScore || 0,
      urgencyScore: lead.urgencyScore || 0,
      city: lead.city || '',
      state: lead.state || '',
      summary: lead.summary || '',
      estimatedValue: lead.estimatedValue || '',
      phone: lead.status === 'claimed' || lead.status === 'responded' ? (lead.phone || '') : '',
      consent: lead.consent || false,
      docCount: 0,
      status: lead.status,
      channel: lead.channel || '',
      matchedAttorneyId: lead.matchedAttorneyId || '',
      createdAt: lead.createdAt.toISOString(),
    };
  }

  private async toLeadMessageWithDocs(lead: Lead) {
    const docs = await this.database.db.select().from(leadDocuments)
      .where(eq(leadDocuments.leadId, lead.id));

    const msg = this.toLeadMessage(lead);
    msg.docCount = docs.length;
    return msg;
  }
}
