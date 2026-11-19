import { HealthModule } from '../../../shared/health/health.module';
import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';

@Module({ imports: [HealthModule, OrdersModule] })
export class AppModule {}
