import { Injectable } from '@nestjs/common';
import type { Receipt } from './receipts.entity';

@Injectable()
export class ReceiptsService {
  list(): Receipt[] {
    return [];
  }
}
