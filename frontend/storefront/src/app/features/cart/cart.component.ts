import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  template: `
    <h1>Giỏ hàng</h1>
    @if (cart.count()) {
      <div class="table-wrap"><table>
        <thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Thành tiền</th><th>Thao tác</th></tr></thead>
        <tbody>
          @for (item of cart.items(); track item.product.id) {
            <tr>
              <td>{{ item.product.name }}</td>
              <td><input #quantity type="number" min="1" max="1000" [attr.aria-label]="'Số lượng ' + item.product.name"
                         [value]="item.quantity" (change)="updateQuantity(item.product.id, quantity, item.quantity)"></td>
              <td>{{ item.product.price * item.quantity | currency:'VND' }}</td>
              <td><button type="button" (click)="cart.remove(item.product.id)">Xóa</button></td>
            </tr>
          }
        </tbody>
      </table></div>
      <p>Tạm tính <strong>{{ cart.total() | currency:'VND' }}</strong></p>
      <a class="button" routerLink="/checkout">Đến bước xác nhận</a>
    } @else {
      <p>Giỏ hàng đang trống. <a routerLink="/">Xem sản phẩm</a></p>
    }
  `,
})
export class CartComponent {
  readonly cart = inject(CartService);

  updateQuantity(id: string, input: HTMLInputElement, previous: number) {
    if (!input.checkValidity() || !input.value) {
      input.value = String(previous);
      return;
    }
    this.cart.setQuantity(id, input.valueAsNumber);
  }
}
