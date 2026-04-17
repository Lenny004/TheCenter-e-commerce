import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models';

const STORAGE_KEY = 'the-center-cart';
const USER_ID = 1;

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = this.readStoredCart();
  private cartCount$ = new BehaviorSubject<number>(this.calculateCount(this.items));

  private readStoredCart(): CartItem[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persistCart(items: CartItem[]): void {
    this.items = items;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    this.cartCount$.next(this.calculateCount(items));
  }

  private calculateCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  getCart(): Observable<CartItem[]> {
    return of(this.items);
  }

  addToCart(productId: number, quantity: number, product?: Product): Observable<CartItem> {
    const existingItem = this.items.find(item => item.product_id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      if (product) existingItem.product = product;
      this.persistCart([...this.items]);
      return of(existingItem);
    }

    const newItem: CartItem = {
      id: Date.now(),
      user_id: USER_ID,
      product_id: productId,
      quantity,
      product
    };

    this.persistCart([...this.items, newItem]);
    return of(newItem);
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
    const item = this.items.find(cartItem => cartItem.id === cartItemId);
    if (!item) {
      return of({ id: cartItemId, user_id: USER_ID, product_id: 0, quantity } as CartItem);
    }

    item.quantity = quantity;
    this.persistCart([...this.items]);
    return of(item);
  }

  removeItem(cartItemId: number): Observable<void> {
    this.persistCart(this.items.filter(item => item.id !== cartItemId));
    return of(undefined);
  }

  checkout(): Observable<{ orderId: number }> {
    this.persistCart([]);
    return of({ orderId: Date.now() });
  }

  getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }
}
