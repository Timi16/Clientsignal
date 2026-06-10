import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      ok: true,
      service: "clientsignal-api",
      time: new Date().toISOString(),
    };
  }
}
