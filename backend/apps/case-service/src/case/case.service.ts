import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { eq, and, count as countFn, ilike, desc, asc, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { cases, caseDocuments, caseNotes, Case, CaseDocument } from '../database/schema';
import { NatsSubjects, Services, createPresignedUploadUrl, createPresignedDownloadUrl } from '@cs/common';
import type { CaseCreatedEvent, CaseStageUpdatedEvent, DocumentRequestedEvent } from '@cs/common';

interface AuthServiceGrpc {
  getUser(data: { id: string }): Observable<{ user: { name: string; email: string } }>;
}

@Injectable()
export class CaseService implements OnModuleInit {
  private authService!: AuthServiceGrpc;

  constructor(
    private readonly database: DatabaseService,
    @Inject(Services.NATS) private readonly natsClient: ClientProxy,
    @Inject(Services.AUTH) private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.authClient.getService<AuthServiceGrpc>('AuthService');
  }

  private async lookupUser(userId: string): Promise<{ name: string; email: string }> {
    try {
      const res = await lastValueFrom(this.authService.getUser({ id: userId }));
      return { name: res.user?.name || '', email: res.user?.email || '' };
    } catch {
      return { name: '', email: '' };
    }
  }

  async getCase(data: { id: string }) {
    const [caseRecord] = await this.database.db.select().from(cases)
      .where(eq(cases.id, data.id)).limit(1);
    if (!caseRecord) throw new RpcException('Case not found');
    return { caseData: this.toCaseMessage(caseRecord) };
  }

  async listCases(data: {
    clientUserId?: string;
    attorneyId?: string;
    status?: string;
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    practiceArea?: string;
  }) {
    const limit = data.limit || 50;
    const offset = data.offset || 0;
    const conditions: any[] = [];

    if (data.clientUserId) conditions.push(eq(cases.clientUserId, data.clientUserId));
    if (data.attorneyId) conditions.push(eq(cases.attorneyId, data.attorneyId));
    if (data.status) conditions.push(eq(cases.status, data.status as any));
    if (data.practiceArea) conditions.push(eq(cases.practiceArea, data.practiceArea as any));
    if (data.search) {
      const term = `%${data.search}%`;
      conditions.push(
        sql`(${cases.summary} ILIKE ${term} OR ${cases.matter} ILIKE ${term} OR ${cases.city} ILIKE ${term})`,
      );
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    // Sorting
    const sortColumn = {
      stage: cases.stage,
      strength: cases.strengthScore,
      created: cases.createdAt,
      opened: cases.openedAt,
    }[data.sortBy || 'created'] || cases.createdAt;

    const orderFn = data.sortOrder === 'asc' ? asc : desc;

    const rows = await this.database.db.select().from(cases)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit).offset(offset);

    const [{ total }] = await this.database.db.select({ total: countFn() }).from(cases)
      .where(whereClause);

    return {
      cases: rows.map((c) => this.toCaseMessage(c)),
      total: Number(total),
    };
  }

  async updateCaseStage(data: { caseId: string; stage: number }) {
    const [existing] = await this.database.db.select().from(cases)
      .where(eq(cases.id, data.caseId)).limit(1);
    if (!existing) throw new RpcException('Case not found');

    const previousStage = existing.stage;
    const [updated] = await this.database.db.update(cases)
      .set({ stage: data.stage, updatedAt: new Date() })
      .where(eq(cases.id, data.caseId))
      .returning();

    const client = await this.lookupUser(updated.clientUserId);
    const event: CaseStageUpdatedEvent = {
      caseId: data.caseId,
      clientUserId: updated.clientUserId,
      clientEmail: client.email,
      clientName: client.name,
      previousStage,
      newStage: data.stage,
      status: updated.status,
    };
    this.natsClient.emit(NatsSubjects.CASE_STAGE_UPDATED, event);

    return { caseData: this.toCaseMessage(updated) };
  }

  async updateCaseStatus(data: { caseId: string; status: string }) {
    const updates: Record<string, any> = {
      status: data.status,
      updatedAt: new Date(),
    };
    if (data.status === 'closed') updates.closedAt = new Date();

    const [updated] = await this.database.db.update(cases)
      .set(updates)
      .where(eq(cases.id, data.caseId))
      .returning();

    if (!updated) throw new RpcException('Case not found');

    this.natsClient.emit(NatsSubjects.CASE_STATUS_UPDATED, {
      caseId: data.caseId,
      status: data.status,
      clientUserId: updated.clientUserId,
    });

    if (data.status === 'closed') {
      this.natsClient.emit(NatsSubjects.CASE_CLOSED, {
        caseId: data.caseId,
        clientUserId: updated.clientUserId,
        attorneyId: updated.attorneyId,
      });
    }

    return { caseData: this.toCaseMessage(updated) };
  }

  async getDocumentUploadUrl(data: {
    caseId: string;
    fileName: string;
    mimeType?: string;
    required?: boolean;
    uploadedByUserId?: string;
  }) {
    const fileKey = `cases/${data.caseId}/${Date.now()}_${data.fileName}`;

    const [doc] = await this.database.db.insert(caseDocuments).values({
      caseId: data.caseId,
      fileKey,
      fileName: data.fileName,
      mimeType: data.mimeType,
      status: 'pending',
      required: data.required || false,
      uploadedByUserId: data.uploadedByUserId,
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

  async confirmDocumentUpload(data: { documentId: string }) {
    const [doc] = await this.database.db.update(caseDocuments)
      .set({ status: 'done', uploadedAt: new Date() })
      .where(eq(caseDocuments.id, data.documentId))
      .returning();

    if (!doc) throw new RpcException('Document not found');

    this.natsClient.emit(NatsSubjects.DOCUMENT_UPLOADED, {
      caseId: doc.caseId,
      documentId: doc.id,
      fileName: doc.fileName,
      uploadedByUserId: doc.uploadedByUserId,
    });

    // Recalculate case strength
    await this.recalculateStrength(doc.caseId);

    return { document: this.toDocMessage(doc) };
  }

  async listDocuments(data: { caseId: string }) {
    const docs = await this.database.db.select().from(caseDocuments)
      .where(eq(caseDocuments.caseId, data.caseId));
    return { documents: docs.map((d) => this.toDocMessage(d)) };
  }

  async getDocumentDownloadUrl(data: { documentId: string }) {
    const [doc] = await this.database.db.select().from(caseDocuments)
      .where(eq(caseDocuments.id, data.documentId)).limit(1);
    if (!doc) throw new RpcException('Document not found');
    if (!doc.fileKey) throw new RpcException('Document has no file uploaded');

    const url = await createPresignedDownloadUrl({ fileKey: doc.fileKey });
    return { url, fileName: doc.fileName };
  }

  async requestDocument(data: {
    caseId: string;
    documentName: string;
    required?: boolean;
    attorneyName?: string;
  }) {
    const [doc] = await this.database.db.insert(caseDocuments).values({
      caseId: data.caseId,
      fileName: data.documentName,
      status: 'requested',
      required: data.required || false,
    }).returning();

    const [caseRecord] = await this.database.db.select().from(cases)
      .where(eq(cases.id, data.caseId)).limit(1);

    if (caseRecord) {
      const client = await this.lookupUser(caseRecord.clientUserId);
      const event: DocumentRequestedEvent = {
        caseId: data.caseId,
        documentName: data.documentName,
        clientUserId: caseRecord.clientUserId,
        clientEmail: client.email,
        clientName: client.name,
        attorneyName: data.attorneyName || '',
      };
      this.natsClient.emit(NatsSubjects.DOCUMENT_REQUESTED, event);
    }

    return { document: this.toDocMessage(doc) };
  }

  async createNote(data: {
    caseId: string;
    attorneyId: string;
    body: string;
    tag?: string;
  }) {
    const [note] = await this.database.db.insert(caseNotes).values({
      caseId: data.caseId,
      attorneyId: data.attorneyId,
      body: data.body,
      tag: data.tag,
    }).returning();

    return {
      note: {
        id: note.id,
        caseId: note.caseId,
        attorneyId: note.attorneyId,
        body: note.body,
        tag: note.tag || '',
        createdAt: note.createdAt.toISOString(),
      },
    };
  }

  async listNotes(data: { caseId: string; attorneyId?: string }) {
    const conditions: any[] = [eq(caseNotes.caseId, data.caseId)];
    if (data.attorneyId) conditions.push(eq(caseNotes.attorneyId, data.attorneyId));

    const rows = await this.database.db.select().from(caseNotes)
      .where(and(...conditions))
      .orderBy(caseNotes.createdAt);

    return {
      notes: rows.map((n) => ({
        id: n.id,
        caseId: n.caseId,
        attorneyId: n.attorneyId,
        body: n.body,
        tag: n.tag || '',
        createdAt: n.createdAt.toISOString(),
      })),
    };
  }

  async getCaseStrength(data: { caseId: string }) {
    const docs = await this.database.db.select().from(caseDocuments)
      .where(eq(caseDocuments.caseId, data.caseId));

    const total = docs.length;
    const complete = docs.filter((d) => d.status === 'done').length;
    const score = total > 0 ? Math.round((complete / total) * 100) : 0;

    return { score, docsComplete: complete, docsTotal: total };
  }

  /* ── NATS Event: create case when lead matched ─────────── */

  async onLeadMatched(data: {
    leadId: string;
    clientUserId: string;
    attorneyId: string;
    attorneyUserId: string;
    practiceArea: string;
    summary: string;
    city: string;
    state?: string;
    documents?: { fileKey: string; fileName: string; mimeType?: string }[];
  }) {
    // Check for duplicate
    const [existing] = await this.database.db.select().from(cases)
      .where(eq(cases.leadId, data.leadId)).limit(1);
    if (existing) return;

    const [caseRecord] = await this.database.db.insert(cases).values({
      leadId: data.leadId,
      clientUserId: data.clientUserId,
      attorneyId: data.attorneyId,
      attorneyUserId: data.attorneyUserId,
      practiceArea: data.practiceArea as any,
      matter: data.practiceArea,
      city: data.city,
      state: data.state,
      status: 'matched',
      stage: 1,
      summary: data.summary,
    }).returning();

    // Copy lead documents to case documents
    if (data.documents?.length) {
      await this.database.db.insert(caseDocuments).values(
        data.documents.map(doc => ({
          caseId: caseRecord.id,
          fileKey: doc.fileKey,
          fileName: doc.fileName,
          mimeType: doc.mimeType,
          status: doc.fileKey ? 'done' as const : 'requested' as const,
          required: false,
          uploadedAt: doc.fileKey ? new Date() : undefined,
        })),
      );
    }

    const event: CaseCreatedEvent = {
      caseId: caseRecord.id,
      leadId: data.leadId,
      clientUserId: data.clientUserId,
      attorneyId: data.attorneyId,
      attorneyUserId: data.attorneyUserId || '',
      practiceArea: data.practiceArea as any,
      matter: data.practiceArea,
    };
    this.natsClient.emit(NatsSubjects.CASE_CREATED, event);
  }

  /* ── Helpers ─────────────────────────────────────────────── */

  private async recalculateStrength(caseId: string) {
    const { score } = await this.getCaseStrength({ caseId });
    await this.database.db.update(cases)
      .set({ strengthScore: score, updatedAt: new Date() })
      .where(eq(cases.id, caseId));
  }

  private toCaseMessage(c: Case) {
    return {
      id: c.id,
      leadId: c.leadId,
      clientUserId: c.clientUserId,
      attorneyId: c.attorneyId || '',
      practiceArea: c.practiceArea,
      matter: c.matter || '',
      city: c.city || '',
      state: c.state || '',
      status: c.status,
      stage: c.stage,
      strengthScore: c.strengthScore || 0,
      summary: c.summary || '',
      openedAt: c.openedAt.toISOString(),
      closedAt: c.closedAt?.toISOString() || '',
    };
  }

  private toDocMessage(d: CaseDocument) {
    return {
      id: d.id,
      caseId: d.caseId,
      fileName: d.fileName,
      status: d.status,
      required: d.required || false,
      uploadedAt: d.uploadedAt?.toISOString() || '',
    };
  }
}
