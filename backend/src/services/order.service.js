// ============================================================================
// The Center — Servicio de Órdenes
// ============================================================================

import prisma from '../prisma/client.js';

const includeOrder = {
  user: true,
  details: { include: { product: { select: { id: true, name: true } } } }
};

export async function findAll() {
  return prisma.order.findMany({
    orderBy: { id: 'desc' },
    include: includeOrder
  });
}

export async function findById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: includeOrder
  });
}

export async function updateStatus(id, status) {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: includeOrder
  });
}

/** Elimina pedido y sus líneas (solo uso administrativo). */
export async function removeOrder(id) {
  await prisma.$transaction([
    prisma.orderDetail.deleteMany({ where: { orderId: id } }),
    prisma.order.delete({ where: { id } })
  ]);
}
