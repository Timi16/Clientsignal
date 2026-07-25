import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'node:path';
import { Services, GrpcPackages } from '@cs/common';
import { HealthController } from './health/health.controller';
import { AuthProxyController } from './proxy/auth-proxy.controller';
import { AttorneyProxyController } from './proxy/attorney-proxy.controller';
import { AdminProxyController } from './proxy/admin-proxy.controller';
import { LeadProxyController } from './proxy/lead-proxy.controller';
import { CaseProxyController } from './proxy/case-proxy.controller';
import { MessageProxyController } from './proxy/message-proxy.controller';
import { WebhookController } from './webhook/webhook.controller';
import { WsGateway } from './websocket/ws.gateway';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CorrelationInterceptor } from './common/interceptors/correlation.interceptor';
import { AttorneyStatusGuard } from './common/guards/attorney-status.guard';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';

const protoDir = join(__dirname, '../../../libs/proto/src');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting: 60 requests per minute per IP (default), 10/min for auth
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 60 },
      { name: 'auth', ttl: 60000, limit: 10 },
    ]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),

    // NATS client (for webhook forwarding)
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

    // gRPC client: Auth
    ClientsModule.registerAsync([
      {
        name: Services.AUTH,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GrpcPackages.AUTH,
            protoPath: join(protoDir, 'auth.proto'),
            url: config.get<string>('AUTH_GRPC_URL', 'localhost:5001'),
          },
        }),
      },
      // gRPC client: Attorney
      {
        name: Services.ATTORNEY,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GrpcPackages.ATTORNEY,
            protoPath: join(protoDir, 'attorney.proto'),
            url: config.get<string>('ATTORNEY_GRPC_URL', 'localhost:5002'),
          },
        }),
      },
      // gRPC client: Lead
      {
        name: Services.LEAD,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GrpcPackages.LEAD,
            protoPath: join(protoDir, 'lead.proto'),
            url: config.get<string>('LEAD_GRPC_URL', 'localhost:5003'),
          },
        }),
      },
      // gRPC client: Case
      {
        name: Services.CASE,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GrpcPackages.CASE,
            protoPath: join(protoDir, 'case.proto'),
            url: config.get<string>('CASE_GRPC_URL', 'localhost:5004'),
          },
        }),
      },
      // gRPC client: Messaging
      {
        name: Services.MESSAGING,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GrpcPackages.MESSAGING,
            protoPath: join(protoDir, 'messaging.proto'),
            url: config.get<string>('MESSAGING_GRPC_URL', 'localhost:5005'),
          },
        }),
      },
    ]),
  ],
  controllers: [
    HealthController,
    AuthProxyController,
    AttorneyProxyController,
    AdminProxyController,
    LeadProxyController,
    CaseProxyController,
    MessageProxyController,
    WebhookController,
    WsGateway,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    JwtAuthGuard,
    RolesGuard,
    CorrelationInterceptor,
    AttorneyStatusGuard,
    RpcExceptionFilter,
  ],
})
export class AppModule {}
