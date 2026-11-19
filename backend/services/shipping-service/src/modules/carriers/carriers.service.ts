import { Injectable } from '@nestjs/common';
import type { Carrier } from './carriers.entity';

@Injectable()
export class CarriersService {
  list(): Carrier[] {
    return [
      {
        "id": "LOCAL",
        "name": "Đội xe nội bộ"
      }
    ];
  }
}
