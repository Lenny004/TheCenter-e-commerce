// ============================================================================
// The Center — Serialización API (Decimal Prisma → JSON plano)
// ============================================================================

/** @param {import('@prisma/client').Decimal} d */
export function dec(d) {
  return d != null ? Number(d) : null;
}

export function userPublic(u) {
  if (!u) return undefined;
  return {
    id: u.id,
    name: u.name,
    phone: u.phone ?? null,
    email: u.email,
    rol: u.rol
  };
}

export function categoryOut(c) {
  return { id: c.id, name: c.name };
}

export function sizeOut(s) {
  return { id: s.id, size: s.size };
}

export function stockOut(s) {
  return {
    id: s.id,
    product_id: s.productId,
    size_id: s.sizeId,
    quantity: s.quantity,
    size: s.size ? sizeOut(s.size) : undefined
  };
}

export function productOut(p) {
  return {
    id: p.id,
    name: p.name,
    price: dec(p.price),
    gender: p.gender,
    category_id: p.categoryId,
    image: p.image,
    seller_id: p.sellerId,
    category: p.category ? categoryOut(p.category) : undefined,
    seller: p.seller ? userPublic(p.seller) : undefined,
    stock: Array.isArray(p.stock) ? p.stock.map(stockOut) : undefined
  };
}

export function orderDetailOut(d) {
  return {
    id: d.id,
    order_id: d.orderId,
    product_id: d.productId,
    quantity: d.quantity,
    unit_price: dec(d.unitPrice),
    product: d.product ? { id: d.product.id, name: d.product.name } : undefined
  };
}

export function orderOut(o) {
  return {
    id: o.id,
    user_id: o.userId,
    total: dec(o.total),
    status: o.status,
    user: o.user ? userPublic(o.user) : undefined,
    details: Array.isArray(o.details) ? o.details.map(orderDetailOut) : undefined
  };
}
