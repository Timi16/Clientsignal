import { get, post, put } from "./client";

export interface Attorney {
  id: string;
  userId: string;
  barNumber: string;
  bio: string;
  yearsExperience: number;
  city: string;
  state: string;
  status: string;
  trustRating: string;
  totalLeads: number;
  responseTimeAvg: string;
  firmName: string;
  firmId: string;
  specialties: string[];
  name: string;
  email: string;
  createdAt: string;
}

export interface AttorneyPreferences {
  notificationSms: boolean;
  notificationEmail: boolean;
  notificationPush: boolean;
  leadVolumeTarget: number;
  maxBudget: number;
}

export interface Integration {
  name: string;
  description: string;
  category: string;
  connected: boolean;
  color: string;
}

export async function onboard(data: {
  barNumber: string;
  bio: string;
  yearsExperience: number;
  city: string;
  state: string;
  firmName: string;
  specialties: string[];
}): Promise<{ attorney: Attorney }> {
  return post<{ attorney: Attorney }>("/attorneys/onboard", { body: data });
}

export async function getProfile(): Promise<{ attorney: Attorney }> {
  return get<{ attorney: Attorney }>("/attorneys/profile");
}

export async function updateProfile(data: {
  bio?: string;
  city?: string;
  state?: string;
  specialties?: string[];
}) {
  return put<{ attorney: Attorney }>("/attorneys/profile", { body: data });
}

export async function getPreferences(): Promise<{ preferences: AttorneyPreferences }> {
  return get<{ preferences: AttorneyPreferences }>("/attorneys/preferences");
}

export async function updatePreferences(data: Partial<AttorneyPreferences>) {
  return put<{ preferences: AttorneyPreferences }>("/attorneys/preferences", { body: data });
}

export async function getAnalytics() {
  return get<{
    totalLeads: number;
    leadsThisMonth: number;
    responseTimeAvg: string;
    conversionRate: number;
    revenue: number;
  }>("/attorneys/analytics");
}

export async function listIntegrations(): Promise<{ integrations: Integration[] }> {
  return get<{ integrations: Integration[] }>("/attorneys/integrations");
}

export async function toggleIntegration(name: string, connected: boolean): Promise<{ integration: Integration }> {
  return post<{ integration: Integration }>(`/attorneys/integrations/${name}/toggle`, {
    body: { connected },
  });
}
