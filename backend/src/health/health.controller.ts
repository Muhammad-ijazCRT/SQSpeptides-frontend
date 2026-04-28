import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get("health")
  getHealth() {
    return {
      ok: true,
      service: "sqspeptides-backend",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "development",
    };
  }
}
