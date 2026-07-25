import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const protoDir = join(__dirname, '../../../libs/proto/src');
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['attorney', 'health'],
      protoPath: [join(protoDir, 'attorney.proto'), join(protoDir, 'health.proto')],
      url: `0.0.0.0:${process.env.GRPC_PORT || 5002}`,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL || 'nats://localhost:4222'],
    },
  });

  await app.startAllMicroservices();
  await app.init();
  console.log(`Attorney service running on gRPC port ${process.env.GRPC_PORT || 5002}`);
}

void bootstrap();
