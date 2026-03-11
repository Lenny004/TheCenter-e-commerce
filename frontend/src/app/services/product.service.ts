import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, Category, Stock, Size } from '../models';

const CATEGORIES: Category[] = [
  { id: 1, name: 'Camisetas' },
  { id: 2, name: 'Pantalones' },
  { id: 3, name: 'Vestidos' },
  { id: 4, name: 'Chaquetas' }
];

const SIZES: Size[] = [
  { id: 1, size: 'XS' },
  { id: 2, size: 'S' },
  { id: 3, size: 'M' },
  { id: 4, size: 'L' },
  { id: 5, size: 'XL' },
  { id: 6, size: 'XXL' }
];

const SELLER = { id: 1, name: 'The Center Store', phone: null, email: 'store@thecenter.com', rol: 'vendedor' as const };

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Camiseta Urban Basic',
    price: 29.99,
    gender: 'masculino',
    category_id: 1,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    seller_id: 1,
    category: CATEGORIES[0],
    seller: SELLER
  },
  {
    id: 2,
    name: 'Blusa Elegance',
    price: 45.00,
    gender: 'femenino',
    category_id: 1,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop',
    seller_id: 1,
    category: CATEGORIES[0],
    seller: SELLER
  },
  {
    id: 3,
    name: 'Jeans Slim Fit',
    price: 59.99,
    gender: 'masculino',
    category_id: 2,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
    seller_id: 1,
    category: CATEGORIES[1],
    seller: SELLER
  },
  {
    id: 4,
    name: 'Pantalón Palazzo',
    price: 54.50,
    gender: 'femenino',
    category_id: 2,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    seller_id: 1,
    category: CATEGORIES[1],
    seller: SELLER
  },
  {
    id: 5,
    name: 'Vestido Cocktail Night',
    price: 89.99,
    gender: 'femenino',
    category_id: 3,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
    seller_id: 1,
    category: CATEGORIES[2],
    seller: SELLER
  },
  {
    id: 6,
    name: 'Chaqueta Denim Classic',
    price: 74.99,
    gender: 'unisex',
    category_id: 4,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    seller_id: 1,
    category: CATEGORIES[3],
    seller: SELLER
  }
];

const MOCK_STOCK: Stock[] = [
  { id: 1, product_id: 1, size_id: 1, quantity: 5, size: SIZES[0] },
  { id: 2, product_id: 1, size_id: 2, quantity: 10, size: SIZES[1] },
  { id: 3, product_id: 1, size_id: 3, quantity: 15, size: SIZES[2] },
  { id: 4, product_id: 1, size_id: 4, quantity: 12, size: SIZES[3] },
  { id: 5, product_id: 1, size_id: 5, quantity: 8, size: SIZES[4] },
  { id: 6, product_id: 1, size_id: 6, quantity: 4, size: SIZES[5] },
  { id: 7, product_id: 3, size_id: 2, quantity: 7, size: SIZES[1] },
  { id: 8, product_id: 3, size_id: 3, quantity: 14, size: SIZES[2] },
  { id: 9, product_id: 3, size_id: 4, quantity: 10, size: SIZES[3] },
  { id: 10, product_id: 5, size_id: 1, quantity: 3, size: SIZES[0] },
  { id: 11, product_id: 5, size_id: 2, quantity: 6, size: SIZES[1] },
  { id: 12, product_id: 5, size_id: 3, quantity: 9, size: SIZES[2] }
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // TODO: GET /api/products
    return of(MOCK_PRODUCTS);
  }

  getProductById(id: number): Observable<Product | undefined> {
    // TODO: GET /api/products/:id
    return of(MOCK_PRODUCTS.find(p => p.id === id));
  }

  getCategories(): Observable<Category[]> {
    // TODO: GET /api/categories
    return of(CATEGORIES);
  }

  getStockByProduct(productId: number): Observable<Stock[]> {
    // TODO: GET /api/products/:id/stock
    return of(MOCK_STOCK.filter(s => s.product_id === productId));
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    // TODO: POST /api/products
    return of({ ...data, id: Date.now() } as Product);
  }

  updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    // TODO: PUT /api/products/:id
    return of({ ...data, id } as Product);
  }

  deleteProduct(id: number): Observable<void> {
    // TODO: DELETE /api/products/:id
    return of(undefined);
  }
}
