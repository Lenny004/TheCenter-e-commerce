// ============================================================================
// The Center — Categorías (API)
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models';

const API = `${environment.apiUrl}/categories`;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API);
  }

  create(data: Pick<Category, 'name'>): Observable<Category> {
    return this.http.post<Category>(API, data);
  }

  update(id: number, data: Pick<Category, 'name'>): Observable<Category> {
    return this.http.put<Category>(`${API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
