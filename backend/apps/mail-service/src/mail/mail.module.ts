import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { TemplateService } from '../templates/template.service';
import { AuthListener } from '../listeners/auth.listener';
import { AttorneyListener } from '../listeners/attorney.listener';
import { LeadListener } from '../listeners/lead.listener';
import { CaseListener } from '../listeners/case.listener';
import { BillingListener } from '../listeners/billing.listener';
import { WebhookListener } from '../listeners/webhook.listener';

@Module({
  imports: [ConfigModule],
  controllers: [
    AuthListener,
    AttorneyListener,
    LeadListener,
    CaseListener,
    BillingListener,
    WebhookListener,
  ],
  providers: [MailService, TemplateService],
  exports: [MailService, TemplateService],
})
export class MailModule {}
