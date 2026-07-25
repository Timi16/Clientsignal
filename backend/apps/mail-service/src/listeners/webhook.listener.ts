import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from '../mail/mail.service';

@Controller()
export class WebhookListener {
  private readonly logger = new Logger(WebhookListener.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern('mail.resend_webhook')
  async onResendWebhook(
    @Payload()
    event: {
      type: string;
      data: { email_id?: string; to?: string[] };
      created_at?: string;
    },
  ): Promise<void> {
    this.logger.log(`Resend webhook: ${event.type}`);
    await this.mailService.handleResendWebhook(event);
  }
}
