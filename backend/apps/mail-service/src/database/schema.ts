import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  subject: varchar('subject', { length: 255 }).notNull(),
  htmlBody: text('html_body').notNull(),
  textBody: text('text_body').notNull(),
  variables: text('variables'), // JSON array of variable names
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const emailLogs = pgTable('email_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  toEmail: varchar('to_email', { length: 255 }).notNull(),
  fromEmail: varchar('from_email', { length: 255 }).notNull(),
  templateSlug: varchar('template_slug', { length: 100 }),
  subject: varchar('subject', { length: 255 }).notNull(),
  resendId: varchar('resend_id', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('queued'),
  openedAt: timestamp('opened_at', { withTimezone: true }),
  clickedAt: timestamp('clicked_at', { withTimezone: true }),
  error: text('error'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  toEmailIdx: index('email_logs_to_email_idx').on(table.toEmail),
  templateSlugIdx: index('email_logs_template_slug_idx').on(table.templateSlug),
  statusIdx: index('email_logs_status_idx').on(table.status),
}));

export type EmailTemplate = InferSelectModel<typeof emailTemplates>;
export type NewEmailTemplate = InferInsertModel<typeof emailTemplates>;
export type EmailLog = InferSelectModel<typeof emailLogs>;
export type NewEmailLog = InferInsertModel<typeof emailLogs>;
