import { Controller, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { NatsSubjects } from '@cs/common';
import type {
  AccessTokenPayload,
  LeadMatchedEvent,
  LeadClaimedEvent,
  MessageSentEvent,
  CaseCreatedEvent,
  CaseStageUpdatedEvent,
  DocumentRequestedEvent,
  DocumentUploadedEvent,
} from '@cs/common';

@Controller()
@WebSocketGateway({
  namespace: '/socket',
  cors: {
    origin: (origin: string, cb: (err: Error | null, allow?: boolean) => void) => {
      cb(null, true);
    },
    credentials: true,
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WsGateway.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /* ── WebSocket connection lifecycle ────────────────────── */

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn('WebSocket connection rejected: no token');
        client.disconnect();
        return;
      }

      const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });

      // Store user info on the socket
      (client as any).userId = payload.sub;
      (client as any).userRole = payload.role;

      // Join user-specific room
      client.join(`user:${payload.sub}`);

      this.logger.log(`Client connected: ${payload.sub} (${payload.role})`);
    } catch {
      this.logger.warn('WebSocket connection rejected: invalid token');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId;
    if (userId) {
      this.logger.log(`Client disconnected: ${userId}`);
    }
  }

  /* ── Room subscription (clients join/leave rooms) ───────── */

  @SubscribeMessage('join:case')
  handleJoinCase(client: Socket, caseId: string) {
    client.join(`case:${caseId}:messages`);
    this.logger.debug(`${(client as any).userId} joined case:${caseId}:messages`);
  }

  @SubscribeMessage('leave:case')
  handleLeaveCase(client: Socket, caseId: string) {
    client.leave(`case:${caseId}:messages`);
  }

  @SubscribeMessage('join:leads')
  handleJoinLeads(client: Socket) {
    const userId = (client as any).userId;
    if ((client as any).userRole === 'attorney') {
      client.join(`attorney:${userId}:leads`);
    }
  }

  @SubscribeMessage('leave:leads')
  handleLeaveLeads(client: Socket) {
    const userId = (client as any).userId;
    client.leave(`attorney:${userId}:leads`);
  }

  /* ── NATS event handlers -> Socket.IO relay ────────────── */

  @EventPattern(NatsSubjects.LEAD_MATCHED)
  handleLeadMatched(@Payload() event: LeadMatchedEvent) {
    // Notify assigned attorney
    this.server
      .to(`user:${event.attorneyUserId}`)
      .emit('lead:new', event);
    // Also emit to the attorney's lead feed room
    this.server
      .to(`attorney:${event.attorneyUserId}:leads`)
      .emit('lead:new', event);
  }

  @EventPattern(NatsSubjects.LEAD_CLAIMED)
  handleLeadClaimed(@Payload() event: LeadClaimedEvent) {
    // Notify the client that their lead was claimed
    this.server
      .to(`user:${event.clientUserId}`)
      .emit('lead:claimed', {
        leadId: event.leadId,
        attorneyName: event.attorneyName,
        practiceArea: event.practiceArea,
      });
  }

  @EventPattern(NatsSubjects.MESSAGE_SENT)
  handleMessageSent(@Payload() event: MessageSentEvent) {
    // Emit to the recipient's user room
    this.server
      .to(`user:${event.recipientUserId}`)
      .emit('message:new', event);
    // Also emit to case-specific message room
    if (event.caseId) {
      this.server
        .to(`case:${event.caseId}:messages`)
        .emit('message:new', event);
    }
  }

  @EventPattern(NatsSubjects.CASE_CREATED)
  handleCaseCreated(@Payload() event: CaseCreatedEvent) {
    // Notify both client and attorney
    this.server
      .to(`user:${event.clientUserId}`)
      .emit('case:created', event);
    if (event.attorneyUserId) {
      this.server
        .to(`user:${event.attorneyUserId}`)
        .emit('case:created', event);
    }
  }

  @EventPattern(NatsSubjects.CASE_STAGE_UPDATED)
  handleCaseStageUpdated(@Payload() event: CaseStageUpdatedEvent) {
    this.server
      .to(`user:${event.clientUserId}`)
      .emit('case:stage_updated', event);
  }

  @EventPattern(NatsSubjects.DOCUMENT_REQUESTED)
  handleDocumentRequested(@Payload() event: DocumentRequestedEvent) {
    this.server
      .to(`user:${event.clientUserId}`)
      .emit('case:document_requested', event);
  }

  @EventPattern(NatsSubjects.DOCUMENT_UPLOADED)
  handleDocumentUploaded(@Payload() event: DocumentUploadedEvent) {
    // Notify anyone in the case room
    this.server
      .to(`case:${event.caseId}:messages`)
      .emit('case:document_uploaded', event);
  }
}
