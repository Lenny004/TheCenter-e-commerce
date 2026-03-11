import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Product, Category } from '../../models';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, TitleCasePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  activeCategory = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(p => this.products = p);
    this.productService.getCategories().subscribe(c => this.categories = c);
  }

  get filteredProducts(): Product[] {
    if (this.activeCategory === 0) return this.products;
    return this.products.filter(p => p.category_id === this.activeCategory);
  }

  setCategory(id: number): void {
    this.activeCategory = id;
  }
}
