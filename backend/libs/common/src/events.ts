import { UserRole, PracticeArea, LeadStatus, CaseStatus, AttorneyStatus, TrustRating } from './constants';

/* ── Event envelope ──────────────────────────────────────── */
export interface EventEnvelope<T = unknown> {
  eventId: string;
  eventType: string;
  timestamp: string;
  source: string;
  data: T;
  metadata: {
    correlationId: string;
    userId?: string;
  };
}

/* ── Auth events ─────────────────────────────────────────── */
export interface UserRegisteredEvent {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  verifyToken?: string;
  verifyExpiresAt?: string;
}

export interface UserDisabledEvent {
  userId: string;
  email: string;
  disabledBy: string;
}

export interface PasswordResetRequestedEvent {
  userId: string;
  email: string;
  name: string;
  resetToken: string;
  expiresAt: string;
}

/* ── Attorney events ─────────────────────────────────────── */
export interface AttorneyOnboardedEvent {
  attorneyId: string;
  userId: string;
  name: string;
  email: string;
  barNumber: string;
  specialties: PracticeArea[];
}

export interface AttorneyVerifiedEvent {
  attorneyId: string;
  userId: string;
  name: string;
  email: string;
  adminUserId: string;
  trustRating: TrustRating;
}

export interface AttorneyRejectedEvent {
  attorneyId: string;
  userId: string;
  name: string;
  email: string;
  adminUserId: string;
  reason?: string;
}

/* ── Lead events ─────────────────────────────────────────── */
export interface LeadCreatedEvent {
  leadId: string;
  clientUserId: string;
  practiceArea: PracticeArea;
  city: string;
  state: string;
}

export interface LeadScoredEvent {
  leadId: string;
  qualityScore: number;
  urgencyScore: number;
  estimatedValue: string;
}

export interface LeadMatchedEvent {
  leadId: string;
  clientUserId: string;
  clientName: string;
  clientEmail: string;
  attorneyId: string;
  attorneyUserId: string;
  attorneyName: string;
  attorneyEmail: string;
  practiceArea: PracticeArea;
  qualityScore: number;
  urgencyScore: number;
  summary: string;
  city: string;
}

export interface LeadViewedEvent {
  leadId: string;
  attorneyId: string;
}

export interface LeadClaimedEvent {
  leadId: string;
  attorneyId: string;
  attorneyUserId: string;
  attorneyName: string;
  clientUserId: string;
  clientName: string;
  clientEmail: string;
  practiceArea: PracticeArea;
  phone: string;
}

export interface LeadRespondedEvent {
  leadId: string;
  attorneyId: string;
  responseTimeMs: number;
}

/* ── Case events ─────────────────────────────────────────── */
export interface CaseCreatedEvent {
  caseId: string;
  leadId: string;
  clientUserId: string;
  attorneyId: string;
  attorneyUserId: string;
  practiceArea: PracticeArea;
  matter: string;
}

export interface CaseStageUpdatedEvent {
  caseId: string;
  clientUserId: string;
  clientEmail: string;
  clientName: string;
  previousStage: number;
  newStage: number;
  status: CaseStatus;
}

export interface CaseClosedEvent {
  caseId: string;
  clientUserId: string;
  attorneyId: string;
}

export interface DocumentUploadedEvent {
  caseId: string;
  documentId: string;
  fileName: string;
  uploadedByUserId: string;
}

export interface DocumentRequestedEvent {
  caseId: string;
  documentName: string;
  clientUserId: string;
  clientEmail: string;
  clientName: string;
  attorneyName: string;
}

/* ── Message events ──────────────────────────────────────── */
export interface MessageSentEvent {
  threadId: string;
  messageId: string;
  senderUserId: string;
  recipientUserId: string;
  caseId: string;
  preview: string;
}

/* ── Billing events ──────────────────────────────────────── */
export interface PaymentCompletedEvent {
  paymentId: string;
  attorneyId: string;
  amountCents: number;
  type: 'subscription' | 'lead_purchase';
  leadId?: string;
}

export interface PaymentFailedEvent {
  billingAccountId: string;
  attorneyUserId: string;
  attorneyEmail: string;
  attorneyName: string;
  amountCents: number;
  reason: string;
}

export interface InvoiceGeneratedEvent {
  invoiceId: string;
  attorneyUserId: string;
  attorneyEmail: string;
  attorneyName: string;
  amountCents: number;
  pdfUrl?: string;
}

export interface SubscriptionCancelledEvent {
  subscriptionId: string;
  attorneyUserId: string;
  attorneyEmail: string;
  attorneyName: string;
  planName: string;
}
