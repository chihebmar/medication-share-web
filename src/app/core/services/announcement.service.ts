import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Announcement } from '../models/announcement.model';
import { CreateAnnouncement } from '../models/create-announcement.model';
import { SearchAnnouncement } from '../models/search-announcement.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/announcements`;

  search(
    criteria: SearchAnnouncement,
    page = 0,
    size = 10
  ): Observable<Page<Announcement>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');

    if (criteria.medicationName) {
      params = params.set(
        'medicationName',
        criteria.medicationName
      );
    }

    if (criteria.typeCode) {
      params = params.set(
        'typeCode',
        criteria.typeCode
      );
    }

    if (criteria.governorateCode) {
      params = params.set(
        'governorateCode',
        criteria.governorateCode
      );
    }

    return this.http.get<Page<Announcement>>(
      this.apiUrl,
      { params }
    );
  }

  getById(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(
      `${this.apiUrl}/${id}`
    );
  }

  create(
    request: CreateAnnouncement
  ): Observable<Announcement> {
    return this.http.post<Announcement>(
      this.apiUrl,
      request
    );
  }

  archive(id: number): Observable<Announcement> {
    return this.http.patch<Announcement>(
      `${this.apiUrl}/${id}/archive`,
      {}
    );
  }

  getPending(
  criteria: SearchAnnouncement,
  page = 0,
  size = 10
): Observable<Page<Announcement>> {

  let params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sort', 'createdAt,desc');

  if (criteria.medicationName) {
    params = params.set(
      'medicationName',
      criteria.medicationName
    );
  }

  if (criteria.typeCode) {
    params = params.set(
      'typeCode',
      criteria.typeCode
    );
  }

  if (criteria.governorateCode) {
    params = params.set(
      'governorateCode',
      criteria.governorateCode
    );
  }

  return this.http.get<Page<Announcement>>(
    `${this.apiUrl}/pending`,
    { params }
  );
}

approve(id: number): Observable<Announcement> {
  return this.http.patch<Announcement>(
    `${this.apiUrl}/${id}/approve`,
    {}
  );
}

reject(id: number): Observable<Announcement> {
  return this.http.patch<Announcement>(
    `${this.apiUrl}/${id}/reject`,
    {}
  );
}

}