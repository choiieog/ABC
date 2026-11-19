import { Controller, Get } from '@nestjs/common';
import type { SupplierDto } from './suppliers.dto';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Get()
  list(): SupplierDto[] {
    return this.service.list();
  }
}
