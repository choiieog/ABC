import { Injectable } from '@nestjs/common';
import type { Supplier } from './suppliers.entity';

@Injectable()
export class SuppliersService {
  list(): Supplier[] {
    return [
      {
        "id": "NCC01",
        "name": "Nhà cung cấp vật liệu mẫu"
      }
    ];
  }
}
