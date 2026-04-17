// ============================================================================
// The Center — Categorías (CRUD)
// ============================================================================

import prisma from '../prisma/client.js';
import { categoryOut } from '../utils/serialize.js';

export async function list(_req, res) {
  const rows = await prisma.category.findMany({ orderBy: { id: 'asc' } });
  res.json(rows.map(categoryOut));
}

export async function create(req, res) {
  const name = String(req.body?.name ?? '').trim();
  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Nombre obligatorio (máx. 100 caracteres).' });
  }
  const row = await prisma.category.create({ data: { name } });
  res.status(201).json(categoryOut(row));
}

export async function update(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  const name = String(req.body?.name ?? '').trim();
  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Nombre obligatorio (máx. 100 caracteres).' });
  }
  try {
    const row = await prisma.category.update({ where: { id }, data: { name } });
    res.json(categoryOut(row));
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Categoría no encontrada.' });
    throw e;
  }
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  try {
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Categoría no encontrada.' });
    if (e.code === 'P2003' || e.code === 'P2014') {
      return res.status(409).json({ error: 'No se puede eliminar: hay productos asociados.' });
    }
    throw e;
  }
}
