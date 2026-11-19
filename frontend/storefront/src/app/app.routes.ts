import { Routes } from '@angular/router';

const tracking = () => import('./features/order-tracking/tracking.component').then(m => m.TrackingComponent);

export const routes: Routes = [
  { path: '', title: 'Sản phẩm · XD Manager', loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'cart', title: 'Giỏ hàng · XD Manager', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', title: 'Xác nhận đơn · XD Manager', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'tracking/:id', title: 'Tra cứu đơn · XD Manager', loadComponent: tracking },
  { path: 'tracking', title: 'Tra cứu đơn · XD Manager', loadComponent: tracking },
  { path: '**', redirectTo: '' },
];
