import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
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
import { CurrentUser, Roles } from '../common/decorators';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { CorrelationInterceptor } from '../common/interceptors/correlation.interceptor';

interface AttorneyServiceGrpc {
  getVerificationQueue(data: any): Observable<any>;
  decideVerification(data: any): Observable<any>;
  listAttorneys(data: any): Observable<any>;
}

interface LeadServiceGrpc {
  adminListLeads(data: any): Observable<any>;
  adminUpdateLeadQa(data: any): Observable<any>;
}

interface AuthServiceGrpc {
  listAuditLogs(data: any): Observable<any>;
  getUsersByIds(data: any): Observable<any>;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseFilters(RpcExceptionFilter)
@UseInterceptors(CorrelationInterceptor)
export class AdminProxyController implements OnModuleInit {
  private attorneyService!: AttorneyServiceGrpc;
  private leadService!: LeadServiceGrpc;
  private authService!: AuthServiceGrpc;

  constructor(
    @Inject(Services.ATTORNEY) private readonly attorneyClient: ClientGrpc,
    @Inject(Services.LEAD) private readonly leadClient: ClientGrpc,
    @Inject(Services.AUTH) private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.attorneyService =
      this.attorneyClient.getService<AttorneyServiceGrpc>('AttorneyService');
    this.leadService =
      this.leadClient.getService<LeadServiceGrpc>('LeadService');
    this.authService =
      this.authClient.getService<AuthServiceGrpc>('AuthService');
  }

  @Get('verifications')
  async getVerificationQueue(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return lastValueFrom(
      this.attorneyService.getVerificationQueue({
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      }),
    );
  }

  @Post('verifications/:id/decide')
  async decideVerification(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: any,
  ) {
    return lastValueFrom(
      this.attorneyService.decideVerification({
        verificationId: id,
        attorneyId: body.attorneyId,
        adminUserId: user.id,
        decision: body.decision,
        trustRating: body.trustRating,
        checklistJson: body.checklistJson ? JSON.stringify(body.checklistJson) : '',
        reason: body.reason || '',
      }),
    );
  }

  @Get('attorneys')
  async listAttorneys(
    @Query('status') status?: string,
    @Query('specialty') specialty?: string,
    @Query('state') state?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return lastValueFrom(
      this.attorneyService.listAttorneys({
        status: status || '',
        specialty: specialty || '',
        state: state || '',
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      }),
    );
  }

  @Get('leads/qa')
  async adminListLeads(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return lastValueFrom(
      this.leadService.adminListLeads({
        status: status || '',
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      }),
    );
  }

  @Post('leads/:id/qa')
  async adminUpdateLeadQA(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return lastValueFrom(
      this.leadService.adminUpdateLeadQa({
        leadId: id,
        qualityScore: body.qualityScore || 0,
        urgencyScore: body.urgencyScore || 0,
        status: body.status || '',
      }),
    );
  }

  @Get('audit-log')
  async listAuditLogs(
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return lastValueFrom(
      this.authService.listAuditLogs({
        userId: userId || '',
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      }),
    );
  }

  @Get('users')
  async getUsers(@Query('ids') ids?: string) {
    const idList = ids ? ids.split(',').filter(Boolean) : [];
    return lastValueFrom(
      this.authService.getUsersByIds({ ids: idList }),
    );
  }
}
