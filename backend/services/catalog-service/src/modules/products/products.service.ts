import { Injectable } from '@nestjs/common';
import type { Product } from './products.entity';

@Injectable()
export class ProductsService {
  list(): Product[] {
    return [
      { id: 'XM01', name: 'Xi măng PCB40', categoryId: 'cement', unit: 'bao', price: 95000 },
      { id: 'TH01', name: 'Thép cây D10', categoryId: 'steel', unit: 'cây', price: 125000 },
      { id: 'GA01', name: 'Gạch xây 4 lỗ', categoryId: 'brick', unit: 'viên', price: 1800 },
    ];
  }
}
