import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';
import { CaseService } from './case.service';
import { NatsSubjects } from '@cs/common';
import type { LeadMatchedEvent } from '@cs/common';

@Controller()
export class CaseController {
  constructor(private readonly service: CaseService) {}

  @GrpcMethod('CaseService', 'GetCase')
  getCase(data: any) { return this.service.getCase(data); }

  @GrpcMethod('CaseService', 'ListCases')
  listCases(data: any) { return this.service.listCases(data); }

  @GrpcMethod('CaseService', 'UpdateCaseStage')
  updateCaseStage(data: any) { return this.service.updateCaseStage(data); }

  @GrpcMethod('CaseService', 'UpdateCaseStatus')
  updateCaseStatus(data: any) { return this.service.updateCaseStatus(data); }

  @GrpcMethod('CaseService', 'GetDocumentUploadUrl')
  getDocumentUploadUrl(data: any) { return this.service.getDocumentUploadUrl(data); }

  @GrpcMethod('CaseService', 'ConfirmDocumentUpload')
  confirmDocumentUpload(data: any) { return this.service.confirmDocumentUpload(data); }

  @GrpcMethod('CaseService', 'ListDocuments')
  listDocuments(data: any) { return this.service.listDocuments(data); }

  @GrpcMethod('CaseService', 'RequestDocument')
  requestDocument(data: any) { return this.service.requestDocument(data); }

  @GrpcMethod('CaseService', 'CreateNote')
  createNote(data: any) { return this.service.createNote(data); }

  @GrpcMethod('CaseService', 'ListNotes')
  listNotes(data: any) { return this.service.listNotes(data); }

  @GrpcMethod('CaseService', 'GetCaseStrength')
  getCaseStrength(data: any) { return this.service.getCaseStrength(data); }

  @GrpcMethod('CaseService', 'GetDocumentDownloadUrl')
  getDocumentDownloadUrl(data: any) { return this.service.getDocumentDownloadUrl(data); }

  /* ── NATS: auto-create case when lead is matched ───────── */
  @EventPattern(NatsSubjects.LEAD_MATCHED)
  onLeadMatched(data: LeadMatchedEvent) {
    return this.service.onLeadMatched(data);
  }
}
