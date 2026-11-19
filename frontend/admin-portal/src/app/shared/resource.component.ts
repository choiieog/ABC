import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Page } from '../app.routes';
import { ResourceApiService, type ResourceRow } from '../core/services/resource-api.service';

@Component({
  imports: [CurrencyPipe],
  template: `
    <h1>{{ page.title }}</h1>
    @if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    } @else if (rows(); as data) {
      <div class="table-wrap"><table>
        <thead><tr>
          @for (column of page.columns; track column.field) { <th scope="col">{{ column.label }}</th> }
        </tr></thead>
        <tbody>
          @for (row of data; track row) {
            <tr>
              @for (column of page.columns; track column.field) {
                <td>{{ column.currency ? (row[column.field] | currency:'VND') : row[column.field] }}</td>
              }
            </tr>
          } @empty {
            <tr><td [attr.colspan]="page.columns.length">Chưa có dữ liệu.</td></tr>
          }
        </tbody>
      </table></div>
    } @else {
      <p>Đang tải dữ liệu…</p>
    }
  `,
})
export class ResourceComponent {
  readonly page = inject(ActivatedRoute).snapshot.data['page'] as Page;
  readonly rows = signal<ResourceRow[] | null>(null);
  readonly error = signal('');

  constructor() {
    inject(ResourceApiService).list(this.page.endpoint).subscribe({
      next: rows => this.rows.set(rows),
      error: () => this.error.set('Không tải được dữ liệu từ API Gateway.'),
    });
  }
}
