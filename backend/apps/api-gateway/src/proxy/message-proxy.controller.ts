import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { Services } from '@cs/common';
import type { AuthUser } from '@cs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators';
import { AttorneyStatusGuard } from '../common/guards/attorney-status.guard';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { CorrelationInterceptor } from '../common/interceptors/correlation.interceptor';

interface MessagingServiceGrpc {
  listThreads(data: any): Observable<any>;
  getThread(data: any): Observable<any>;
  sendMessage(data: any): Observable<any>;
  markRead(data: any): Observable<any>;
  getNotificationPreferences(data: any): Observable<any>;
  updateNotificationPreferences(data: any): Observable<any>;
  getUnreadCount(data: any): Observable<any>;
}

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard, AttorneyStatusGuard)
@UseFilters(RpcExceptionFilter)
@UseInterceptors(CorrelationInterceptor)
export class MessageProxyController implements OnModuleInit {
  private messagingService!: MessagingServiceGrpc;

  constructor(
    @Inject(Services.MESSAGING) private readonly messagingClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.messagingService =
      this.messagingClient.getService<MessagingServiceGrpc>('MessagingService');
  }

  @Get('threads')
  async listThreads(
    @CurrentUser() user: AuthUser,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return lastValueFrom(
      this.messagingService.listThreads({
        userId: user.id,
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      }),
    );
  }

  @Get('threads/:id')
  async getThread(
    @Param('id') id: string,
    @Query('messageLimit') messageLimit?: string,
    @Query('messageOffset') messageOffset?: string,
  ) {
    return lastValueFrom(
      this.messagingService.getThread({
        threadId: id,
        messageLimit: messageLimit ? parseInt(messageLimit, 10) : 50,
        messageOffset: messageOffset ? parseInt(messageOffset, 10) : 0,
      }),
    );
  }

  @Post('threads/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: { body: string },
  ) {
    return lastValueFrom(
      this.messagingService.sendMessage({
        threadId: id,
        senderUserId: user.id,
        body: body.body,
      }),
    );
  }

  @Post('threads/:id/read')
  async markRead(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return lastValueFrom(
      this.messagingService.markRead({
        threadId: id,
        userId: user.id,
      }),
    );
  }

  @Get('preferences')
  async getNotificationPreferences(@CurrentUser() user: AuthUser) {
    return lastValueFrom(
      this.messagingService.getNotificationPreferences({
        userId: user.id,
      }),
    );
  }

  @Put('preferences')
  async updateNotificationPreferences(
    @CurrentUser() user: AuthUser,
    @Body() body: { smsEnabled?: boolean; emailEnabled?: boolean; pushEnabled?: boolean },
  ) {
    return lastValueFrom(
      this.messagingService.updateNotificationPreferences({
        userId: user.id,
        smsEnabled: body.smsEnabled ?? true,
        emailEnabled: body.emailEnabled ?? true,
        pushEnabled: body.pushEnabled ?? true,
      }),
    );
  }

  @Get('unread')
  async getUnreadCount(@CurrentUser() user: AuthUser) {
    return lastValueFrom(
      this.messagingService.getUnreadCount({
        userId: user.id,
      }),
    );
  }
}
