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
  imageFile?: File | null;
  category_id: number;
  seller_id: number;
  stock: ProductStockLine[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  resolveImageUrl(image: string | null | undefined): string | null {
    const raw = String(image ?? '').trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
      return raw;
    }
    const directBase = String(environment.apiDirectBase || '').replace(/\/+$/, '');
    if (raw.startsWith('/')) {
      return directBase ? `${directBase}${raw}` : raw;
    }
    return directBase ? `${directBase}/${raw}` : raw;
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API).pipe(
      catchError(() => of([] as Product[]))
    );
  }

  /** Listado del panel (admin: todos; vendedor: solo sus productos) */
  getProductsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API}/panel`);
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
    return this.http.post<Product>(API, this.toFormData(data));
  }

  updateProduct(id: number, data: ProductWritePayload): Observable<Product> {
    return this.http.put<Product>(`${API}/${id}`, this.toFormData(data));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }

  private toFormData(data: ProductWritePayload): FormData {
    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('price', String(data.price));
    fd.append('category_id', String(data.category_id));
    fd.append('seller_id', String(data.seller_id));
    fd.append('stock', JSON.stringify(data.stock ?? []));
    if (data.gender) fd.append('gender', data.gender);
    if (data.image != null) fd.append('image', data.image);
    if (data.imageFile) fd.append('image', data.imageFile);
    return fd;
  }
}
