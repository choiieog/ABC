import { HealthModule } from '../../../shared/health/health.module';
import { Module } from '@nestjs/common';
import { SalesReportsModule } from './modules/sales-reports/sales-reports.module';

@Module({ imports: [HealthModule, SalesReportsModule] })
export class AppModule {}
