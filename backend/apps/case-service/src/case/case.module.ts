import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';
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
      {
        name: Services.AUTH,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: join(process.cwd(), 'libs/proto/src/auth.proto'),
            url: config.get<string>('AUTH_GRPC_URL', 'localhost:5001'),
          },
        }),
      },
    ]),
  ],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [CaseService],
})
export class CaseModule {}
