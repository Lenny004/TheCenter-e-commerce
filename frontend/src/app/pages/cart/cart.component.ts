import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../models';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.items = items;
    });
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }

  get shipping(): number {
    return this.subtotal >= 50 ? 0 : 4.99;
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }

  updateQty(cartItemId: number, delta: number): void {
    const item = this.items.find(i => i.id === cartItemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      item.quantity = newQty;
      this.cartService.updateQuantity(cartItemId, newQty).subscribe();
    }
  }

  removeItem(cartItemId: number): void {
    this.items = this.items.filter(i => i.id !== cartItemId);
    this.cartService.removeItem(cartItemId).subscribe();
  }

  checkout(): void {
    this.cartService.checkout().subscribe(res => {
      alert(`Pedido #${res.orderId} creado exitosamente`);
    });
  }

  imageUrl(image: string | null | undefined): string | null {
    return this.productService.resolveImageUrl(image);
  }
}
