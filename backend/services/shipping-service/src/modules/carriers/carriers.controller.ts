import { Controller, Get } from '@nestjs/common';
import type { CarrierDto } from './carriers.dto';
import { CarriersService } from './carriers.service';

@Controller('carriers')
export class CarriersController {
  constructor(private readonly service: CarriersService) {}

  @Get()
  list(): CarrierDto[] {
    return this.service.list();
  }
}
