import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Product } from '../../../../../shared/api';
import { CartService } from '../../core/cart.service';

@Component({
  imports: [CurrencyPipe],
  template: `
    <h1>Vật liệu xây dựng</h1>
    @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
    @else if (!products()) { <p>Đang tải danh mục…</p> }
    <div class="grid">
      @for (product of products(); track product.id) {
        <article class="card">
          <h2>{{ product.name }}</h2>
          <p>{{ product.id }} · {{ product.price | currency:'VND' }} / {{ product.unit }}</p>
          <button type="button" (click)="cart.add(product)">Thêm vào giỏ</button>
        </article>
      }
    </div>
  `,
})
export class CatalogComponent {
  readonly cart = inject(CartService);
  readonly products = signal<Product[] | null>(null);
  readonly error = signal('');

  constructor() {
    inject(HttpClient).get<Product[]>('/api/products').subscribe({
      next: products => this.products.set(products),
      error: () => this.error.set('Không tải được danh mục sản phẩm.'),
    });
  }
}
