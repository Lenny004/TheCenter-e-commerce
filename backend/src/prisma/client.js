// ============================================================================
// The Center — Cliente Prisma (Singleton)
// Garantiza una única instancia de PrismaClient en toda la aplicación
// ============================================================================

import { PrismaClient } from '@prisma/client';

/** @type {PrismaClient} Instancia singleton del cliente Prisma */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
});

export default prisma;
