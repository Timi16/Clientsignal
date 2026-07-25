import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { emailLogs, emailTemplates, EmailLog } from '../database/schema';
import { TemplateService } from '../templates/template.service';

export interface SendEmailOptions {
  to: string;
  from?: string;
  templateSlug: string;
  variables: Record<string, string>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly defaultFrom: string;

  constructor(
    private readonly config: ConfigService,
    private readonly database: DatabaseService,
    private readonly templateService: TemplateService,
  ) {
    this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
    this.defaultFrom = this.config.get<string>(
      'MAIL_FROM',
      'ClientSignal <noreply@clientsignal.com>',
    );
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailLog> {
    const { to, templateSlug, variables } = options;
    const from = options.from ?? this.defaultFrom;

    // Look up template
    const template = await this.database.db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.slug, templateSlug))
      .limit(1)
      .then((rows) => rows[0]);

    if (!template) {
      this.logger.error(`Template not found: ${templateSlug}`);
      // Log the failure
      const [log] = await this.database.db
        .insert(emailLogs)
        .values({
          toEmail: to,
          fromEmail: from,
          templateSlug,
          subject: `[missing template: ${templateSlug}]`,
          status: 'failed',
          error: `Template "${templateSlug}" not found`,
        })
        .returning();
      return log;
    }

    if (!template.active) {
      this.logger.warn(`Template is inactive: ${templateSlug}`);
      const [log] = await this.database.db
        .insert(emailLogs)
        .values({
          toEmail: to,
          fromEmail: from,
          templateSlug,
          subject: template.subject,
          status: 'failed',
          error: `Template "${templateSlug}" is inactive`,
        })
        .returning();
      return log;
    }

    // Render template
    const rendered = this.templateService.render(
      template.htmlBody,
      template.textBody,
      template.subject,
      variables,
    );

    // Create log entry (queued)
    const [log] = await this.database.db
      .insert(emailLogs)
      .values({
        toEmail: to,
        fromEmail: from,
        templateSlug,
        subject: rendered.subject,
        status: 'queued',
      })
      .returning();

    try {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });

      if (error) {
        this.logger.error(`Resend error for ${templateSlug} to ${to}: ${error.message}`);
        const [updated] = await this.database.db
          .update(emailLogs)
          .set({ status: 'failed', error: error.message })
          .where(eq(emailLogs.id, log.id))
          .returning();
        return updated;
      }

      const [updated] = await this.database.db
        .update(emailLogs)
        .set({
          status: 'sent',
          resendId: data?.id ?? null,
          sentAt: new Date(),
        })
        .where(eq(emailLogs.id, log.id))
        .returning();

      this.logger.log(`Email sent: ${templateSlug} -> ${to} (resend_id: ${data?.id})`);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send ${templateSlug} to ${to}: ${message}`);
      const [updated] = await this.database.db
        .update(emailLogs)
        .set({ status: 'failed', error: message })
        .where(eq(emailLogs.id, log.id))
        .returning();
      return updated;
    }
  }

  async handleResendWebhook(event: {
    type: string;
    data: { email_id?: string; to?: string[] };
    created_at?: string;
  }) {
    const resendId = event.data?.email_id;
    if (!resendId) return;

    const [log] = await this.database.db.select().from(emailLogs)
      .where(eq(emailLogs.resendId, resendId)).limit(1);
    if (!log) return;

    const updates: Record<string, any> = {};

    switch (event.type) {
      case 'email.delivered':
        updates.status = 'delivered';
        break;
      case 'email.bounced':
        updates.status = 'bounced';
        break;
      case 'email.complained':
        updates.status = 'complained';
        break;
      case 'email.opened':
        updates.openedAt = new Date();
        break;
      case 'email.clicked':
        updates.clickedAt = new Date();
        break;
      default:
        return;
    }

    await this.database.db.update(emailLogs)
      .set(updates)
      .where(eq(emailLogs.id, log.id));

    this.logger.log(`Webhook: ${event.type} for resend_id=${resendId}`);
  }
}
