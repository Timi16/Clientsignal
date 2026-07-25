import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttorneyModule } from './attorney/attorney.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    AttorneyModule,
    HealthModule,
  ],
})
export class AppModule {}
