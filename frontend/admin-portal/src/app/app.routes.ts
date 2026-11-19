import { Routes } from '@angular/router';

export interface Page {
  path: string;
  title: string;
  endpoint: string;
  columns: { field: string; label: string; currency?: boolean }[];
}

export const pages: Page[] = [
  { path: 'catalog', title: 'Danh mục', endpoint: 'products', columns: [
    { field: 'id', label: 'Mã' }, { field: 'name', label: 'Tên sản phẩm' },
    { field: 'unit', label: 'Đơn vị' }, { field: 'price', label: 'Giá', currency: true },
  ] },
  { path: 'inventory', title: 'Tồn kho', endpoint: 'stock', columns: [
    { field: 'productId', label: 'Mã sản phẩm' }, { field: 'available', label: 'Có sẵn' },
  ] },
  { path: 'orders', title: 'Đơn hàng', endpoint: 'orders', columns: [
    { field: 'id', label: 'Mã đơn' }, { field: 'total', label: 'Tổng tiền', currency: true },
  ] },
  { path: 'shipping', title: 'Vận chuyển', endpoint: 'carriers', columns: [
    { field: 'id', label: 'Mã' }, { field: 'name', label: 'Đơn vị vận chuyển' },
  ] },
  { path: 'purchasing', title: 'Nhà cung cấp', endpoint: 'suppliers', columns: [
    { field: 'id', label: 'Mã' }, { field: 'name', label: 'Nhà cung cấp' },
  ] },
  { path: 'roles', title: 'Vai trò', endpoint: 'roles', columns: [
    { field: 'id', label: 'Mã' }, { field: 'name', label: 'Vai trò mẫu' },
  ] },
  { path: 'reports', title: 'Báo cáo', endpoint: 'sales-reports', columns: [
    { field: 'orderCount', label: 'Số đơn' }, { field: 'orderTotal', label: 'Tổng giá trị đơn', currency: true },
  ] },
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
  ...pages.map(page => ({
    path: page.path,
    title: page.title + ' · XD Manager',
    data: { page },
    loadComponent: () => import('./shared/resource.component').then(m => m.ResourceComponent),
  })),
  { path: '**', redirectTo: 'catalog' },
];
