// ============================================================================
// The Center — Tallas (API)
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Size } from '../models';

const API = `${environment.apiUrl}/sizes`;

@Injectable({ providedIn: 'root' })
export class SizeService {
  constructor(private http: HttpClient) {}

  getSizes(): Observable<Size[]> {
    return this.http.get<Size[]>(API);
  }

  create(data: Pick<Size, 'size'>): Observable<Size> {
    return this.http.post<Size>(API, data);
  }

  update(id: number, data: Pick<Size, 'size'>): Observable<Size> {
    return this.http.put<Size>(`${API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
