import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NatsSubjects } from '@cs/common';
import type {
  InvoiceGeneratedEvent,
  PaymentFailedEvent,
  SubscriptionCancelledEvent,
} from '@cs/common';
import { MailService } from '../mail/mail.service';

@Controller()
export class BillingListener {
  private readonly logger = new Logger(BillingListener.name);
  private readonly billingFrom: string;

  constructor(
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {
    this.billingFrom = this.config.get<string>(
      'MAIL_FROM_BILLING',
      'ClientSignal Billing <billing@clientsignal.com>',
    );
  }

  @EventPattern(NatsSubjects.INVOICE_GENERATED)
  async onInvoiceGenerated(@Payload() event: InvoiceGeneratedEvent): Promise<void> {
    this.logger.log(`Invoice generated: ${event.invoiceId} for ${event.attorneyEmail}`);

    const amountFormatted = (event.amountCents / 100).toFixed(2);

    await this.mailService.sendEmail({
      to: event.attorneyEmail,
      from: this.billingFrom,
      templateSlug: 'invoice-ready',
      variables: {
        attorneyName: event.attorneyName,
        invoiceId: event.invoiceId,
        amount: amountFormatted,
        pdfUrl: event.pdfUrl ?? '',
      },
    });
  }

  @EventPattern(NatsSubjects.PAYMENT_FAILED)
  async onPaymentFailed(@Payload() event: PaymentFailedEvent): Promise<void> {
    this.logger.log(`Payment failed: ${event.billingAccountId} for ${event.attorneyEmail}`);

    const amountFormatted = (event.amountCents / 100).toFixed(2);

    await this.mailService.sendEmail({
      to: event.attorneyEmail,
      from: this.billingFrom,
      templateSlug: 'payment-failed',
      variables: {
        attorneyName: event.attorneyName,
        amount: amountFormatted,
        reason: event.reason,
      },
    });
  }

  @EventPattern(NatsSubjects.SUBSCRIPTION_CANCELLED)
  async onSubscriptionCancelled(
    @Payload() event: SubscriptionCancelledEvent,
  ): Promise<void> {
    this.logger.log(`Subscription cancelled: ${event.subscriptionId} for ${event.attorneyEmail}`);

    await this.mailService.sendEmail({
      to: event.attorneyEmail,
      from: this.billingFrom,
      templateSlug: 'subscription-cancelled',
      variables: {
        attorneyName: event.attorneyName,
        planName: event.planName,
        subscriptionId: event.subscriptionId,
      },
    });
  }
}
