import { HealthModule } from '../../../shared/health/health.module';
import { Module } from '@nestjs/common';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';

@Module({ imports: [HealthModule, ReceiptsModule, SuppliersModule] })
export class AppModule {}
