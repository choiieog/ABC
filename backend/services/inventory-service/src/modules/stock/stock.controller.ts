import { Controller, Get } from '@nestjs/common';
import type { StockDto } from './stock.dto';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  list(): StockDto[] {
    return this.service.list();
  }
}
