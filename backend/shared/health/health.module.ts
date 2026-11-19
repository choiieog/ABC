import { Controller, Get, Module } from '@nestjs/common';

@Controller('health')
class HealthController {
  @Get()
  health() {
    return { service: process.env.SERVICE_NAME ?? 'backend', status: 'ok' };
  }
}

@Module({ controllers: [HealthController] })
export class HealthModule {}
