// ============================================================================
// The Center — Página de Catálogo (Fase 2: Conectado al Backend)
// ============================================================================

import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private http = inject(HttpClient);

  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];

  // Estado de los filtros
  selectedCategory: number | null = null;
  selectedGender: string | null = null;
  genders = ['masculino', 'femenino', 'unisex'];

  ngOnInit() {
    this.fetchCategories();
    this.fetchProducts();
  }

  fetchProducts() {
    // Traemos los productos reales de tu backend en el puerto 5000
    this.http.get<any[]>('http://localhost:5000/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // Al inicio mostramos todos
      },
      error: (err) => console.error('Error al cargar la ropa:', err)
    });
  }

  fetchCategories() {
    this.http.get<any[]>('http://localhost:5000/api/categories').subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  // --- LÓGICA DE FILTROS ---
  setCategoryFilter(catId: number | null) {
    this.selectedCategory = catId;
    this.applyFilters();
  }

  setGenderFilter(gender: string | null) {
    this.selectedGender = gender;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchCategory = this.selectedCategory ? p.category_id === this.selectedCategory : true;
      const matchGender = this.selectedGender ? p.gender === this.selectedGender : true;
      return matchCategory && matchGender;
    });
  }

  // --- MAGIA PARA LAS FOTOS ---
  getImageUrl(path: string | null): string {
    if (!path) return 'assets/placeholder.png'; // Si el producto no tiene foto
    return `http://localhost:5000${path}`;
  }
}