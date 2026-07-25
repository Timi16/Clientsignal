/* ── Service identifiers ─────────────────────────────────── */
export const Services = {
  AUTH: 'AUTH_SERVICE',
  ATTORNEY: 'ATTORNEY_SERVICE',
  LEAD: 'LEAD_SERVICE',
  CASE: 'CASE_SERVICE',
  MESSAGING: 'MESSAGING_SERVICE',
  BILLING: 'BILLING_SERVICE',
  NATS: 'NATS_CLIENT',
} as const;

/* ── gRPC package names (match .proto files) ─────────────── */
export const GrpcPackages = {
  AUTH: 'auth',
  ATTORNEY: 'attorney',
  LEAD: 'lead',
  CASE: 'cs_case',
  MESSAGING: 'messaging',
  BILLING: 'billing',
} as const;

/* ── NATS subjects ───────────────────────────────────────── */
export const NatsSubjects = {
  // Auth
  USER_REGISTERED: 'user.registered',
  USER_DISABLED: 'user.disabled',
  PASSWORD_RESET_REQUESTED: 'auth.password_reset_requested',

  // Attorney
  ATTORNEY_ONBOARDED: 'attorney.onboarded',
  ATTORNEY_VERIFIED: 'attorney.verified',
  ATTORNEY_REJECTED: 'attorney.rejected',
  ATTORNEY_PROFILE_UPDATED: 'attorney.profile_updated',
  ATTORNEY_PREFERENCES_UPDATED: 'attorney.preferences_updated',

  // Lead
  LEAD_CREATED: 'lead.created',
  LEAD_SCORED: 'lead.scored',
  LEAD_MATCHED: 'lead.matched',
  LEAD_VIEWED: 'lead.viewed',
  LEAD_CLAIMED: 'lead.claimed',
  LEAD_RESPONDED: 'lead.responded',

  // Case
  CASE_CREATED: 'case.created',
  CASE_STAGE_UPDATED: 'case.stage_updated',
  CASE_STATUS_UPDATED: 'case.status_updated',
  CASE_CLOSED: 'case.closed',
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_REQUESTED: 'document.requested',

  // Messaging
  MESSAGE_SENT: 'message.sent',
  MESSAGE_READ: 'message.read',
  NOTIFICATION_SENT: 'notification.sent',

  // Billing
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  INVOICE_GENERATED: 'invoice.generated',
} as const;

/* ── User roles ──────────────────────────────────────────── */
export type UserRole = 'client' | 'attorney' | 'admin';
export const USER_ROLES: UserRole[] = ['client', 'attorney', 'admin'];

/* ── Practice areas ──────────────────────────────────────── */
export const PRACTICE_AREAS = ['injury', 'family', 'criminal', 'immigration', 'employment'] as const;
export type PracticeArea = (typeof PRACTICE_AREAS)[number];

/* ── Lead statuses ───────────────────────────────────────── */
export const LEAD_STATUSES = ['new', 'viewed', 'claimed', 'responded'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/* ── Case statuses ───────────────────────────────────────── */
export const CASE_STATUSES = ['pending', 'matched', 'active', 'closed'] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

/* ── Attorney statuses ───────────────────────────────────── */
export const ATTORNEY_STATUSES = ['pending', 'approved', 'review', 'rejected'] as const;
export type AttorneyStatus = (typeof ATTORNEY_STATUSES)[number];

/* ── Trust ratings ───────────────────────────────────────── */
export const TRUST_RATINGS = ['green', 'yellow', 'red'] as const;
export type TrustRating = (typeof TRUST_RATINGS)[number];

/* ── Note tags ───────────────────────────────────────────── */
export const NOTE_TAGS = ['follow-up', 'initial-consult', 'urgent'] as const;
export type NoteTag = (typeof NOTE_TAGS)[number];

/* ── Document statuses ───────────────────────────────────── */
export const DOC_STATUSES = ['done', 'requested', 'missing', 'pending'] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];
