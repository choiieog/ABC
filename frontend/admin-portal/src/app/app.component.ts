import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { pages } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header>
      <strong>XD Manager · Quản trị</strong>
      <nav aria-label="Điều hướng quản trị">
        @for (page of pages; track page.path) {
          <a [routerLink]="['/', page.path]" routerLinkActive="active">{{ page.title }}</a>
        }
      </nav>
    </header>
    <main><router-outlet /></main>
  `,
})
export class AppComponent {
  readonly pages = pages;
}
