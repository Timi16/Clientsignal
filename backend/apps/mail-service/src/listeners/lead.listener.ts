import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NatsSubjects } from '@cs/common';
import type { LeadMatchedEvent, LeadClaimedEvent } from '@cs/common';
import { MailService } from '../mail/mail.service';

@Controller()
export class LeadListener {
  private readonly logger = new Logger(LeadListener.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern(NatsSubjects.LEAD_MATCHED)
  async onLeadMatched(@Payload() event: LeadMatchedEvent): Promise<void> {
    this.logger.log(`Lead matched: ${event.leadId} -> attorney ${event.attorneyEmail}`);

    await this.mailService.sendEmail({
      to: event.attorneyEmail,
      templateSlug: 'lead-new-attorney',
      variables: {
        attorneyName: event.attorneyName,
        practiceArea: event.practiceArea,
        city: event.city,
        qualityScore: String(event.qualityScore),
        summary: event.summary,
        leadId: event.leadId,
      },
    });
  }

  @EventPattern(NatsSubjects.LEAD_CLAIMED)
  async onLeadClaimed(@Payload() event: LeadClaimedEvent): Promise<void> {
    this.logger.log(`Lead claimed: ${event.leadId} -> client ${event.clientEmail}`);

    await this.mailService.sendEmail({
      to: event.clientEmail,
      templateSlug: 'lead-claimed-client',
      variables: {
        clientName: event.clientName,
        attorneyName: event.attorneyName,
        practiceArea: event.practiceArea,
        leadId: event.leadId,
      },
    });
  }
}
