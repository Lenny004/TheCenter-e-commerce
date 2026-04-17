// ============================================================================
// The Center — Administración de productos y stock
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Category, GenderType, Product, Size, User } from '../../../models';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { SizeService } from '../../../services/size.service';
import { UserAdminService } from '../../../services/user-admin.service';
import { AdminModalComponent } from '../../../components/admin-modal/admin-modal.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, FormsModule, AdminModalComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  sizes: Size[] = [];
  sellers: User[] = [];

  modalOpen = false;
  editing: Product | null = null;
  form = {
    name: '',
    price: null as number | null,
    gender: null as GenderType | null,
    image: '',
    category_id: 0,
    seller_id: 0,
    stock: [] as { size_id: number; quantity: number }[]
  };

  genders: { value: GenderType | null; label: string }[] = [
    { value: null, label: 'Sin especificar' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'unisex', label: 'Unisex' }
  ];

  feedback: string | null = null;
  errorMsg: string | null = null;
  pendingDelete: Product | null = null;
  deleteModalOpen = false;
  saving = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private sizeService: SizeService,
    private userAdminService: UserAdminService
  ) {}

  ngOnInit(): void {
    this.reloadLists();
  }

  reloadLists(): void {
    forkJoin({
      products: this.productService.getProductsAdmin(),
      categories: this.categoryService.getCategories(),
      sizes: this.sizeService.getSizes(),
      users: this.userAdminService.getUsers()
    }).subscribe({
      next: ({ products, categories, sizes, users }) => {
        this.products = products;
        this.categories = categories;
        this.sizes = sizes;
        this.sellers = users.filter((u) => u.rol === 'vendedor');
      },
      error: (err) => this.setError(err)
    });
  }

  openCreate(): void {
    this.editing = null;
    this.form = {
      name: '',
      price: null,
      gender: null,
      image: '',
      category_id: this.categories[0]?.id ?? 0,
      seller_id: this.sellers[0]?.id ?? 0,
      stock: this.defaultStockRow()
    };
    this.clearMessages();
    this.modalOpen = true;
  }

  openEdit(product: Product): void {
    this.editing = product;
    this.clearMessages();
    this.loadingProduct(product.id);
  }

  private loadingProduct(id: number): void {
    this.productService.getProductByIdForAdmin(id).subscribe({
      next: (p) => {
        this.form = {
          name: p.name,
          price: p.price,
          gender: p.gender,
          image: p.image ?? '',
          category_id: p.category_id,
          seller_id: p.seller_id,
          stock:
            p.stock?.map((s) => ({ size_id: s.size_id, quantity: s.quantity })) ??
            this.defaultStockRow()
        };
        if (this.form.stock.length === 0) this.form.stock = this.defaultStockRow();
        this.modalOpen = true;
      },
      error: (err) => this.setError(err)
    });
  }

  private defaultStockRow(): { size_id: number; quantity: number }[] {
    const sid = this.sizes[0]?.id ?? 0;
    return sid ? [{ size_id: sid, quantity: 0 }] : [];
  }

  addStockRow(): void {
    const sid = this.sizes[0]?.id ?? 0;
    if (!sid) return;
    this.form.stock.push({ size_id: sid, quantity: 0 });
  }

  removeStockRow(index: number): void {
    this.form.stock.splice(index, 1);
    if (this.form.stock.length === 0) this.form.stock = this.defaultStockRow();
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    const name = this.form.name.trim();
    const price = this.form.price;
    const category_id = this.form.category_id;
    const seller_id = this.form.seller_id;
    const image = this.form.image.trim() || null;

    if (!name || name.length > 150) {
      this.errorMsg = 'Nombre obligatorio (máx. 150 caracteres).';
      return;
    }
    if (price == null || Number.isNaN(price) || price < 0) {
      this.errorMsg = 'Precio inválido.';
      return;
    }
    if (!category_id || !seller_id) {
      this.errorMsg = 'Seleccione categoría y vendedor.';
      return;
    }

    const stock = this.form.stock
      .filter((l) => l.size_id > 0)
      .map((l) => ({
        size_id: l.size_id,
        quantity: Math.max(0, Math.floor(Number(l.quantity)))
      }));

    const payload = {
      name,
      price,
      gender: this.form.gender,
      image,
      category_id,
      seller_id,
      stock
    };

    this.saving = true;
    this.clearMessages();

    const req = this.editing
      ? this.productService.updateProduct(this.editing.id, payload)
      : this.productService.createProduct(payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.feedback = this.editing ? 'Producto actualizado.' : 'Producto creado.';
        this.modalOpen = false;
        this.reloadLists();
      },
      error: (err) => {
        this.saving = false;
        this.setError(err);
      }
    });
  }

  confirmDelete(p: Product): void {
    this.pendingDelete = p;
    this.deleteModalOpen = true;
  }

  onDeleteModalChange(open: boolean): void {
    this.deleteModalOpen = open;
    if (!open) this.pendingDelete = null;
  }

  executeDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.deleteModalOpen = false;
    this.pendingDelete = null;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.feedback = 'Producto eliminado.';
        this.reloadLists();
      },
      error: (err) => this.setError(err)
    });
  }

  private clearMessages(): void {
    this.feedback = null;
    this.errorMsg = null;
  }

  private setError(err: unknown): void {
    const msg =
      err && typeof err === 'object' && err !== null && 'error' in err
        ? (err as { error?: { error?: string } }).error?.error
        : null;
    this.errorMsg = msg || 'No se pudo completar la operación.';
  }
}
