import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const practiceAreaEnum = pgEnum('practice_area', ['injury', 'family', 'criminal', 'immigration', 'employment']);
export const caseStatusEnum = pgEnum('case_status', ['pending', 'matched', 'active', 'closed']);
export const docStatusEnum = pgEnum('doc_status', ['done', 'requested', 'missing', 'pending']);

export const cases = pgTable('cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull(),
  clientUserId: uuid('client_user_id').notNull(),
  attorneyId: uuid('attorney_id'),
  attorneyUserId: uuid('attorney_user_id'),
  practiceArea: practiceAreaEnum('practice_area').notNull(),
  matter: varchar('matter', { length: 200 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  status: caseStatusEnum('status').notNull().default('pending'),
  stage: integer('stage').notNull().default(1),
  strengthScore: integer('strength_score').default(0),
  summary: text('summary'),
  openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  clientIdx: index('cases_client_user_id_idx').on(table.clientUserId),
  attorneyIdx: index('cases_attorney_id_idx').on(table.attorneyId),
  statusIdx: index('cases_status_idx').on(table.status),
  leadIdx: index('cases_lead_id_idx').on(table.leadId),
}));

export const caseDocuments = pgTable('case_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseId: uuid('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  fileKey: varchar('file_key', { length: 500 }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  status: docStatusEnum('status').notNull().default('pending'),
  required: boolean('required').default(false),
  uploadedByUserId: uuid('uploaded_by_user_id'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  caseIdx: index('case_documents_case_id_idx').on(table.caseId),
}));

export const caseNotes = pgTable('case_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseId: uuid('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  attorneyId: uuid('attorney_id').notNull(),
  body: text('body').notNull(),
  tag: varchar('tag', { length: 30 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  caseIdx: index('case_notes_case_id_idx').on(table.caseId),
}));

/* ── Relations ───────────────────────────────────────────── */
export const casesRelations = relations(cases, ({ many }) => ({
  documents: many(caseDocuments),
  notes: many(caseNotes),
}));

export const caseDocumentsRelations = relations(caseDocuments, ({ one }) => ({
  caseRecord: one(cases, { fields: [caseDocuments.caseId], references: [cases.id] }),
}));

export const caseNotesRelations = relations(caseNotes, ({ one }) => ({
  caseRecord: one(cases, { fields: [caseNotes.caseId], references: [cases.id] }),
}));

/* ── Types ───────────────────────────────────────────────── */
export type Case = InferSelectModel<typeof cases>;
export type NewCase = InferInsertModel<typeof cases>;
export type CaseDocument = InferSelectModel<typeof caseDocuments>;
export type CaseNote = InferSelectModel<typeof caseNotes>;
