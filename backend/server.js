// ============================================================================
// The Center — Punto de entrada principal del servidor
// ============================================================================

import 'dotenv/config';
import app from './src/app.js';
import prisma from './src/prisma/client.js';

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim() === '') {
    console.error('');
    console.error('[The Center] ERROR: JWT_SECRET no está definida.');
    console.error('        Copie backend/.env.example a backend/.env y asigne JWT_SECRET.');
    console.error('');
    process.exit(1);
  }

  try {
    await prisma.$connect();
    console.log('[The Center] Conexión a la base de datos: OK');
  } catch (err) {
    console.error('');
    console.error('[The Center] ERROR: No se pudo conectar a PostgreSQL.');
    console.error('        Revise DATABASE_URL en backend/.env (usuario, contraseña, host, puerto, nombre de BD).');
    console.error('        Si usa Docker: docker compose up -d db');
    console.error('        Detalle:', err.message);
    console.error('');
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`[The Center] API en http://localhost:${PORT}`);
    console.log(`[The Center] Entorno: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error('');
      console.error(`[The Center] ERROR: El puerto ${PORT} ya está en uso.`);
      console.error('        Cierre el otro proceso (p. ej. otra instancia del servidor) o defina otro PORT en .env.');
      console.error('');
      process.exit(1);
    }
    throw err;
  });
}

start().catch((err) => {
  console.error('[The Center] Error al arrancar:', err);
  process.exit(1);
});
