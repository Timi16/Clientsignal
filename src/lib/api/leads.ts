import { get, post } from "./client";

export interface Lead {
  id: string;
  clientUserId: string;
  name: string;
  practiceArea: string;
  subType: string;
  qualityScore: number;
  urgencyScore: number;
  city: string;
  state: string;
  summary: string;
  estimatedValue: string;
  phone: string;
  consent: boolean;
  docCount: number;
  status: string;
  channel: string;
  matchedAttorneyId: string;
  createdAt: string;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
}

export async function listLeads(params?: {
  status?: string;
  practiceArea?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  city?: string;
  state?: string;
  limit?: number;
  offset?: number;
}): Promise<LeadsResponse> {
  const p: Record<string, string> = {};
  if (params?.status) p.status = params.status;
  if (params?.practiceArea) p.practiceArea = params.practiceArea;
  if (params?.search) p.search = params.search;
  if (params?.sortBy) p.sortBy = params.sortBy;
  if (params?.sortOrder) p.sortOrder = params.sortOrder;
  if (params?.city) p.city = params.city;
  if (params?.state) p.state = params.state;
  if (params?.limit) p.limit = String(params.limit);
  if (params?.offset) p.offset = String(params.offset);
  return get<LeadsResponse>("/leads", { params: p });
}

export async function getLead(id: string): Promise<{ lead: Lead }> {
  return get<{ lead: Lead }>(`/leads/${id}`);
}

export async function submitIntake(data: {
  practiceArea: string;
  subType?: string;
  description: string;
  city: string;
  state: string;
  urgent?: boolean;
  consent: boolean;
  phone?: string;
  channel?: string;
}): Promise<{ lead: Lead }> {
  return post<{ lead: Lead }>("/leads/intake", { body: data });
}

export async function viewLead(id: string) {
  return post(`/leads/${id}/view`);
}

export async function claimLead(id: string): Promise<{ lead: Lead; phone: string; success: boolean }> {
  return post<{ lead: Lead; phone: string; success: boolean }>(`/leads/${id}/claim`);
}

export async function getLeadUploadUrl(leadId: string, fileName: string, mimeType: string) {
  return post<{ url: string; documentId: string; fileKey: string }>(`/leads/${leadId}/upload-url`, {
    body: { fileName, mimeType },
  });
}

export async function getLeadDownloadUrl(leadId: string, docId: string) {
  return get<{ url: string; fileName: string }>(`/leads/${leadId}/documents/${docId}/download-url`);
}
