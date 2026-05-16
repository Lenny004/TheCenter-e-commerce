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

  // 1. Definimos la URL base del backend de forma limpia y como constante
  private readonly API_URL = 'http://localhost:5000';

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

  // 2. Resolvemos la imagen localmente usando nuestra constante
  resolveImageUrl(image: string | null | undefined): string {
    if (!image) {
      // Imagen por defecto si el producto no tiene foto
      return 'assets/logo.png'; 
    }
    // Concatenamos limpiamente la API con la ruta de la imagen
    return `${this.API_URL}${image}`;
  }
}