// ============================================================================
// The Center — Configuración principal de Express
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'node:path';

// ── Importación de rutas ────────────────────────────────────────────────────
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import sizeRoutes from './routes/size.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// ── Middlewares globales ────────────────────────────────────────────────────

/** Cabeceras HTTP seguras */
app.use(helmet());

/** Parseo de JSON y datos URL-encoded */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', (_req, res, next) => {
  // Permite que frontend en otro origen cargue imágenes estáticas.
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.resolve(process.cwd(), 'uploads')));

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
  message: { error: 'Demasiadas peticiones; debe esperarse antes de reintentar.' }
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

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ── Manejo de errores global ────────────────────────────────────────────────

/** Ruta no encontrada */
app.use((_req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use(errorHandler);

export default app;
