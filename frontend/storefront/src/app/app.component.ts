import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './core/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header>
      <strong>XD Manager · Cửa hàng</strong>
      <nav aria-label="Điều hướng cửa hàng">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Sản phẩm</a>
        <a routerLink="/cart" routerLinkActive="active">Giỏ hàng ({{ cart.count() }})</a>
        <a routerLink="/tracking" routerLinkActive="active">Tra cứu đơn</a>
      </nav>
    </header>
    <main><router-outlet /></main>
  `,
})
export class AppComponent {
  readonly cart = inject(CartService);
}
