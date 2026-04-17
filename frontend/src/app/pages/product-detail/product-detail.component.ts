import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Product, Stock } from '../../models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, TitleCasePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  stock: Stock[] = [];
  selectedSize = '';
  quantity = 1;
  isFavorite = false;
  addedToCart = false;
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 1;

    this.productService.getProductById(id).subscribe(product => {
      if (product) {
        this.product = product;
        this.loaded = true;
      }
    });

    this.productService.getStockByProduct(id).subscribe(stock => {
      this.stock = stock.filter(s => s.quantity > 0);
      if (this.stock.length) {
        this.selectedSize = this.stock[0].size?.size || '';
      }
    });
  }

  get availableSizes(): string[] {
    return this.stock.map(s => s.size?.size || '');
  }

  increaseQty(): void {
    if (this.quantity < 10) this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    this.cartService.addToCart(this.product.id, this.quantity, this.product).subscribe(() => {
      this.addedToCart = true;
      setTimeout(() => this.addedToCart = false, 2500);
    });
  }

  toggleWishlist(): void {
    this.isFavorite = !this.isFavorite;
  }

  imageUrl(image: string | null | undefined): string | null {
    return this.productService.resolveImageUrl(image);
  }
}
