import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AttorneyController } from './attorney.controller';
import { AttorneyService } from './attorney.service';
import { VerificationAiService } from './verification-ai.service';
import { BarLookupService } from './bar-lookup.service';
import { Services } from '@cs/common';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: Services.NATS,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')],
          },
        }),
      },
    ]),
  ],
  controllers: [AttorneyController],
  providers: [AttorneyService, VerificationAiService, BarLookupService],
  exports: [AttorneyService],
})
export class AttorneyModule {}
