import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../../../shared/api';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly entries = signal<{ product: Product; quantity: number }[]>([]);
  readonly items = this.entries.asReadonly();
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0));

  add(product: Product) {
    const entry = this.items().find(item => item.product.id === product.id);
    if (entry) {
      this.setQuantity(product.id, Math.min(entry.quantity + 1, 1000));
    } else {
      this.entries.update(items => [...items, { product, quantity: 1 }]);
    }
  }

  setQuantity(id: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) return;
    this.entries.update(items => items.map(item => item.product.id === id ? { ...item, quantity } : item));
  }

  remove(id: string) {
    this.entries.update(items => items.filter(item => item.product.id !== id));
  }

  clear() {
    this.entries.set([]);
  }
}
