// ============================================================================
// The Center — Panel administrativo (métricas)
// ============================================================================
// Para administrador devuelve métricas globales; para vendedor, métricas
// acotadas a sus productos y pedidos relacionados.

import prisma from '../prisma/client.js';

const LOW_STOCK_THRESHOLD = 5;

export async function dashboard(req, res) {
  if (req.user.rol === 'vendedor') {
    const sellerId = req.user.id;

    const [detailLines, pendingOrders, lowStockLines] = await Promise.all([
      prisma.orderDetail.findMany({
        where: {
          product: { sellerId },
          order: { status: { not: 'cancelada' } }
        },
        select: { unitPrice: true, quantity: true }
      }),
      prisma.order.count({
        where: {
          status: 'pendiente',
          details: { some: { product: { sellerId } } }
        }
      }),
      prisma.stock.count({
        where: {
          quantity: { lt: LOW_STOCK_THRESHOLD },
          product: { sellerId }
        }
      })
    ]);

    let totalSales = 0;
    for (const row of detailLines) {
      totalSales += Number(row.unitPrice) * row.quantity;
    }

    return res.json({
      totalSales,
      lowStock: lowStockLines,
      pendingOrders,
      totalUsers: null,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
      sellerMode: true
    });
  }

  const [salesAgg, pendingOrders, totalUsers, lowStockLines] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'cancelada' } }
    }),
    prisma.order.count({ where: { status: 'pendiente' } }),
    prisma.user.count(),
    prisma.stock.count({
      where: { quantity: { lt: LOW_STOCK_THRESHOLD } }
    })
  ]);

  const totalSales = salesAgg._sum.total != null ? Number(salesAgg._sum.total) : 0;

  res.json({
    totalSales,
    lowStock: lowStockLines,
    pendingOrders,
    totalUsers,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    sellerMode: false
  });
}
