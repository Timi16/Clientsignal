import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { ScoringService } from '../scoring/scoring.service';
import { MatchingService } from '../matching/matching.service';
import { Services, GrpcPackages } from '@cs/common';

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
      {
        name: Services.ATTORNEY,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GrpcPackages.ATTORNEY,
            protoPath: join(__dirname, '../../../../libs/proto/src/attorney.proto'),
            url: config.get<string>('ATTORNEY_GRPC_URL', 'localhost:5002'),
          },
        }),
      },
    ]),
  ],
  controllers: [LeadController],
  providers: [LeadService, ScoringService, MatchingService],
  exports: [LeadService],
})
export class LeadModule {}
