// ============================================================================
// The Center — Configuración principal de Express
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// ── Importación de rutas ────────────────────────────────────────────────────
// TODO: Importar rutas cuando se implementen
// import productRoutes from './routes/product.routes.js';
// import authRoutes from './routes/auth.routes.js';
// import cartRoutes from './routes/cart.routes.js';
// import orderRoutes from './routes/order.routes.js';
// import adminRoutes from './routes/admin.routes.js';

const app = express();

// ── Middlewares globales ────────────────────────────────────────────────────

/** Cabeceras HTTP seguras */
app.use(helmet());

/** Parseo de JSON y datos URL-encoded */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/** CORS — Orígenes permitidos desde variable de entorno */
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4200'],
  credentials: true
}));

/** Logging de peticiones HTTP */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/** Rate limiting global — protección contra abuso */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // máximo 100 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Intente más tarde.' }
});
app.use('/api/', limiter);

// ── Rutas de la API ─────────────────────────────────────────────────────────

/** Endpoint de salud */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    servicio: 'The Center API',
    timestamp: new Date().toISOString()
  });
});

// TODO: Registrar rutas cuando se implementen
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admin', adminRoutes);

// ── Manejo de errores global ────────────────────────────────────────────────

/** Ruta no encontrada */
app.use((_req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

/** Manejador de errores centralizado */
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message
  });
});

export default app;
