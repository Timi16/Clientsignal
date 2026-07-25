import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const practiceAreaEnum = pgEnum('practice_area', ['injury', 'family', 'criminal', 'immigration', 'employment']);
export const leadStatusEnum = pgEnum('lead_status', ['new', 'viewed', 'claimed', 'responded']);

export const intakeSubmissions = pgTable('intake_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientUserId: uuid('client_user_id').notNull(),
  practiceArea: practiceAreaEnum('practice_area').notNull(),
  subType: varchar('sub_type', { length: 120 }),
  description: text('description'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  urgent: boolean('urgent').default(false),
  consent: boolean('consent').default(false),
  phone: varchar('phone', { length: 30 }),
  channel: varchar('channel', { length: 60 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  clientIdx: index('intake_client_user_id_idx').on(table.clientUserId),
}));

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  intakeId: uuid('intake_id').notNull().references(() => intakeSubmissions.id),
  clientUserId: uuid('client_user_id').notNull(),
  clientName: varchar('client_name', { length: 160 }),
  clientEmail: varchar('client_email', { length: 255 }),
  practiceArea: practiceAreaEnum('practice_area').notNull(),
  subType: varchar('sub_type', { length: 120 }),
  qualityScore: integer('quality_score').default(0),
  urgencyScore: integer('urgency_score').default(0),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  summary: text('summary'),
  estimatedValue: varchar('estimated_value', { length: 30 }),
  phone: varchar('phone', { length: 30 }),
  consent: boolean('consent').default(false),
  channel: varchar('channel', { length: 60 }),
  status: leadStatusEnum('status').notNull().default('new'),
  matchedAttorneyId: uuid('matched_attorney_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  clientIdx: index('leads_client_user_id_idx').on(table.clientUserId),
  statusIdx: index('leads_status_idx').on(table.status),
  attorneyIdx: index('leads_matched_attorney_idx').on(table.matchedAttorneyId),
}));

export const leadClaims = pgTable('lead_claims', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id),
  attorneyId: uuid('attorney_id').notNull(),
  claimedAt: timestamp('claimed_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  leadIdx: index('lead_claims_lead_idx').on(table.leadId),
  attorneyIdx: index('lead_claims_attorney_idx').on(table.attorneyId),
}));

export const leadDocuments = pgTable('lead_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  fileKey: varchar('file_key', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  leadIdx: index('lead_documents_lead_idx').on(table.leadId),
}));

/* ── Relations ───────────────────────────────────────────── */
export const intakeSubmissionsRelations = relations(intakeSubmissions, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  intake: one(intakeSubmissions, { fields: [leads.intakeId], references: [intakeSubmissions.id] }),
  claims: many(leadClaims),
  documents: many(leadDocuments),
}));

export const leadClaimsRelations = relations(leadClaims, ({ one }) => ({
  lead: one(leads, { fields: [leadClaims.leadId], references: [leads.id] }),
}));

export const leadDocumentsRelations = relations(leadDocuments, ({ one }) => ({
  lead: one(leads, { fields: [leadDocuments.leadId], references: [leads.id] }),
}));

/* ── Types ───────────────────────────────────────────────── */
export type Lead = InferSelectModel<typeof leads>;
export type NewLead = InferInsertModel<typeof leads>;
export type IntakeSubmission = InferSelectModel<typeof intakeSubmissions>;
