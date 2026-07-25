import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LeadService } from './lead.service';

@Controller()
export class LeadController {
  constructor(private readonly service: LeadService) {}

  @GrpcMethod('LeadService', 'SubmitIntake')
  submitIntake(data: any) { return this.service.submitIntake(data); }

  @GrpcMethod('LeadService', 'GetLead')
  getLead(data: any) { return this.service.getLead(data); }

  @GrpcMethod('LeadService', 'ListLeads')
  listLeads(data: any) { return this.service.listLeads(data); }

  @GrpcMethod('LeadService', 'ViewLead')
  viewLead(data: any) { return this.service.viewLead(data); }

  @GrpcMethod('LeadService', 'ClaimLead')
  claimLead(data: any) { return this.service.claimLead(data); }

  @GrpcMethod('LeadService', 'GetDocumentUploadUrl')
  getDocumentUploadUrl(data: any) { return this.service.getDocumentUploadUrl(data); }

  @GrpcMethod('LeadService', 'GetDocumentDownloadUrl')
  getDocumentDownloadUrl(data: any) { return this.service.getDocumentDownloadUrl(data); }

  @GrpcMethod('LeadService', 'AdminListLeads')
  adminListLeads(data: any) { return this.service.adminListLeads(data); }

  @GrpcMethod('LeadService', 'AdminUpdateLeadQA')
  adminUpdateLeadQA(data: any) { return this.service.adminUpdateLeadQA(data); }
}
