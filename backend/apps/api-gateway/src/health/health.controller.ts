import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      ok: true,
      service: 'api-gateway',
      time: new Date().toISOString(),
      version: '0.1.0',
    };
  }
}
