// ============================================================================
// The Center — Servicio de Productos (Prisma)
// ============================================================================

import prisma from '../prisma/client.js';

const includeProduct = {
  category: true,
  seller: true,
  stock: { include: { size: true } }
};

export async function findAll() {
  return prisma.product.findMany({
    orderBy: { id: 'asc' },
    include: includeProduct
  });
}

export async function findBySellerId(sellerId) {
  return prisma.product.findMany({
    where: { sellerId },
    orderBy: { id: 'asc' },
    include: includeProduct
  });
}

export async function findById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: includeProduct
  });
}

/**
 * @param {object} data
 * @param {string} data.name
 * @param {number} data.price
 * @param {string|null|undefined} data.gender
 * @param {string|null|undefined} data.image
 * @param {number} data.categoryId
 * @param {number} data.sellerId
 * @param {{ sizeId: number, quantity: number }[]} data.stockLines
 */
export async function createProduct(data) {
  const { stockLines, ...rest } = data;
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: rest.name,
        price: rest.price,
        gender: rest.gender ?? null,
        image: rest.image ?? null,
        categoryId: rest.categoryId,
        sellerId: rest.sellerId,
        stock: {
          create: stockLines.map((l) => ({
            sizeId: l.sizeId,
            quantity: l.quantity
          }))
        }
      },
      include: includeProduct
    });
    return product;
  });
}

export async function updateProduct(id, data) {
  const { stockLines, ...rest } = data;
  return prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: rest.name,
        price: rest.price,
        gender: rest.gender === undefined ? undefined : rest.gender,
        image: rest.image === undefined ? undefined : rest.image,
        categoryId: rest.categoryId,
        sellerId: rest.sellerId
      }
    });
    await tx.stock.deleteMany({ where: { productId: id } });
    if (stockLines?.length) {
      await tx.stock.createMany({
        data: stockLines.map((l) => ({
          productId: id,
          sizeId: l.sizeId,
          quantity: l.quantity
        }))
      });
    }
    return tx.product.findUnique({
      where: { id },
      include: includeProduct
    });
  });
}

export async function deleteProduct(id) {
  await prisma.product.delete({ where: { id } });
}
