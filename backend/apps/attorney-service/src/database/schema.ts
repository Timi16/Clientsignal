import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const attorneyStatusEnum = pgEnum('attorney_status', ['pending', 'approved', 'review', 'rejected']);
export const trustRatingEnum = pgEnum('trust_rating', ['green', 'yellow', 'red']);
export const practiceAreaEnum = pgEnum('practice_area', ['injury', 'family', 'criminal', 'immigration', 'employment']);
export const verificationDecisionEnum = pgEnum('verification_decision', ['approve', 'reject']);

export const firms = pgTable('firms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  website: varchar('website', { length: 255 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const attorneys = pgTable('attorneys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  firmId: uuid('firm_id').references(() => firms.id),
  barNumber: varchar('bar_number', { length: 60 }).notNull(),
  bio: text('bio'),
  yearsExperience: integer('years_experience').default(0),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  status: attorneyStatusEnum('status').notNull().default('pending'),
  trustRating: trustRatingEnum('trust_rating'),
  totalLeads: integer('total_leads').default(0),
  responseTimeAvg: varchar('response_time_avg', { length: 20 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('attorneys_user_id_idx').on(table.userId),
  statusIdx: index('attorneys_status_idx').on(table.status),
}));

export const attorneySpecialties = pgTable('attorney_specialties', {
  id: uuid('id').primaryKey().defaultRandom(),
  attorneyId: uuid('attorney_id').notNull().references(() => attorneys.id, { onDelete: 'cascade' }),
  practiceArea: practiceAreaEnum('practice_area').notNull(),
}, (table) => ({
  attorneyIdx: index('attorney_specialties_attorney_idx').on(table.attorneyId),
}));

export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  attorneyId: uuid('attorney_id').notNull().references(() => attorneys.id, { onDelete: 'cascade' }),
  adminUserId: uuid('admin_user_id'),
  checklistJson: text('checklist_json'),
  decision: verificationDecisionEnum('decision'),
  reason: text('reason'),
  slaDeadline: timestamp('sla_deadline', { withTimezone: true }),
  decidedAt: timestamp('decided_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  attorneyIdx: index('verifications_attorney_idx').on(table.attorneyId),
}));

export const attorneyPreferences = pgTable('attorney_preferences', {
  attorneyId: uuid('attorney_id').primaryKey().references(() => attorneys.id, { onDelete: 'cascade' }),
  notificationSms: boolean('notification_sms').default(true),
  notificationEmail: boolean('notification_email').default(true),
  notificationPush: boolean('notification_push').default(true),
  leadVolumeTarget: integer('lead_volume_target').default(10),
  maxBudget: integer('max_budget').default(0),
});

export const attorneyIntegrations = pgTable('attorney_integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  attorneyId: uuid('attorney_id').notNull().references(() => attorneys.id, { onDelete: 'cascade' }),
  integrationName: varchar('integration_name', { length: 60 }).notNull(),
  connected: boolean('connected').default(false),
  config: text('config'),
  connectedAt: timestamp('connected_at', { withTimezone: true }),
}, (table) => ({
  attorneyIdx: index('attorney_integrations_attorney_idx').on(table.attorneyId),
}));

/* ── Relations ───────────────────────────────────────────── */
export const firmsRelations = relations(firms, ({ many }) => ({
  attorneys: many(attorneys),
}));

export const attorneysRelations = relations(attorneys, ({ one, many }) => ({
  firm: one(firms, { fields: [attorneys.firmId], references: [firms.id] }),
  specialties: many(attorneySpecialties),
  verifications: many(verifications),
  preferences: one(attorneyPreferences, { fields: [attorneys.id], references: [attorneyPreferences.attorneyId] }),
  integrations: many(attorneyIntegrations),
}));

export const attorneySpecialtiesRelations = relations(attorneySpecialties, ({ one }) => ({
  attorney: one(attorneys, { fields: [attorneySpecialties.attorneyId], references: [attorneys.id] }),
}));

export const verificationsRelations = relations(verifications, ({ one }) => ({
  attorney: one(attorneys, { fields: [verifications.attorneyId], references: [attorneys.id] }),
}));

export const attorneyIntegrationsRelations = relations(attorneyIntegrations, ({ one }) => ({
  attorney: one(attorneys, { fields: [attorneyIntegrations.attorneyId], references: [attorneys.id] }),
}));

/* ── Types ───────────────────────────────────────────────── */
export type Attorney = InferSelectModel<typeof attorneys>;
export type NewAttorney = InferInsertModel<typeof attorneys>;
export type Firm = InferSelectModel<typeof firms>;
export type Verification = InferSelectModel<typeof verifications>;
