// ============================================================================
// The Center — Productos y catálogo (API)
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Category, GenderType, Product, Stock } from '../models';

const API = `${environment.apiUrl}/products`;

export interface ProductStockLine {
  size_id: number;
  quantity: number;
}

export interface ProductWritePayload {
  name: string;
  price: number;
  gender?: GenderType | null;
  image?: string | null;
  category_id: number;
  seller_id: number;
  stock: ProductStockLine[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API).pipe(
      catchError(() => of([] as Product[]))
    );
  }

  /** Catálogo admin: no enmascara errores HTTP */
  getProductsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(API);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${API}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  getProductByIdForAdmin(id: number): Observable<Product> {
    return this.http.get<Product>(`${API}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`).pipe(
      catchError(() => of([] as Category[]))
    );
  }

  getStockByProduct(productId: number): Observable<Stock[]> {
    return this.getProductById(productId).pipe(
      map((p) => p?.stock ?? [])
    );
  }

  createProduct(data: ProductWritePayload): Observable<Product> {
    return this.http.post<Product>(API, data);
  }

  updateProduct(id: number, data: ProductWritePayload): Observable<Product> {
    return this.http.put<Product>(`${API}/${id}`, data);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
