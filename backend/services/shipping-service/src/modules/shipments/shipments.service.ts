import { Injectable } from '@nestjs/common';
import type { Shipment } from './shipments.entity';

@Injectable()
export class ShipmentsService {
  list(): Shipment[] {
    return [];
  }
}
