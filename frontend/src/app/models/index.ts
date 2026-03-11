// ============================================================================
// The Center — Modelos / Interfaces (alineados con la BD PostgreSQL)
// ============================================================================

// ── ENUMs ───────────────────────────────────────────────────────

export type UserRole = 'vendedor' | 'cliente' | 'admin';
export type GenderType = 'masculino' | 'femenino' | 'unisex';
export type OrderStatus = 'cancelada' | 'procesando' | 'pendiente' | 'enviada' | 'entregada';

// ── Tablas maestras ─────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
}

export interface Size {
  id: number;
  size: string;
}

// ── User ────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  phone: string | null;
  password?: string;
  email: string;
  rol: UserRole;
}

// ── Product ─────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  gender: GenderType | null;
  category_id: number;
  image: string | null;
  seller_id: number;

  category?: Category;
  seller?: User;
}

// ── Stock ───────────────────────────────────────────────────────

export interface Stock {
  id: number;
  product_id: number;
  size_id: number;
  quantity: number;

  size?: Size;
}

// ── Shopping Cart ───────────────────────────────────────────────

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;

  product?: Product;
}

// ── Order ───────────────────────────────────────────────────────

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: OrderStatus;

  user?: User;
  details?: OrderDetail[];
}

// ── Order Detail ────────────────────────────────────────────────

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;

  product?: Product;
}
