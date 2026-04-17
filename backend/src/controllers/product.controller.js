// ============================================================================
// The Center — Controlador de Productos
// ============================================================================

import prisma from '../prisma/client.js';
import * as productService from '../services/product.service.js';
import { productOut } from '../utils/serialize.js';

const GENDERS = new Set(['masculino', 'femenino', 'unisex']);

function parseStock(req) {
  const raw = req.body.stock ?? req.body.stock_lines;
  if (!Array.isArray(raw)) return [];
  const map = new Map();
  for (const row of raw) {
    const sizeId = Number(row.size_id ?? row.sizeId);
    const quantity = Number(row.quantity);
    if (!Number.isInteger(sizeId) || sizeId < 1 || !Number.isInteger(quantity) || quantity < 0) continue;
    map.set(sizeId, (map.get(sizeId) || 0) + quantity);
  }
  return [...map.entries()].map(([sizeId, quantity]) => ({ sizeId, quantity }));
}

export async function getAll(_req, res) {
  const rows = await productService.findAll();
  res.json(rows.map(productOut));
}

/** Listado para el panel: el administrador ve todo; el vendedor solo sus productos. */
export async function getPanelList(req, res) {
  const rows =
    req.user.rol === 'admin'
      ? await productService.findAll()
      : await productService.findBySellerId(req.user.id);
  res.json(rows.map(productOut));
}

export async function getById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  const row = await productService.findById(id);
  if (!row) return res.status(404).json({ error: 'Producto no encontrado.' });
  if (req.user?.rol === 'vendedor' && row.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'No tiene acceso a este producto.' });
  }
  res.json(productOut(row));
}

export async function create(req, res) {
  const name = String(req.body?.name ?? '').trim();
  const price = Number(req.body?.price);
  const categoryId = Number(req.body?.category_id ?? req.body?.categoryId);
  let sellerId = Number(req.body?.seller_id ?? req.body?.sellerId);
  if (req.user.rol === 'vendedor') {
    sellerId = req.user.id;
  }
  let gender = req.body?.gender;
  if (gender === '' || gender === null) gender = null;
  const image = req.body?.image != null ? String(req.body.image).trim() || null : null;

  if (!name || name.length > 150) {
    return res.status(400).json({ error: 'Nombre obligatorio (máx. 150 caracteres).' });
  }
  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: 'Precio inválido.' });
  }
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return res.status(400).json({ error: 'Categoría inválida.' });
  }
  if (!Number.isInteger(sellerId) || sellerId < 1) {
    return res.status(400).json({ error: 'Vendedor inválido.' });
  }
  if (gender != null && !GENDERS.has(gender)) {
    return res.status(400).json({ error: 'Género inválido.' });
  }

  const [cat, seller] = await Promise.all([
    prisma.category.findUnique({ where: { id: categoryId } }),
    prisma.user.findUnique({ where: { id: sellerId } })
  ]);
  if (!cat) return res.status(400).json({ error: 'La categoría no existe.' });
  if (!seller || seller.rol !== 'vendedor') {
    return res.status(400).json({ error: 'El vendedor no existe o no tiene rol vendedor.' });
  }

  const stockLines = parseStock(req);
  const sizeIds = [...new Set(stockLines.map((s) => s.sizeId))];
  if (sizeIds.length) {
    const sizes = await prisma.size.findMany({ where: { id: { in: sizeIds } } });
    if (sizes.length !== sizeIds.length) {
      return res.status(400).json({ error: 'Una o más tallas no existen.' });
    }
  }

  const row = await productService.createProduct({
    name,
    price,
    gender,
    image,
    categoryId,
    sellerId,
    stockLines
  });
  res.status(201).json(productOut(row));
}

export async function update(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });

  const existing = await productService.findById(id);
  if (!existing) return res.status(404).json({ error: 'Producto no encontrado.' });

  if (req.user.rol === 'vendedor' && existing.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'No puede editar este producto.' });
  }

  const name = String(req.body?.name ?? '').trim();
  const price = Number(req.body?.price);
  const categoryId = Number(req.body?.category_id ?? req.body?.categoryId);
  let sellerId = Number(req.body?.seller_id ?? req.body?.sellerId);
  if (req.user.rol === 'vendedor') {
    sellerId = req.user.id;
  }
  let gender = req.body?.gender;
  if (gender === '' || gender === null) gender = null;
  const image = req.body?.image != null ? String(req.body.image).trim() || null : null;

  if (!name || name.length > 150) {
    return res.status(400).json({ error: 'Nombre obligatorio (máx. 150 caracteres).' });
  }
  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: 'Precio inválido.' });
  }
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return res.status(400).json({ error: 'Categoría inválida.' });
  }
  if (!Number.isInteger(sellerId) || sellerId < 1) {
    return res.status(400).json({ error: 'Vendedor inválido.' });
  }
  if (gender != null && !GENDERS.has(gender)) {
    return res.status(400).json({ error: 'Género inválido.' });
  }

  const [cat, seller] = await Promise.all([
    prisma.category.findUnique({ where: { id: categoryId } }),
    prisma.user.findUnique({ where: { id: sellerId } })
  ]);
  if (!cat) return res.status(400).json({ error: 'La categoría no existe.' });
  if (!seller || seller.rol !== 'vendedor') {
    return res.status(400).json({ error: 'El vendedor no existe o no tiene rol vendedor.' });
  }

  const stockLines = parseStock(req);
  const sizeIds = [...new Set(stockLines.map((s) => s.sizeId))];
  if (sizeIds.length) {
    const sizes = await prisma.size.findMany({ where: { id: { in: sizeIds } } });
    if (sizes.length !== sizeIds.length) {
      return res.status(400).json({ error: 'Una o más tallas no existen.' });
    }
  }

  const row = await productService.updateProduct(id, {
    name,
    price,
    gender,
    image,
    categoryId,
    sellerId,
    stockLines
  });
  res.json(productOut(row));
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  const existing = await productService.findById(id);
  if (!existing) return res.status(404).json({ error: 'Producto no encontrado.' });
  if (req.user.rol === 'vendedor' && existing.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'No puede eliminar este producto.' });
  }
  try {
    await productService.deleteProduct(id);
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Producto no encontrado.' });
    throw e;
  }
}
