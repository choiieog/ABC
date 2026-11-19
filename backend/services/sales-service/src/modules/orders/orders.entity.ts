interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: 'received';
  createdAt: string;
  total: number;
  items: OrderLine[];
}
