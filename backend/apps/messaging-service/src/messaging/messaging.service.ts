import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { eq, and, isNull, desc, ne, or, sql, inArray } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { threads, messages, notificationPreferences, notifications, Thread, Message } from '../database/schema';
import { NatsSubjects, Services } from '@cs/common';
import type { MessageSentEvent } from '@cs/common';

@Injectable()
export class MessagingService {
  constructor(
    private readonly database: DatabaseService,
    @Inject(Services.NATS) private readonly natsClient: ClientProxy,
  ) {}

  async listThreads(data: { userId: string; limit?: number; offset?: number }) {
    const limit = data.limit || 50;
    const offset = data.offset || 0;

    const rows = await this.database.db.select().from(threads)
      .where(or(
        eq(threads.clientUserId, data.userId),
        eq(threads.attorneyUserId, data.userId),
      ))
      .orderBy(desc(threads.createdAt))
      .limit(limit).offset(offset);

    const threadMessages = await Promise.all(rows.map(async (t) => {
      const [lastMsg] = await this.database.db.select().from(messages)
        .where(eq(messages.threadId, t.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const unreadRows = await this.database.db.select({ count: sql<number>`count(*)::int` })
        .from(messages)
        .where(and(
          eq(messages.threadId, t.id),
          isNull(messages.readAt),
          ne(messages.senderUserId, data.userId),
        ));

      return {
        id: t.id,
        caseId: t.caseId,
        clientUserId: t.clientUserId,
        attorneyId: t.attorneyId,
        attorneyUserId: t.attorneyUserId || '',
        unreadCount: unreadRows[0]?.count || 0,
        lastMessage: lastMsg ? this.toMessageItem(lastMsg) : undefined,
        createdAt: t.createdAt.toISOString(),
      };
    }));

    return { threads: threadMessages, total: threadMessages.length };
  }

  async getThread(data: { threadId: string; messageLimit?: number; messageOffset?: number }) {
    const [thread] = await this.database.db.select().from(threads)
      .where(eq(threads.id, data.threadId)).limit(1);
    if (!thread) throw new RpcException('Thread not found');

    const limit = data.messageLimit || 50;
    const offset = data.messageOffset || 0;

    const msgs = await this.database.db.select().from(messages)
      .where(eq(messages.threadId, data.threadId))
      .orderBy(desc(messages.createdAt))
      .limit(limit).offset(offset);

    return {
      thread: {
        id: thread.id,
        caseId: thread.caseId,
        clientUserId: thread.clientUserId,
        attorneyId: thread.attorneyId,
        attorneyUserId: thread.attorneyUserId || '',
        unreadCount: 0,
        lastMessage: msgs[0] ? this.toMessageItem(msgs[0]) : undefined,
        createdAt: thread.createdAt.toISOString(),
      },
      messages: msgs.map((m) => this.toMessageItem(m)),
    };
  }

  async sendMessage(data: { threadId: string; senderUserId: string; body: string }) {
    const [thread] = await this.database.db.select().from(threads)
      .where(eq(threads.id, data.threadId)).limit(1);
    if (!thread) throw new RpcException('Thread not found');

    const [msg] = await this.database.db.insert(messages).values({
      threadId: data.threadId,
      senderUserId: data.senderUserId,
      body: data.body,
    }).returning();

    // Determine recipient
    const recipientUserId = data.senderUserId === thread.clientUserId
      ? (thread.attorneyUserId || thread.attorneyId)
      : thread.clientUserId;

    const event: MessageSentEvent = {
      threadId: data.threadId,
      messageId: msg.id,
      senderUserId: data.senderUserId,
      recipientUserId,
      caseId: thread.caseId,
      preview: data.body.slice(0, 100),
    };
    this.natsClient.emit(NatsSubjects.MESSAGE_SENT, event);

    return { message: this.toMessageItem(msg) };
  }

  async markRead(data: { threadId: string; userId: string }) {
    await this.database.db.update(messages)
      .set({ readAt: new Date() })
      .where(and(
        eq(messages.threadId, data.threadId),
        isNull(messages.readAt),
        ne(messages.senderUserId, data.userId),
      ));

    this.natsClient.emit(NatsSubjects.MESSAGE_READ, {
      threadId: data.threadId,
      userId: data.userId,
    });

    return { ok: true };
  }

  async getNotificationPreferences(data: { userId: string }) {
    const [prefs] = await this.database.db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.userId, data.userId)).limit(1);

    return {
      preferences: {
        userId: data.userId,
        smsEnabled: prefs?.smsEnabled ?? true,
        emailEnabled: prefs?.emailEnabled ?? true,
        pushEnabled: prefs?.pushEnabled ?? true,
      },
    };
  }

  async updateNotificationPreferences(data: {
    userId: string;
    smsEnabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
  }) {
    const [existing] = await this.database.db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.userId, data.userId)).limit(1);

    const values: any = { userId: data.userId };
    if (data.smsEnabled !== undefined) values.smsEnabled = data.smsEnabled;
    if (data.emailEnabled !== undefined) values.emailEnabled = data.emailEnabled;
    if (data.pushEnabled !== undefined) values.pushEnabled = data.pushEnabled;

    if (existing) {
      const [updated] = await this.database.db.update(notificationPreferences)
        .set(values)
        .where(eq(notificationPreferences.id, existing.id))
        .returning();
      return {
        preferences: {
          userId: data.userId,
          smsEnabled: updated.smsEnabled ?? true,
          emailEnabled: updated.emailEnabled ?? true,
          pushEnabled: updated.pushEnabled ?? true,
        },
      };
    }

    const [inserted] = await this.database.db.insert(notificationPreferences).values(values).returning();
    return {
      preferences: {
        userId: data.userId,
        smsEnabled: inserted.smsEnabled ?? true,
        emailEnabled: inserted.emailEnabled ?? true,
        pushEnabled: inserted.pushEnabled ?? true,
      },
    };
  }

  async getUnreadCount(data: { userId: string }) {
    const userThreads = await this.database.db.select({ id: threads.id }).from(threads)
      .where(or(
        eq(threads.clientUserId, data.userId),
        eq(threads.attorneyUserId, data.userId),
      ));

    if (!userThreads.length) return { count: 0 };

    const threadIds = userThreads.map((t) => t.id);
    const [{ count }] = await this.database.db.select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(
        inArray(messages.threadId, threadIds),
        isNull(messages.readAt),
        ne(messages.senderUserId, data.userId),
      ));

    return { count: count || 0 };
  }

  /* ── NATS: auto-create thread when case created ────────── */

  async onCaseCreated(data: {
    caseId: string;
    clientUserId: string;
    attorneyId: string;
    attorneyUserId: string;
  }) {
    // Check for duplicate
    const [existing] = await this.database.db.select().from(threads)
      .where(eq(threads.caseId, data.caseId)).limit(1);
    if (existing) return;

    await this.database.db.insert(threads).values({
      caseId: data.caseId,
      clientUserId: data.clientUserId,
      attorneyId: data.attorneyId,
      attorneyUserId: data.attorneyUserId,
    });
  }

  /* ── Helpers ─────────────────────────────────────────────── */

  private toMessageItem(m: Message) {
    return {
      id: m.id,
      threadId: m.threadId,
      senderUserId: m.senderUserId,
      body: m.body,
      readAt: m.readAt?.toISOString() || '',
      createdAt: m.createdAt.toISOString(),
    };
  }
}
