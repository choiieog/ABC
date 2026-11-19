import { HealthModule } from '../../../shared/health/health.module';
import { Module } from '@nestjs/common';
import { CarriersModule } from './modules/carriers/carriers.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';

@Module({ imports: [HealthModule, CarriersModule, ShipmentsModule] })
export class AppModule {}
