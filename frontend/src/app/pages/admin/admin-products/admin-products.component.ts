import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, Category, GenderType } from '../../../models';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  showForm = false;

  form: Partial<Product> & { gender: GenderType | null } = {
    name: '',
    price: 0,
    gender: null,
    category_id: 0,
    image: '',
    seller_id: 1
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(p => this.products = p);
    this.productService.getCategories().subscribe(c => this.categories = c);
  }

  openForm(): void {
    this.form = { name: '', price: 0, gender: null, category_id: 0, image: '', seller_id: 1 };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveProduct(): void {
    this.showForm = false;
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}
