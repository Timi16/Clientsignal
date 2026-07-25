import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';
import { MessagingService } from './messaging.service';
import { NatsSubjects } from '@cs/common';
import type { CaseCreatedEvent } from '@cs/common';

@Controller()
export class MessagingController {
  constructor(private readonly service: MessagingService) {}

  @GrpcMethod('MessagingService', 'ListThreads')
  listThreads(data: any) { return this.service.listThreads(data); }

  @GrpcMethod('MessagingService', 'GetThread')
  getThread(data: any) { return this.service.getThread(data); }

  @GrpcMethod('MessagingService', 'SendMessage')
  sendMessage(data: any) { return this.service.sendMessage(data); }

  @GrpcMethod('MessagingService', 'MarkRead')
  markRead(data: any) { return this.service.markRead(data); }

  @GrpcMethod('MessagingService', 'GetNotificationPreferences')
  getNotificationPreferences(data: any) { return this.service.getNotificationPreferences(data); }

  @GrpcMethod('MessagingService', 'UpdateNotificationPreferences')
  updateNotificationPreferences(data: any) { return this.service.updateNotificationPreferences(data); }

  @GrpcMethod('MessagingService', 'GetUnreadCount')
  getUnreadCount(data: any) { return this.service.getUnreadCount(data); }

  /* ── NATS: auto-create thread when case created ────────── */
  @EventPattern(NatsSubjects.CASE_CREATED)
  onCaseCreated(data: CaseCreatedEvent) {
    return this.service.onCaseCreated(data);
  }
}
