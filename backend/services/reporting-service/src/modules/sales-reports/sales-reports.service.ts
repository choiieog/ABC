import { BadGatewayException, Injectable } from '@nestjs/common';
import { serviceFetch, serviceOrigin } from '../../../../../shared/service-http';
import type { SalesReport } from './sales-reports.entity';

@Injectable()
export class SalesReportsService {
  async summary(): Promise<SalesReport> {
    const response = await serviceFetch(new URL('/orders', serviceOrigin('sales', 3004)));
    if (!response.ok) throw new BadGatewayException('Không lấy được dữ liệu đơn hàng.');
    const orders = await response.json() as { total: number }[];
    return {
      orderCount: orders.length,
      orderTotal: orders.reduce((sum, order) => sum + order.total, 0),
    };
  }
}
