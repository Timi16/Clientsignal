import { Controller } from '@nestjs/common';
import { GrpcMethod, EventPattern } from '@nestjs/microservices';
import { AttorneyService } from './attorney.service';
import { NatsSubjects } from '@cs/common';
import type { LeadClaimedEvent } from '@cs/common';

@Controller()
export class AttorneyController {
  constructor(private readonly service: AttorneyService) {}

  @GrpcMethod('AttorneyService', 'CreateProfile')
  createProfile(data: any) { return this.service.createProfile(data); }

  @GrpcMethod('AttorneyService', 'UpdateProfile')
  updateProfile(data: any) { return this.service.updateProfile(data); }

  @GrpcMethod('AttorneyService', 'GetAttorney')
  getAttorney(data: any) { return this.service.getAttorney(data); }

  @GrpcMethod('AttorneyService', 'GetAttorneyByUserId')
  getAttorneyByUserId(data: any) { return this.service.getAttorneyByUserId(data); }

  @GrpcMethod('AttorneyService', 'ListAttorneys')
  listAttorneys(data: any) { return this.service.listAttorneys(data); }

  @GrpcMethod('AttorneyService', 'FindMatchingAttorneys')
  findMatchingAttorneys(data: any) { return this.service.findMatchingAttorneys(data); }

  @GrpcMethod('AttorneyService', 'GetVerificationQueue')
  getVerificationQueue(data: any) { return this.service.getVerificationQueue(data); }

  @GrpcMethod('AttorneyService', 'DecideVerification')
  decideVerification(data: any) { return this.service.decideVerification(data); }

  @GrpcMethod('AttorneyService', 'UpdatePreferences')
  updatePreferences(data: any) { return this.service.updatePreferences(data); }

  @GrpcMethod('AttorneyService', 'GetPreferences')
  getPreferences(data: any) { return this.service.getPreferences(data); }

  @GrpcMethod('AttorneyService', 'GetIntegrations')
  getIntegrations(data: any) { return this.service.getIntegrations(data); }

  @GrpcMethod('AttorneyService', 'ToggleIntegration')
  toggleIntegration(data: any) { return this.service.toggleIntegration(data); }

  @GrpcMethod('AttorneyService', 'GetAnalytics')
  getAnalytics(data: any) { return this.service.getAnalytics(data); }

  /* ── NATS event listeners ──────────────────────────────── */

  @EventPattern(NatsSubjects.LEAD_CLAIMED)
  async onLeadClaimed(data: LeadClaimedEvent) {
    await this.service.incrementTotalLeads(data.attorneyId);
  }
}
