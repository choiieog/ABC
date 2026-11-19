import { Controller, Get } from '@nestjs/common';
import type { SalesReportDto } from './sales-reports.dto';
import { SalesReportsService } from './sales-reports.service';

@Controller('sales-reports')
export class SalesReportsController {
  constructor(private readonly service: SalesReportsService) {}

  @Get()
  summary(): Promise<SalesReportDto> {
    return this.service.summary();
  }
}
