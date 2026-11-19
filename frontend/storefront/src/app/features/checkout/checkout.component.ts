import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../../../../shared/api';
import { CartService } from '../../core/cart.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  template: `
    <h1>Xác nhận đơn hàng</h1>
    @if (cart.count()) {
      <p>{{ cart.count() }} đơn vị hàng · Tạm tính {{ cart.total() | currency:'VND' }}</p>
      <p>Hệ thống sẽ dùng giá trong danh mục tại thời điểm đặt đơn.</p>
      <button type="button" [disabled]="busy()" (click)="submit()">{{ busy() ? 'Đang gửi…' : 'Đặt hàng' }}</button>
    } @else {
      <p>Giỏ hàng đang trống. <a routerLink="/">Xem sản phẩm</a></p>
    }
    @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
  `,
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly busy = signal(false);
  readonly error = signal('');

  submit() {
    if (this.busy() || !this.cart.count()) return;
    this.error.set('');
    this.busy.set(true);
    const items = this.cart.items().map(item => ({ productId: item.product.id, quantity: item.quantity }));
    this.http.post<Order>('/api/orders', { items }).subscribe({
      next: order => {
        this.cart.clear();
        this.busy.set(false);
        void this.router.navigate(['/tracking', order.id]);
      },
      error: () => {
        this.error.set('Không đặt được hàng. Vui lòng thử lại.');
        this.busy.set(false);
      },
    });
  }
}
