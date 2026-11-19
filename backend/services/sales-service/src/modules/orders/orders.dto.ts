import { BadRequestException } from '@nestjs/common';

export interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
}

export function parseCreateOrder(body: unknown): CreateOrderDto {
  const input = body as { items?: unknown[] } | null;
  if (!Array.isArray(input?.items) || input.items.length < 1 || input.items.length > 50) {
    throw new BadRequestException('Đơn hàng phải có từ 1 đến 50 mặt hàng.');
  }

  const quantities = new Map<string, number>();
  for (const value of input.items) {
    const item = value as { productId?: unknown; quantity?: unknown } | null;
    if (typeof item?.productId !== 'string' || typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000 ||
        quantities.has(item.productId)) {
      throw new BadRequestException('Mỗi sản phẩm chỉ được gửi một lần với số lượng từ 1 đến 1000.');
    }
    quantities.set(item.productId, item.quantity);
  }
  return { items: [...quantities].map(([productId, quantity]) => ({ productId, quantity })) };
}
