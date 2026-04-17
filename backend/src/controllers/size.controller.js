// ============================================================================
// The Center — Tallas (CRUD)
// ============================================================================

import prisma from '../prisma/client.js';
import { sizeOut } from '../utils/serialize.js';

export async function list(_req, res) {
  const rows = await prisma.size.findMany({ orderBy: { id: 'asc' } });
  res.json(rows.map(sizeOut));
}

export async function create(req, res) {
  const size = String(req.body?.size ?? '').trim();
  if (!size || size.length > 50) {
    return res.status(400).json({ error: 'Talla obligatoria (máx. 50 caracteres).' });
  }
  const row = await prisma.size.create({ data: { size } });
  res.status(201).json(sizeOut(row));
}

export async function update(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  const size = String(req.body?.size ?? '').trim();
  if (!size || size.length > 50) {
    return res.status(400).json({ error: 'Talla obligatoria (máx. 50 caracteres).' });
  }
  try {
    const row = await prisma.size.update({ where: { id }, data: { size } });
    res.json(sizeOut(row));
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Talla no encontrada.' });
    throw e;
  }
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  try {
    await prisma.size.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Talla no encontrada.' });
    if (e.code === 'P2003' || e.code === 'P2014') {
      return res.status(409).json({ error: 'No se puede eliminar: hay stock u órdenes asociadas.' });
    }
    throw e;
  }
}
