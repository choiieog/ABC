import { Injectable } from '@nestjs/common';
import type { Stock } from './stock.entity';

@Injectable()
export class StockService {
  list(): Stock[] {
    return [
      {
        "productId": "XM01",
        "available": 120
      },
      {
        "productId": "TH01",
        "available": 85
      },
      {
        "productId": "GA01",
        "available": 2000
      }
    ];
  }
}
