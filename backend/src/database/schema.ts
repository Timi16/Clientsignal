import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["client", "attorney", "admin"]);
export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  role: userRoleEnum("role").notNull().default("client"),
  passwordHash: text("password_hash").notNull(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  disabledAt: timestamp("disabled_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, table => ({
  emailIdx: index("users_email_idx").on(table.email),
  roleIdx: index("users_role_idx").on(table.role),
}));

export const refreshSessions = pgTable("refresh_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, table => ({
  userIdx: index("refresh_sessions_user_id_idx").on(table.userId),
  tokenHashIdx: index("refresh_sessions_token_hash_idx").on(table.tokenHash),
}));

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 120 }).notNull(),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, table => ({
  userIdx: index("audit_logs_user_id_idx").on(table.userId),
  actionIdx: index("audit_logs_action_idx").on(table.action),
}));

export const usersRelations = relations(users, ({ many }) => ({
  refreshSessions: many(refreshSessions),
  auditLogs: many(auditLogs),
}));

export const refreshSessionsRelations = relations(refreshSessions, ({ one }) => ({
  user: one(users, {
    fields: [refreshSessions.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type RefreshSession = InferSelectModel<typeof refreshSessions>;
