// ============================================================================
// The Center — Usuarios (administración)
// ============================================================================

import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';
import { userPublic } from '../utils/serialize.js';

const ROLES = new Set(['vendedor', 'cliente', 'admin']);

export async function list(_req, res) {
  const rows = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, name: true, phone: true, email: true, rol: true }
  });
  res.json(rows.map((u) => userPublic(u)));
}

export async function getById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });
  const row = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, phone: true, email: true, rol: true }
  });
  if (!row) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json(userPublic(row));
}

export async function create(req, res) {
  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = req.body?.password;
  const phone = req.body?.phone != null ? String(req.body.phone).trim() || null : null;
  const rol = req.body?.rol;

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Nombre obligatorio (máx. 100 caracteres).' });
  }
  if (!email || email.length > 150) {
    return res.status(400).json({ error: 'Email inválido.' });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'Contraseña obligatoria (mín. 6 caracteres).' });
  }
  if (!ROLES.has(rol)) {
    return res.status(400).json({ error: 'Rol inválido.' });
  }
  if (phone && phone.length > 20) {
    return res.status(400).json({ error: 'Teléfono demasiado largo (máx. 20).' });
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        rol
      },
      select: { id: true, name: true, phone: true, email: true, rol: true }
    });
    res.status(201).json(userPublic(user));
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'El email ya está registrado.' });
    throw e;
  }
}

export async function update(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });

  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const phone = req.body?.phone != null ? String(req.body.phone).trim() || null : null;
  const rol = req.body?.rol;
  const password = req.body?.password;

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Nombre obligatorio (máx. 100 caracteres).' });
  }
  if (!email || email.length > 150) {
    return res.status(400).json({ error: 'Email inválido.' });
  }
  if (!ROLES.has(rol)) {
    return res.status(400).json({ error: 'Rol inválido.' });
  }
  if (phone && phone.length > 20) {
    return res.status(400).json({ error: 'Teléfono demasiado largo (máx. 20).' });
  }

  const updateData = {
    name,
    email,
    phone,
    rol
  };

  if (password != null && String(password).length > 0) {
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    updateData.password = await bcrypt.hash(String(password), 10);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, phone: true, email: true, rol: true }
    });
    res.json(userPublic(user));
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Usuario no encontrado.' });
    if (e.code === 'P2002') return res.status(409).json({ error: 'El email ya está en uso.' });
    throw e;
  }
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Usuario no encontrado.' });
    if (e.code === 'P2003' || e.code === 'P2014') {
      return res.status(409).json({
        error: 'No se puede eliminar: el usuario tiene pedidos, productos o carrito asociados.'
      });
    }
    throw e;
  }
}
