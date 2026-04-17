// ============================================================================
// The Center — Controlador de Órdenes
// ============================================================================

import * as orderService from '../services/order.service.js';
import { orderOut } from '../utils/serialize.js';

const STATUSES = new Set(['cancelada', 'procesando', 'pendiente', 'enviada', 'entregada']);

export async function getAll(_req, res) {
  const rows = await orderService.findAll();
  res.json(rows.map(orderOut));
}

export async function getById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  const row = await orderService.findById(id);
  if (!row) return res.status(404).json({ error: 'Pedido no encontrado.' });
  res.json(orderOut(row));
}

export async function update(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });

  const status = req.body?.status ?? req.body?.estado;
  if (!STATUSES.has(status)) {
    return res.status(400).json({ error: 'Estado de pedido inválido.' });
  }

  try {
    const row = await orderService.updateStatus(id, status);
    res.json(orderOut(row));
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Pedido no encontrado.' });
    throw e;
  }
}
