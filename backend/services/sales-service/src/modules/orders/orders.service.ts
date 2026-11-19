import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { serviceFetch, serviceOrigin } from '../../../../../shared/service-http';
import type { CreateOrderDto } from './orders.dto';
import type { Order } from './orders.entity';

@Injectable()
export class OrdersService {
  private readonly orders = new Map<string, Order>();

  list() {
    return [...this.orders.values()].reverse();
  }

  find(id: string) {
    const order = this.orders.get(id);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng.');
    return order;
  }

  async create(input: CreateOrderDto): Promise<Order> {
    const response = await serviceFetch(new URL('/products', serviceOrigin('catalog', 3002)));
    if (!response.ok) throw new BadGatewayException('Không lấy được giá sản phẩm.');
    const products = await response.json() as { id: string; name: string; price: number }[];

    const items = input.items.map(({ productId, quantity }) => {
      const product = products.find(entry => entry.id === productId);
      if (!product) throw new BadRequestException(`Sản phẩm ${productId} không tồn tại.`);
      return { productId, quantity, name: product.name, unitPrice: product.price };
    });

    const order: Order = {
      id: randomUUID(),
      status: 'received',
      createdAt: new Date().toISOString(),
      total: items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
      items,
    };
    this.orders.set(order.id, order);
    return order;
  }
}
