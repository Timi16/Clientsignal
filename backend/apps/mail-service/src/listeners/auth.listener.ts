import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NatsSubjects } from '@cs/common';
import type { UserRegisteredEvent, PasswordResetRequestedEvent } from '@cs/common';
import { MailService } from '../mail/mail.service';

@Controller()
export class AuthListener {
  private readonly logger = new Logger(AuthListener.name);
  private readonly frontendUrl: string;

  constructor(
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {
    this.frontendUrl = this.config.get<string>('FRONTEND_URL', 'https://clientssignal.com');
  }

  @EventPattern(NatsSubjects.USER_REGISTERED)
  async onUserRegistered(@Payload() event: UserRegisteredEvent): Promise<void> {
    this.logger.log(`User registered: ${event.email} (${event.role})`);

    const templateSlug =
      event.role === 'attorney' ? 'welcome-attorney' : 'welcome-client';

    const verifyUrl = event.verifyToken
      ? `${this.frontendUrl}/verify-email?token=${event.verifyToken}`
      : '';

    await this.mailService.sendEmail({
      to: event.email,
      templateSlug,
      variables: {
        name: event.name,
        email: event.email,
        role: event.role,
        verifyUrl,
      },
    });
  }

  @EventPattern(NatsSubjects.PASSWORD_RESET_REQUESTED)
  async onPasswordResetRequested(
    @Payload() event: PasswordResetRequestedEvent,
  ): Promise<void> {
    this.logger.log(`Password reset requested: ${event.email}`);

    const resetUrl = `${this.frontendUrl}/reset-password?token=${event.resetToken}`;

    await this.mailService.sendEmail({
      to: event.email,
      templateSlug: 'password-reset',
      variables: {
        name: event.name,
        resetUrl,
        resetToken: event.resetToken,
        expiresAt: event.expiresAt,
      },
    });
  }
}
