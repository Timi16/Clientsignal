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
import { CurrentUser, Roles } from '../common/decorators';
import { AttorneyStatusGuard } from '../common/guards/attorney-status.guard';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { CorrelationInterceptor } from '../common/interceptors/correlation.interceptor';

interface CaseServiceGrpc {
  getCase(data: any): Observable<any>;
  listCases(data: any): Observable<any>;
  updateCaseStage(data: any): Observable<any>;
  updateCaseStatus(data: any): Observable<any>;
  getDocumentUploadUrl(data: any): Observable<any>;
  getDocumentDownloadUrl(data: any): Observable<any>;
  confirmDocumentUpload(data: any): Observable<any>;
  listDocuments(data: any): Observable<any>;
  requestDocument(data: any): Observable<any>;
  createNote(data: any): Observable<any>;
  listNotes(data: any): Observable<any>;
  getCaseStrength(data: any): Observable<any>;
}

interface AttorneyServiceGrpc {
  getAttorneyByUserId(data: any): Observable<any>;
}

@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard, AttorneyStatusGuard)
@UseFilters(RpcExceptionFilter)
@UseInterceptors(CorrelationInterceptor)
export class CaseProxyController implements OnModuleInit {
  private caseService!: CaseServiceGrpc;
  private attorneyService!: AttorneyServiceGrpc;

  constructor(
    @Inject(Services.CASE) private readonly caseClient: ClientGrpc,
    @Inject(Services.ATTORNEY) private readonly attorneyClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.caseService =
      this.caseClient.getService<CaseServiceGrpc>('CaseService');
    this.attorneyService =
      this.attorneyClient.getService<AttorneyServiceGrpc>('AttorneyService');
  }

  @Get()
  async listCases(
    @CurrentUser() user: AuthUser,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('practiceArea') practiceArea?: string,
  ) {
    let clientUserId = '';
    let attorneyId = '';

    if (user.role === 'client') {
      clientUserId = user.id;
    } else if (user.role === 'attorney') {
      const attorney = await lastValueFrom(
        this.attorneyService.getAttorneyByUserId({ userId: user.id }),
      );
      attorneyId = attorney.attorney.id;
    }
    // admin: pass neither => gets all cases

    return lastValueFrom(
      this.caseService.listCases({
        clientUserId,
        attorneyId,
        status: status || '',
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
        search: search || '',
        sortBy: sortBy || '',
        sortOrder: sortOrder || '',
        practiceArea: practiceArea || '',
      }),
    );
  }

  @Get(':id')
  async getCase(@Param('id') id: string) {
    return lastValueFrom(
      this.caseService.getCase({ id }),
    );
  }

  @Put(':id/stage')
  @Roles('attorney', 'admin')
  async updateCaseStage(
    @Param('id') id: string,
    @Body() body: { stage: number },
  ) {
    return lastValueFrom(
      this.caseService.updateCaseStage({
        caseId: id,
        stage: body.stage,
      }),
    );
  }

  @Put(':id/status')
  @Roles('attorney', 'admin')
  async updateCaseStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return lastValueFrom(
      this.caseService.updateCaseStatus({
        caseId: id,
        status: body.status,
      }),
    );
  }

  @Post(':id/documents/upload-url')
  async getDocumentUploadUrl(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: { fileName: string; mimeType: string; required?: boolean },
  ) {
    return lastValueFrom(
      this.caseService.getDocumentUploadUrl({
        caseId: id,
        fileName: body.fileName,
        mimeType: body.mimeType,
        required: body.required || false,
        uploadedByUserId: user.id,
      }),
    );
  }

  @Get(':id/documents/:docId/download-url')
  async getDocumentDownloadUrl(@Param('docId') docId: string) {
    return lastValueFrom(
      this.caseService.getDocumentDownloadUrl({ documentId: docId }),
    );
  }

  @Post(':id/documents/:docId/confirm')
  async confirmDocumentUpload(@Param('docId') docId: string) {
    return lastValueFrom(
      this.caseService.confirmDocumentUpload({ documentId: docId }),
    );
  }

  @Get(':id/documents')
  async listDocuments(@Param('id') id: string) {
    return lastValueFrom(
      this.caseService.listDocuments({ caseId: id }),
    );
  }

  @Post(':id/documents/request')
  @Roles('attorney')
  async requestDocument(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: { documentName: string; required?: boolean },
  ) {
    // Resolve attorney name for the request
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.caseService.requestDocument({
        caseId: id,
        documentName: body.documentName,
        required: body.required ?? true,
        attorneyName: attorney.attorney.name || '',
      }),
    );
  }

  @Post(':id/notes')
  @Roles('attorney')
  async createNote(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: { body: string; tag?: string },
  ) {
    const attorney = await lastValueFrom(
      this.attorneyService.getAttorneyByUserId({ userId: user.id }),
    );
    return lastValueFrom(
      this.caseService.createNote({
        caseId: id,
        attorneyId: attorney.attorney.id,
        body: body.body,
        tag: body.tag || '',
      }),
    );
  }

  @Get(':id/notes')
  async listNotes(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    let attorneyId = '';
    if (user.role === 'attorney') {
      const attorney = await lastValueFrom(
        this.attorneyService.getAttorneyByUserId({ userId: user.id }),
      );
      attorneyId = attorney.attorney.id;
    }
    return lastValueFrom(
      this.caseService.listNotes({
        caseId: id,
        attorneyId,
      }),
    );
  }

  @Get(':id/strength')
  async getCaseStrength(@Param('id') id: string) {
    return lastValueFrom(
      this.caseService.getCaseStrength({ caseId: id }),
    );
  }
}
