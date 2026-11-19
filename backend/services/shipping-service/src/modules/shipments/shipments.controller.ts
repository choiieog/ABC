import { Controller, Get } from '@nestjs/common';
import type { ShipmentDto } from './shipments.dto';
import { ShipmentsService } from './shipments.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  @Get()
  list(): ShipmentDto[] {
    return this.service.list();
  }
}
