import { Controller, Get } from '@nestjs/common';
import type { ReceiptDto } from './receipts.dto';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Get()
  list(): ReceiptDto[] {
    return this.service.list();
  }
}
