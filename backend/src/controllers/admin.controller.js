// ============================================================================
// The Center — Panel administrativo (métricas)
// ============================================================================

import prisma from '../prisma/client.js';

const LOW_STOCK_THRESHOLD = 5;

export async function dashboard(_req, res) {
  const [
    salesAgg,
    pendingOrders,
    totalUsers,
    lowStockLines
  ] = await Promise.all([
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
    lowStockThreshold: LOW_STOCK_THRESHOLD
  });
}
