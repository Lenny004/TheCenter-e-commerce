import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models';

const MOCK_CART: CartItem[] = [
  {
    id: 1,
    user_id: 1,
    product_id: 1,
    quantity: 1,
    product: {
      id: 1, name: 'Camiseta Urban Basic', price: 29.99, gender: 'masculino',
      category_id: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop', seller_id: 1
    }
  },
  {
    id: 2,
    user_id: 1,
    product_id: 3,
    quantity: 1,
    product: {
      id: 3, name: 'Jeans Slim Fit', price: 59.99, gender: 'masculino',
      category_id: 2, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', seller_id: 1
    }
  },
  {
    id: 3,
    user_id: 1,
    product_id: 6,
    quantity: 1,
    product: {
      id: 6, name: 'Chaqueta Denim Classic', price: 74.99, gender: 'unisex',
      category_id: 4, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop', seller_id: 1
    }
  }
];

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartCount$ = new BehaviorSubject<number>(MOCK_CART.length);

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartItem[]> {
    // TODO: GET /api/cart
    return of(MOCK_CART);
  }

  addToCart(productId: number, quantity: number): Observable<CartItem> {
    // TODO: POST /api/cart
    return of({ id: Date.now(), user_id: 1, product_id: productId, quantity } as CartItem);
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
    // TODO: PUT /api/cart/:id
    return of({ id: cartItemId, user_id: 1, product_id: 0, quantity } as CartItem);
  }

  removeItem(cartItemId: number): Observable<void> {
    // TODO: DELETE /api/cart/:id
    return of(undefined);
  }

  checkout(): Observable<{ orderId: number }> {
    // TODO: POST /api/cart/checkout
    return of({ orderId: Date.now() });
  }

  getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }
}
