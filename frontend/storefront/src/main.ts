import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeVi from '@angular/common/locales/vi';
import { LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

registerLocaleData(localeVi);

void bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes), { provide: LOCALE_ID, useValue: 'vi' }],
}).catch(console.error);
