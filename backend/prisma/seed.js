// ============================================================================
// Seed — Tallas y categorías iniciales (moda / ropa)
// Ejecutar: npm run prisma:seed  o  npx prisma db seed
// Idempotente: no duplica filas si el nombre ya existe.
// ============================================================================

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Categorías de ropa para el catálogo (The Center — moda). */
const CATEGORIAS_ROPA = [
  'Camisetas y tops',
  'Pantalones y jeans',
  'Vestidos',
  'Faldas',
  'Shorts y bermudas',
  'Sudaderas y hoodies',
  'Chaquetas y abrigos',
  'Ropa deportiva',
  'Pijamas y ropa de estar en casa',
  'Accesorios de moda'
];

/**
 * Tallas habituales en ropa (alfabéticas + talla única).
 * Incluye tallas numéricas EU frecuentes en pantalones / denim.
 */
const TALLAS_ROPA = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '3XL',
  'Talla única',
  '36',
  '38',
  '40',
  '42',
  '44',
  '46'
];

async function seedCategories() {
  let created = 0;
  let skipped = 0;
  for (const name of CATEGORIAS_ROPA) {
    const exists = await prisma.category.findFirst({ where: { name } });
    if (exists) {
      skipped += 1;
      continue;
    }
    await prisma.category.create({ data: { name } });
    created += 1;
  }
  console.log(`[seed] Categorías: ${created} creadas, ${skipped} ya existían.`);
}

async function seedSizes() {
  let created = 0;
  let skipped = 0;
  for (const size of TALLAS_ROPA) {
    const exists = await prisma.size.findFirst({ where: { size } });
    if (exists) {
      skipped += 1;
      continue;
    }
    await prisma.size.create({ data: { size } });
    created += 1;
  }
  console.log(`[seed] Tallas: ${created} creadas, ${skipped} ya existían.`);
}

async function main() {
  console.log('[seed] Iniciando datos iniciales (ropa)…');
  await seedCategories();
  await seedSizes();
  console.log('[seed] Listo.');
}

main()
  .catch((e) => {
    console.error('[seed] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
