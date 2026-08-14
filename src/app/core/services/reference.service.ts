import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Reference } from '../models/reference.model';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/references`;

  getByCategory(category: string): Observable<Reference[]> {
    const params = new HttpParams()
      .set('category', category);

    return this.http.get<Reference[]>(
      this.apiUrl,
      { params }
    );
  }
}