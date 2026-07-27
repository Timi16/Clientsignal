import { get, post } from "./client";
import type { Attorney } from "./attorneys";
import type { Lead } from "./leads";

export interface Verification {
  id: string;
  attorneyId: string;
  adminUserId: string;
  checklistJson: string;
  decision: string;
  slaDeadline: string;
  decidedAt: string;
  createdAt: string;
  attorney?: Attorney;
}

export async function getVerificationQueue(params?: {
  limit?: number;
  offset?: number;
}): Promise<{ verifications: Verification[]; total: number }> {
  const p: Record<string, string> = {};
  if (params?.limit) p.limit = String(params.limit);
  if (params?.offset) p.offset = String(params.offset);
  return get<{ verifications: Verification[]; total: number }>("/admin/verifications", { params: p });
}

export async function decideVerification(data: {
  verificationId: string;
  attorneyId: string;
  decision: "approve" | "reject";
  trustRating?: string;
  reason?: string;
  checklistJson?: Record<string, boolean>;
}) {
  return post(`/admin/verifications/${data.verificationId}/decide`, {
    body: {
      attorneyId: data.attorneyId,
      decision: data.decision,
      trustRating: data.trustRating || "green",
      reason: data.reason || "",
      checklistJson: data.checklistJson,
    },
  });
}

export async function listAttorneys(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ attorneys: Attorney[]; total: number }> {
  const p: Record<string, string> = {};
  if (params?.status) p.status = params.status;
  if (params?.limit) p.limit = String(params.limit);
  if (params?.offset) p.offset = String(params.offset);
  return get<{ attorneys: Attorney[]; total: number }>("/admin/attorneys", { params: p });
}

export async function adminListLeads(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ leads: Lead[]; total: number }> {
  const p: Record<string, string> = {};
  if (params?.status) p.status = params.status;
  if (params?.limit) p.limit = String(params.limit);
  if (params?.offset) p.offset = String(params.offset);
  return get<{ leads: Lead[]; total: number }>("/admin/leads", { params: p });
}

export async function updateLeadQA(leadId: string, data: {
  qualityScore?: number;
  urgencyScore?: number;
  status?: string;
}) {
  return post(`/admin/leads/${leadId}/qa`, { body: data });
}

export async function listAuditLogs(params?: {
  userId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  const p: Record<string, string> = {};
  if (params?.userId) p.userId = params.userId;
  if (params?.action) p.action = params.action;
  if (params?.limit) p.limit = String(params.limit);
  if (params?.offset) p.offset = String(params.offset);
  return get<{ logs: unknown[]; total: number }>("/admin/audit-logs", { params: p });
}
