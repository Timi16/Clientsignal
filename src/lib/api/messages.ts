import { get, post, put } from "./client";

export interface Thread {
  id: string;
  caseId: string;
  clientUserId: string;
  attorneyId: string;
  attorneyUserId: string;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderUserId: string;
  body: string;
  readAt: string;
  createdAt: string;
}

export interface NotificationPreferences {
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

export async function listThreads(params?: {
  limit?: number;
  offset?: number;
}): Promise<{ threads: Thread[]; total: number }> {
  const p: Record<string, string> = {};
  if (params?.limit) p.limit = String(params.limit);
  if (params?.offset) p.offset = String(params.offset);
  return get<{ threads: Thread[]; total: number }>("/messages/threads", { params: p });
}

export async function getThread(
  threadId: string,
  params?: { messageLimit?: number; messageOffset?: number },
): Promise<{ thread: Thread; messages: Message[] }> {
  const p: Record<string, string> = {};
  if (params?.messageLimit) p.messageLimit = String(params.messageLimit);
  if (params?.messageOffset) p.messageOffset = String(params.messageOffset);
  return get<{ thread: Thread; messages: Message[] }>(`/messages/threads/${threadId}`, { params: p });
}

export async function sendMessage(threadId: string, body: string): Promise<{ message: Message }> {
  return post<{ message: Message }>(`/messages/threads/${threadId}/messages`, { body: { body } });
}

export async function markRead(threadId: string) {
  return post(`/messages/threads/${threadId}/read`);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  return get<{ count: number }>("/messages/unread");
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return get<NotificationPreferences>("/messages/preferences");
}

export async function updateNotificationPreferences(data: Partial<NotificationPreferences>) {
  return put("/messages/preferences", { body: data });
}
