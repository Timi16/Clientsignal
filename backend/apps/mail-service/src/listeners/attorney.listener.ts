import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NatsSubjects } from '@cs/common';
import type { AttorneyVerifiedEvent, AttorneyRejectedEvent } from '@cs/common';
import { MailService } from '../mail/mail.service';

@Controller()
export class AttorneyListener {
  private readonly logger = new Logger(AttorneyListener.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern(NatsSubjects.ATTORNEY_VERIFIED)
  async onAttorneyVerified(@Payload() event: AttorneyVerifiedEvent): Promise<void> {
    this.logger.log(`Attorney verified: ${event.email}`);

    await this.mailService.sendEmail({
      to: event.email,
      templateSlug: 'attorney-approved',
      variables: {
        name: event.name,
        attorneyId: event.attorneyId,
      },
    });
  }

  @EventPattern(NatsSubjects.ATTORNEY_REJECTED)
  async onAttorneyRejected(@Payload() event: AttorneyRejectedEvent): Promise<void> {
    this.logger.log(`Attorney rejected: ${event.email}`);

    await this.mailService.sendEmail({
      to: event.email,
      templateSlug: 'attorney-rejected',
      variables: {
        name: event.name,
        reason: event.reason ?? 'Your application did not meet our requirements.',
      },
    });
  }
}
