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
    orderBy: { id: 'asc' },
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


// ============================================================================
//  Transacción de Checkout (Checkout & Stock update)
// ============================================================================
export async function processCheckout(userId, frontendItems) {
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderDetails = [];

    // Iteramos los items que vienen de Angular
    for (const item of frontendItems) {
      const availableStocks = await tx.stock.findMany({
        where: {
          productId: item.product_id, // Ojo: en Angular la variable es product_id
          quantity: { gte: item.quantity }
        },
        orderBy: { id: 'asc' }
      });

      if (availableStocks.length === 0) {
        throw new Error(`Stock insuficiente para el producto ID ${item.product_id}`);
      }

      const stockToReduce = availableStocks[0];
      await tx.stock.update({
        where: { id: stockToReduce.id },
        data: { quantity: stockToReduce.quantity - item.quantity }
      });

      // En Angular, el precio viene dentro del objeto product
      const price = Number(item.product.price);
      totalAmount += price * item.quantity;

      orderDetails.push({
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: price
      });
    }

    const newOrder = await tx.order.create({
      data: {
        userId: Number(userId),
        total: totalAmount,
        status: 'pendiente',
        details: { create: orderDetails }
      }
    });

    return newOrder;
  });
}