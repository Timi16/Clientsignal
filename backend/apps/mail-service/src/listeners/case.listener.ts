import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NatsSubjects } from '@cs/common';
import type { CaseStageUpdatedEvent, DocumentRequestedEvent } from '@cs/common';
import { MailService } from '../mail/mail.service';

@Controller()
export class CaseListener {
  private readonly logger = new Logger(CaseListener.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern(NatsSubjects.CASE_STAGE_UPDATED)
  async onCaseStageUpdated(@Payload() event: CaseStageUpdatedEvent): Promise<void> {
    this.logger.log(`Case stage updated: ${event.caseId} (stage ${event.previousStage} -> ${event.newStage})`);

    await this.mailService.sendEmail({
      to: event.clientEmail,
      templateSlug: 'case-update',
      variables: {
        clientName: event.clientName,
        caseId: event.caseId,
        previousStage: String(event.previousStage),
        newStage: String(event.newStage),
        status: event.status,
      },
    });
  }

  @EventPattern(NatsSubjects.DOCUMENT_REQUESTED)
  async onDocumentRequested(@Payload() event: DocumentRequestedEvent): Promise<void> {
    this.logger.log(`Document requested: ${event.documentName} for case ${event.caseId}`);

    await this.mailService.sendEmail({
      to: event.clientEmail,
      templateSlug: 'document-request',
      variables: {
        clientName: event.clientName,
        attorneyName: event.attorneyName,
        documentName: event.documentName,
        caseId: event.caseId,
      },
    });
  }
}
