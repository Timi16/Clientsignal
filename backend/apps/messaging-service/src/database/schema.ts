import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const notificationChannelEnum = pgEnum('notification_channel', ['sms', 'email', 'push']);

export const threads = pgTable('threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseId: uuid('case_id').notNull(),
  clientUserId: uuid('client_user_id').notNull(),
  attorneyId: uuid('attorney_id').notNull(),
  attorneyUserId: uuid('attorney_user_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  caseIdx: uniqueIndex('threads_case_id_idx').on(table.caseId),
  clientIdx: index('threads_client_user_id_idx').on(table.clientUserId),
  attorneyIdx: index('threads_attorney_id_idx').on(table.attorneyId),
}));

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => threads.id, { onDelete: 'cascade' }),
  senderUserId: uuid('sender_user_id').notNull(),
  body: text('body').notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  threadIdx: index('messages_thread_id_idx').on(table.threadId),
  senderIdx: index('messages_sender_user_id_idx').on(table.senderUserId),
}));

export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  smsEnabled: boolean('sms_enabled').default(true),
  emailEnabled: boolean('email_enabled').default(true),
  pushEnabled: boolean('push_enabled').default(true),
}, (table) => ({
  userIdx: uniqueIndex('notification_prefs_user_idx').on(table.userId),
}));

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  type: varchar('type', { length: 60 }).notNull(),
  title: varchar('title', { length: 255 }),
  body: text('body'),
  channel: notificationChannelEnum('channel'),
  payload: text('payload'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('notifications_user_id_idx').on(table.userId),
}));

/* ── Relations ───────────────────────────────────────────── */
export const threadsRelations = relations(threads, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  thread: one(threads, { fields: [messages.threadId], references: [threads.id] }),
}));

/* ── Types ───────────────────────────────────────────────── */
export type Thread = InferSelectModel<typeof threads>;
export type Message = InferSelectModel<typeof messages>;
export type Notification = InferSelectModel<typeof notifications>;
