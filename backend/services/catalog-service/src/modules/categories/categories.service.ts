import { Injectable } from '@nestjs/common';
import type { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  list(): Category[] {
    return [
      {
        "id": "cement",
        "name": "Xi măng"
      },
      {
        "id": "steel",
        "name": "Thép"
      },
      {
        "id": "brick",
        "name": "Gạch"
      }
    ];
  }
}
