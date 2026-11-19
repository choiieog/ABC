export interface Product {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface Order {
  id: string;
  status: 'received';
  createdAt: string;
  total: number;
  items: { productId: string; name: string; quantity: number; unitPrice: number }[];
}
