import { get, post, put } from "./client";

export interface Case {
  id: string;
  leadId: string;
  clientUserId: string;
  attorneyId: string;
  practiceArea: string;
  matter: string;
  city: string;
  state: string;
  status: string;
  stage: number;
  strengthScore: number;
  summary: string;
  openedAt: string;
  closedAt: string;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  fileName: string;
  status: string;
  required: boolean;
  uploadedAt: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  attorneyId: string;
  body: string;
  tag: string;
  createdAt: string;
}

interface CasesResponse {
  cases: Case[];
  total: number;
}

export async function listCases(params?: {
  status?: string;
  practiceArea?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  offset?: number;
}): Promise<CasesResponse> {
  const p: Record<string, string> = {};
  if (params?.status) p.status = params.status;
  if (params?.practiceArea) p.practiceArea = params.practiceArea;
  if (params?.search) p.search = params.search;
  if (params?.sortBy) p.sortBy = params.sortBy;
  if (params?.sortOrder) p.sortOrder = params.sortOrder;
  if (params?.limit) p.limit = String(params.limit);
  if (params?.offset) p.offset = String(params.offset);
  return get<CasesResponse>("/cases", { params: p });
}

export async function getCase(id: string): Promise<{ caseData: Case }> {
  return get<{ caseData: Case }>(`/cases/${id}`);
}

export async function updateCaseStage(caseId: string, stage: number) {
  return put<{ caseData: Case }>(`/cases/${caseId}/stage`, { body: { stage } });
}

export async function updateCaseStatus(caseId: string, status: string) {
  return put<{ caseData: Case }>(`/cases/${caseId}/status`, { body: { status } });
}

export async function getDocumentUploadUrl(caseId: string, fileName: string, mimeType: string, required = false) {
  return post<{ url: string; documentId: string; fileKey: string }>(`/cases/${caseId}/documents/upload-url`, {
    body: { fileName, mimeType, required },
  });
}

export async function confirmDocumentUpload(caseId: string, docId: string) {
  return post<{ document: CaseDocument }>(`/cases/${caseId}/documents/${docId}/confirm`);
}

export async function getDocumentDownloadUrl(caseId: string, docId: string) {
  return get<{ url: string; fileName: string }>(`/cases/${caseId}/documents/${docId}/download-url`);
}

export async function listDocuments(caseId: string) {
  return get<{ documents: CaseDocument[] }>(`/cases/${caseId}/documents`);
}

export async function requestDocument(caseId: string, documentName: string, required = true) {
  return post<{ document: CaseDocument }>(`/cases/${caseId}/documents/request`, {
    body: { documentName, required },
  });
}

export async function createNote(caseId: string, body: string, tag?: string) {
  return post<{ note: CaseNote }>(`/cases/${caseId}/notes`, { body: { body, tag } });
}

export async function listNotes(caseId: string) {
  return get<{ notes: CaseNote[] }>(`/cases/${caseId}/notes`);
}

export async function getCaseStrength(caseId: string) {
  return get<{ score: number; docsComplete: number; docsTotal: number }>(`/cases/${caseId}/strength`);
}
