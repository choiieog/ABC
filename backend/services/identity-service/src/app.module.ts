import { HealthModule } from '../../../shared/health/health.module';
import { Module } from '@nestjs/common';
import { RolesModule } from './modules/roles/roles.module';

@Module({ imports: [HealthModule, RolesModule] })
export class AppModule {}
