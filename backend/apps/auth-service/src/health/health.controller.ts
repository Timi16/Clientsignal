import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';

@Controller()
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @GrpcMethod('HealthService', 'Check')
  async check() {
    let dbOk = false;
    try {
      await this.database.pool.query('SELECT 1');
      dbOk = true;
    } catch {}

    return {
      ok: dbOk,
      service: 'auth-service',
      time: new Date().toISOString(),
      version: '0.1.0',
    };
  }
}
