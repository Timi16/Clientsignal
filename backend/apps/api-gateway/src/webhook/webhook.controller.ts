import { Body, Controller, Headers, HttpCode, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { createHmac } from 'node:crypto';
import { Services } from '@cs/common';

@Controller('webhooks')
@SkipThrottle()
export class WebhookController {
  private readonly webhookSecret: string;

  constructor(
    @Inject(Services.NATS) private readonly natsClient: ClientProxy,
    private readonly config: ConfigService,
  ) {
    this.webhookSecret = this.config.get<string>('RESEND_WEBHOOK_SECRET', '');
  }

  @Post('resend')
  @HttpCode(200)
  async handleResendWebhook(
    @Body() body: any,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    // Verify webhook signature if secret is configured
    if (this.webhookSecret && svixSignature) {
      const payload = `${svixId}.${svixTimestamp}.${JSON.stringify(body)}`;
      const expected = createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('base64');

      const signatures = svixSignature.split(' ').map((s) => s.replace('v1,', ''));
      const valid = signatures.some((sig) => sig === expected);

      if (!valid) {
        return { error: 'Invalid signature' };
      }
    }

    // Forward to mail-service via NATS
    this.natsClient.emit('mail.resend_webhook', body);

    return { ok: true };
  }
}
