import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../../shared/api';

@Component({
  imports: [CurrencyPipe],
  template: `
    <h1>Tra cứu đơn hàng</h1>
    <form (submit)="$event.preventDefault(); lookup(code.value)">
      <label for="code">Mã đơn hàng</label>
      <p><input #code id="code" type="text" [value]="initialCode" required></p>
      <button type="submit" [disabled]="busy()">Tra cứu</button>
    </form>
    @if (busy()) { <p>Đang tra cứu…</p> }
    @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
    @if (order(); as result) {
      <article class="card">
        <h2>Đã tiếp nhận</h2>
        <p>Mã đơn hàng <strong>{{ result.id }}</strong></p>
        <ul>
          @for (item of result.items; track item.productId) {
            <li>{{ item.name }} × {{ item.quantity }}</li>
          }
        </ul>
        <p>Tổng tiền <strong>{{ result.total | currency:'VND' }}</strong></p>
      </article>
    }
  `,
})
export class TrackingComponent {
  private readonly http = inject(HttpClient);
  readonly initialCode = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  readonly order = signal<Order | null>(null);
  readonly error = signal('');
  readonly busy = signal(false);

  constructor() {
    if (this.initialCode) this.lookup(this.initialCode);
  }

  lookup(code: string) {
    if (this.busy() || !code.trim()) return;
    this.order.set(null);
    this.error.set('');
    this.busy.set(true);
    this.http.get<Order>('/api/orders/' + encodeURIComponent(code.trim())).subscribe({
      next: order => {
        this.order.set(order);
        this.busy.set(false);
      },
      error: response => {
        this.error.set(response.status === 404 ? 'Không tìm thấy đơn hàng.' : 'Không tra cứu được đơn hàng.');
        this.busy.set(false);
      },
    });
  }
}
