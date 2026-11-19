import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

export type ResourceRow = Record<string, string | number | undefined>;

@Injectable({ providedIn: 'root' })
export class ResourceApiService {
  private readonly http = inject(HttpClient);

  list(endpoint: string) {
    return this.http.get<ResourceRow | ResourceRow[]>('/api/' + endpoint).pipe(
      map(result => Array.isArray(result) ? result : [result]),
    );
  }
}
