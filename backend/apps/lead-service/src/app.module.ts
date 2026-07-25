import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LeadModule } from './lead/lead.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    LeadModule,
    HealthModule,
  ],
})
export class AppModule {}
