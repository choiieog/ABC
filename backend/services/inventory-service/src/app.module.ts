import { HealthModule } from '../../../shared/health/health.module';
import { Module } from '@nestjs/common';
import { StockModule } from './modules/stock/stock.module';

@Module({ imports: [HealthModule, StockModule] })
export class AppModule {}
