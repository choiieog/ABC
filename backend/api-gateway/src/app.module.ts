import { HealthModule } from '../../shared/health/health.module';
import { Module } from '@nestjs/common';
import { GatewayController } from './routing/gateway.controller';

@Module({ imports: [HealthModule],  controllers: [GatewayController] })
export class AppModule {}
