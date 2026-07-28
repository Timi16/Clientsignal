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
import { AttorneyStatusGuard } from '../common/guards/attorney-status.guard';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { CorrelationInterceptor } from '../common/interceptors/correlation.interceptor';

interface LeadServiceGrpc {
  submitIntake(data: any): Observable<any>;
  listLeads(data: any): Observable<any>;
  getLead(data: any): Observable<any>;
  viewLead(data: any): Observable<any>;
  claimLead(data: any): Observable<any>;
  getDocumentUploadUrl(data: any): Observable<any>;
  getDocumentDownloadUrl(data: any): Observable<any>;
}

interface AttorneyServiceGrpc {
  getAttorneyByUserId(data: any): Observable<any>;
}

@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard, AttorneyStatusGuard)
@UseFilters(RpcExceptionFilter)
@UseInterceptors(CorrelationInterceptor)
export class LeadProxyController implements OnModuleInit {
  private leadService!: LeadServiceGrpc;
  private attorneyService!: AttorneyServiceGrpc;

  constructor(
    @Inject(Services.LEAD) private readonly leadClient: ClientGrpc,
    @Inject(Services.ATTORNEY) private readonly attorneyClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.leadService =
      this.leadClient.getService<LeadServiceGrpc>('LeadService');
    this.attorneyService =
      this.attorneyClient.getService<AttorneyServiceGrpc>('AttorneyService');
  }

  @Post('intake')
  @Roles('client')
  async submitIntake(@CurrentUser() user: AuthUser, @Body() body: any) {
    return lastValueFrom(
      this.leadService.submitIntake({
        clientUserId: user.id,
        clientName: user.name || body.clientName || '',
        clientEmail: user.email,
        practiceArea: body.practiceArea,
        subType: body.subType || '',
        description: body.description,
        city: body.city,
        state: body.state,
        urgent: body.urgent || false,
        consent: body.consent || false,
        phone: body.phone || '',
        channel: body.channel || 'web',
      }),
    );
  }

  @Get()
  async listLeads(
    @CurrentUser() user: AuthUser,
    @Query('status') status?: string,
    @Query('practiceArea') practiceArea?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ) {
    let attorneyId = '';
    let attorneySpecialties: string[] = [];

    // If the user is an attorney, resolve their attorney ID and specialties
    if (user.role === 'attorney') {
      const attorney = await lastValueFrom(
        this.attorneyService.getAttorneyByUserId({ userId: user.id }),
      );
      attorneyId = attorney.attorney.id;
      attorneySpecialties = attorney.attorney.specialties || [];
    }

    return lastValueFrom(
      this.leadService.listLeads({
        attorneyId,
        attorneySpecialties,
        status: status || '',
        practiceArea: practiceArea || '',
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
        search: search || '',
        sortBy: sortBy || '',
        sortOrder: sortOrder || '',
        city: city || '',
        state: state || '',
      }),
    );
  }

  @Get(':id')
  async getLead(@Param('id') id: string) {
    return lastValueFrom(
      this.leadService.getLead({ id }),
    );
  }

  @Post(':id/view')
  @Roles('attorney')
  async viewLead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.leadService.viewLead({
        leadId: id,
        attorneyId: attorney.attorney.id,
      }),
    );
  }

  @Post(':id/claim')
  @Roles('attorney')
  async claimLead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.leadService.claimLead({
        leadId: id,
        attorneyId: attorney.attorney.id,
        attorneyUserId: user.id,
        attorneyName: attorney.attorney.name || '',
      }),
    );
  }

  @Get(':id/documents/:docId/download-url')
  async getDocumentDownloadUrl(@Param('docId') docId: string) {
    return lastValueFrom(
      this.leadService.getDocumentDownloadUrl({ documentId: docId }),
    );
  }

  @Post(':id/upload-url')
  async getDocumentUploadUrl(
    @Param('id') id: string,
    @Body() body: { fileName: string; mimeType: string },
  ) {
    return lastValueFrom(
      this.leadService.getDocumentUploadUrl({
        leadId: id,
        fileName: body.fileName,
        mimeType: body.mimeType,
      }),
    );
  }
}
