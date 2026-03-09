# 🔒 SECURITY_RULES.md — Reglas de Seguridad e ISO/IEC 27001/27002 para The Center

> Documento normativo de seguridad que establece los controles obligatorios para proteger
> la información de usuarios, transacciones y datos del negocio en la plataforma The Center.

---

## Índice

1. [Sanitización de Inputs](#1-sanitización-de-inputs)
2. [Autenticación JWT](#2-autenticación-jwt)
3. [Rate Limiting y Throttling](#3-rate-limiting-y-throttling)
4. [CORS Estricto](#4-cors-estricto)
5. [Helmet.js — Cabeceras HTTP Seguras](#5-helmetjs--cabeceras-http-seguras)
6. [Validación de Esquemas con Zod](#6-validación-de-esquemas-con-zod)
7. [Variables de Entorno](#7-variables-de-entorno)
8. [ISO/IEC 27001 — Sistema de Gestión de Seguridad de la Información](#8-isoiec-27001--sistema-de-gestión-de-seguridad-de-la-información)
9. [ISO/IEC 27002 — Controles de Seguridad Aplicados](#9-isoiec-27002--controles-de-seguridad-aplicados)

---

## 1. Sanitización de Inputs

### 1.1 Cross-Site Scripting (XSS)

**Amenaza:** Inyección de scripts maliciosos a través de inputs de usuario que se renderizan en el navegador.

**Controles obligatorios:**

```javascript
// ✅ Angular escapa automáticamente expresiones en templates
// {{ usuario.nombre }} → sanitizado por defecto

// ✅ Validar y limpiar inputs en el backend antes de almacenar
function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ✅ Helmet.js configura Content-Security-Policy automáticamente
// ✅ Usar HttpOnly en cookies de sesión para prevenir acceso desde JS
```

**Reglas:**
- Nunca usar `innerHTML` o `[innerHTML]` con datos de usuario sin sanitizar
- En Angular, usar `DomSanitizer` solo cuando sea estrictamente necesario
- Validar longitud máxima de todos los campos de texto
- Escapar caracteres HTML antes de almacenar en BD

### 1.2 SQL Injection

**Amenaza:** Inyección de código SQL a través de inputs para manipular consultas de base de datos.

**Controles obligatorios:**

```javascript
// ✅ Prisma usa consultas parametrizadas por defecto — INMUNE a SQL injection
const producto = await prisma.product.findMany({
  where: {
    name: { contains: terminoBusqueda },  // Parametrizado automáticamente
    categoryId: parseInt(categoriaId)      // Tipado fuerte
  }
});

// ❌ NUNCA construir queries SQL manualmente con concatenación
const query = `SELECT * FROM product WHERE name = '${nombre}'`;  // ❌ VULNERABLE

// ❌ NUNCA usar prisma.$queryRawUnsafe con inputs del usuario
await prisma.$queryRawUnsafe(`SELECT * FROM product WHERE name = '${nombre}'`);  // ❌

// ✅ Si se necesita raw query, usar parametrización
await prisma.$queryRaw`SELECT * FROM product WHERE name = ${nombre}`;  // ✅
```

### 1.3 NoSQL Injection

**Amenaza:** Aunque usamos PostgreSQL (SQL), si se integrara algún almacén NoSQL, aplicar las mismas reglas de parametrización.

**Control:** Validar y tipar todos los inputs antes de usarlos en queries. Nunca confiar en el contenido del `req.body` sin validación con Zod.

### 1.4 Validación de Tipos

```javascript
// ✅ OBLIGATORIO — Validar y convertir tipos antes de usar en queries
const id = parseInt(req.params.id, 10);
if (isNaN(id)) {
  throw new ApiError(400, 'ID inválido');
}

// ✅ Validar que arrays sean arrays, objetos sean objetos
if (!Array.isArray(req.body.items)) {
  throw new ApiError(400, 'Items debe ser un array');
}
```

---

## 2. Autenticación JWT

### 2.1 Estructura de Tokens

```
┌─────────────────────────────────────────────────────────────┐
│ Access Token                                                 │
│ ├── Payload: { userId, email, rol, iat, exp }               │
│ ├── Expiración: 24 horas (configurable via JWT_EXPIRES_IN)  │
│ └── Secreto: JWT_SECRET (variable de entorno)               │
│                                                              │
│ Refresh Token                                                │
│ ├── Payload: { userId, iat, exp }                           │
│ ├── Expiración: 7 días (configurable via JWT_REFRESH_EXPIRES│
│ └── Secreto: JWT_REFRESH_SECRET (variable de entorno)       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Autenticación

```
1. POST /api/auth/login → { email, password }
   ├── Validar credenciales contra BD (bcrypt.compare)
   ├── Generar access token + refresh token
   └── Retornar { accessToken, refreshToken, usuario }

2. Peticiones autenticadas → Header: Authorization: Bearer <accessToken>
   ├── Middleware verifica firma y expiración del token
   ├── Extrae userId y rol del payload
   └── Inyecta datos en req.user

3. POST /api/auth/refresh → { refreshToken }
   ├── Validar refresh token
   ├── Generar nuevo par de tokens (rotación)
   └── Invalidar refresh token anterior
```

### 2.3 Implementación de Referencia

```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ✅ Hashear contraseña con factor de costo adecuado (mínimo 10)
const SALT_ROUNDS = 12;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

// ✅ Generar tokens con información mínima necesaria
function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
}

// ✅ Middleware de verificación
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token de acceso requerido');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expirado');
    }
    throw new ApiError(401, 'Token inválido');
  }
}
```

### 2.4 Reglas de Seguridad JWT

| Regla | Descripción |
|-------|-------------|
| Secretos fuertes | Mínimo 256 bits de entropía para JWT_SECRET |
| No en localStorage | Almacenar access token en memoria (variable JS), no en localStorage |
| Refresh en HttpOnly cookie | Si es posible, enviar refresh token como cookie HttpOnly, Secure, SameSite=Strict |
| Rotación de tokens | Al usar refresh, generar nuevo par completo |
| Payload mínimo | Solo incluir datos necesarios (userId, rol) — nunca datos sensibles |
| No datos sensibles | Nunca incluir contraseña, datos de tarjeta, etc. en el token |

---

## 3. Rate Limiting y Throttling

### 3.1 Configuración Global

```javascript
import rateLimit from 'express-rate-limit';

// ✅ Rate limit global para todas las rutas de la API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                    // 100 peticiones por ventana
  standardHeaders: true,       // Incluir headers RateLimit-*
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Intente más tarde.' }
});

app.use('/api/', globalLimiter);
```

### 3.2 Rate Limit Específico para Autenticación

```javascript
// ✅ Más restrictivo para rutas de autenticación (prevenir brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 10,                     // Solo 10 intentos de login por ventana
  message: { error: 'Demasiados intentos de inicio de sesión. Espere 15 minutos.' },
  skipSuccessfulRequests: true  // No contar intentos exitosos
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 3.3 Rate Limit para Operaciones Sensibles

```javascript
// ✅ Limitar operaciones de escritura del admin
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minuto
  max: 30,               // 30 operaciones por minuto
  message: { error: 'Límite de operaciones administrativas alcanzado.' }
});

app.use('/api/admin', adminLimiter);
```

---

## 4. CORS Estricto

### 4.1 Configuración

```javascript
import cors from 'cors';

// ✅ CORS con orígenes explícitos — NUNCA usar origin: '*' en producción
const corsOptions = {
  origin: (origin, callback) => {
    const origenesPermitidos = (process.env.CORS_ORIGIN || 'http://localhost:4200').split(',');

    // Permitir peticiones sin origin (herramientas de desarrollo, curl, etc.)
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,              // Permitir cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400                    // Cachear preflight por 24 horas
};

app.use(cors(corsOptions));
```

### 4.2 Reglas CORS

| Regla | Descripción |
|-------|-------------|
| Orígenes explícitos | Listar cada dominio permitido, nunca `*` |
| Credentials | Solo habilitar si se usan cookies o Authorization headers |
| Métodos | Limitar a los métodos HTTP realmente usados |
| Headers | Limitar a los headers necesarios |
| Preflight cache | Cachear respuestas OPTIONS para reducir latencia |

---

## 5. Helmet.js — Cabeceras HTTP Seguras

### 5.1 Configuración

```javascript
import helmet from 'helmet';

// ✅ Helmet configura múltiples cabeceras de seguridad
app.use(helmet());

// Las cabeceras que Helmet establece:
// Content-Security-Policy         → Previene XSS y data injection
// X-Content-Type-Options: nosniff → Previene MIME type sniffing
// X-Frame-Options: DENY           → Previene clickjacking
// X-XSS-Protection: 0             → Desactiva filtro XSS legacy del navegador
// Strict-Transport-Security       → Fuerza HTTPS
// Referrer-Policy                 → Controla información en el header Referer
// X-DNS-Prefetch-Control          → Controla DNS prefetching
// X-Download-Options              → Previene descargas automáticas (IE)
// X-Permitted-Cross-Domain-Policies → Controla Flash/PDF cross-domain
```

### 5.2 CSP Personalizado (si es necesario)

```javascript
// ✅ Content Security Policy personalizada para permitir fuentes de Google
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  }
}));
```

---

## 6. Validación de Esquemas con Zod

### 6.1 Esquemas de Validación

```javascript
import { z } from 'zod';

// ✅ Esquema de registro de usuario
const registroSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  email: z.string()
    .email('Email inválido')
    .max(150)
    .toLowerCase()
    .trim(),
  phone: z.string()
    .max(20)
    .optional()
    .nullable(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede exceder 72 caracteres')  // Límite de bcrypt
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
});

// ✅ Esquema de producto
const productoSchema = z.object({
  name: z.string().min(1).max(150).trim(),
  price: z.number().positive('El precio debe ser mayor a 0').max(999999.99),
  gender: z.enum(['masculino', 'femenino', 'unisex']).optional(),
  categoryId: z.number().int().positive(),
  image: z.string().url().optional().nullable(),
  stock: z.array(z.object({
    sizeId: z.number().int().positive(),
    quantity: z.number().int().min(0, 'La cantidad no puede ser negativa')
  })).optional()
});

// ✅ Esquema de item del carrito
const carritoItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive('La cantidad debe ser al menos 1').max(99)
});
```

### 6.2 Middleware de Validación

```javascript
// ✅ Usar el middleware validate definido en middlewares/validate.middleware.js
// router.post('/register', validate(registroSchema), authController.register);
// router.post('/products', validate(productoSchema), productController.create);
```

### 6.3 Reglas de Validación

| Regla | Descripción |
|-------|-------------|
| Validar todo input | Todo req.body, req.query y req.params debe pasar por Zod |
| Tipos estrictos | Usar transformaciones (`trim()`, `toLowerCase()`) en el esquema |
| Mensajes en español | Todos los mensajes de error de validación en español |
| Límites de longitud | Establecer min/max en todos los campos de texto |
| Enums | Usar `z.enum()` para campos con valores predefinidos |

---

## 7. Variables de Entorno

### 7.1 Reglas Obligatorias

| Regla | Descripción |
|-------|-------------|
| Nunca en el código | Variables sensibles NUNCA hardcodeadas en archivos fuente |
| `.env` en `.gitignore` | El archivo `.env` NUNCA debe subirse al repositorio |
| `.env.example` | Siempre mantener un archivo de ejemplo con nombres de variables (sin valores reales) |
| Validar al inicio | Verificar que todas las variables requeridas existan al arrancar el servidor |
| No exponer al cliente | El frontend NUNCA debe tener acceso directo a variables de entorno del backend |

### 7.2 Validación de Variables al Inicio

```javascript
// ✅ Verificar variables de entorno requeridas antes de iniciar
const VARIABLES_REQUERIDAS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

function validarEntorno() {
  const faltantes = VARIABLES_REQUERIDAS.filter(v => !process.env[v]);
  if (faltantes.length > 0) {
    console.error(`❌ Variables de entorno faltantes: ${faltantes.join(', ')}`);
    process.exit(1);
  }
}

validarEntorno();
```

### 7.3 Clasificación de Variables

```
PÚBLICA      → CORS_ORIGIN, PORT, NODE_ENV
CONFIDENCIAL → DATABASE_URL (contiene credenciales de BD)
SECRETA      → JWT_SECRET, JWT_REFRESH_SECRET
```

---

## 8. ISO/IEC 27001 — Sistema de Gestión de Seguridad de la Información

### 8.1 Cláusula 6.1 — Gestión de Riesgos

**Evaluación de riesgos identificados para The Center:**

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Robo de credenciales de usuario | Alta | Crítico | Hashing bcrypt (12 rounds), JWT con expiración corta |
| Inyección SQL | Media | Crítico | Prisma ORM (queries parametrizadas), validación Zod |
| XSS en catálogo | Media | Alto | Angular escaping, Helmet CSP, sanitización backend |
| Fuerza bruta en login | Alta | Alto | Rate limiting (10 intentos/15min), bloqueo temporal |
| Exposición de datos sensibles | Media | Crítico | Variables de entorno, .gitignore, no logs de secretos |
| CSRF | Baja | Alto | CORS estricto, tokens en headers (no cookies) |
| Denegación de servicio (DoS) | Media | Alto | Rate limiting global, Docker resource limits |

### 8.2 Cláusula 7.2 — Competencia

- Todo desarrollador debe leer este documento antes de contribuir
- Las revisiones de código (PR) deben verificar cumplimiento de seguridad
- Los secretos comprometidos requieren rotación inmediata

### 8.3 Cláusula 9.1 — Monitoreo y Medición

```javascript
// ✅ Logging de acciones administrativas
// Toda operación CRUD en el panel admin debe registrar:
// - Quién (userId, email, rol)
// - Qué (acción: crear/actualizar/eliminar)
// - Cuándo (timestamp ISO 8601)
// - Sobre qué recurso (entityType, entityId)

function logAccionAdmin(usuario, accion, recurso) {
  const entrada = {
    timestamp: new Date().toISOString(),
    userId: usuario.id,
    email: usuario.email,
    accion,
    recurso,
    ip: usuario.ip || 'desconocida'
  };
  console.log('[AUDIT]', JSON.stringify(entrada));
  // TODO: Persistir en BD o servicio de logging externo
}
```

---

## 9. ISO/IEC 27002 — Controles de Seguridad Aplicados

### 9.1 §8 — Gestión de Activos de Información

#### Inventario de activos de información

| Activo | Clasificación | Ubicación | Responsable |
|--------|--------------|-----------|-------------|
| Credenciales de usuarios (email, password hash) | Confidencial | PostgreSQL — tabla `user` | Backend team |
| Datos de pedidos y transacciones | Interno | PostgreSQL — tablas `order`, `order_detail` | Backend team |
| Tokens JWT (access + refresh) | Secreto | Memoria del cliente / BD para blacklist | Backend team |
| Imágenes de productos | Público | Almacenamiento externo / CDN | Frontend team |
| Variables de entorno (.env) | Secreto | Servidor / CI-CD secrets | DevOps |
| Código fuente | Interno | Repositorio Git (privado) | Todo el equipo |

#### Clasificación de datos

```
PÚBLICO       → Catálogo de productos, categorías, tallas
INTERNO       → Historial de pedidos, métricas del dashboard
CONFIDENCIAL  → Email, teléfono, direcciones de usuarios
SECRETO       → Contraseñas (hash), tokens JWT, claves de cifrado
```

### 9.2 §9 — Control de Acceso

#### Matriz de control de acceso por rol

| Recurso | Cliente | Vendedor | Admin |
|---------|---------|----------|-------|
| Ver catálogo | ✅ | ✅ | ✅ |
| Ver detalle de producto | ✅ | ✅ | ✅ |
| Agregar al carrito | ✅ | ✅ | ✅ |
| Ver su carrito | ✅ | ✅ | ✅ |
| Realizar compra (checkout) | ✅ | ✅ | ✅ |
| Ver sus pedidos | ✅ | ✅ | ✅ |
| Crear producto | ❌ | ✅ | ✅ |
| Editar producto propio | ❌ | ✅ | ✅ |
| Eliminar producto | ❌ | ❌ | ✅ |
| Ver todos los pedidos | ❌ | ❌ | ✅ |
| Cambiar estado de pedido | ❌ | ❌ | ✅ |
| Ver dashboard admin | ❌ | ❌ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |

#### Implementación en el backend

```javascript
// ✅ Middleware de autorización por rol
function authorize(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'No autenticado');
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      throw new ApiError(403, 'No tiene permisos para esta acción');
    }
    next();
  };
}

// Uso en rutas
router.delete('/products/:id', authenticate, authorize(['admin']), productController.remove);
router.get('/admin/dashboard', authenticate, authorize(['admin']), adminController.dashboard);
```

#### Implementación en el frontend (Guards)

```typescript
// ✅ Guard de autenticación
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

// ✅ Guard de rol admin
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getUserRole() === 'admin') {
    return true;
  }
  return router.createUrlTree(['/']);
};
```

### 9.3 §10 — Criptografía

#### Datos en reposo

| Dato | Método | Configuración |
|------|--------|--------------|
| Contraseñas | bcrypt | Salt rounds: 12 |
| Tokens JWT | HMAC-SHA256 | Clave ≥ 256 bits |
| BD (producción) | Cifrado de disco | PostgreSQL con encryption at rest |

#### Datos en tránsito

| Canal | Protocolo | Requisito |
|-------|-----------|-----------|
| API ↔ Frontend | HTTPS (TLS 1.2+) | Obligatorio en producción |
| API ↔ BD | SSL/TLS | Parámetro `sslmode=require` en DATABASE_URL |
| Frontend ↔ Usuario | HTTPS | Strict-Transport-Security via Helmet |

```javascript
// ✅ bcrypt para hashing de contraseñas (NUNCA MD5, SHA-1 o SHA-256 para passwords)
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;  // Factor de costo: 2^12 = 4096 iteraciones

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// ✅ Comparación segura (timing-safe internamente en bcrypt)
async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
```

### 9.4 §12 — Seguridad en las Operaciones

#### Logging

```javascript
// ✅ Logging estructurado para trazabilidad
// Niveles: ERROR, WARN, INFO, DEBUG

// morgan para HTTP requests
app.use(morgan('combined'));  // Producción: IP, método, URL, status, user-agent

// Logging personalizado para operaciones del negocio
function logOperacion(nivel, contexto, mensaje, datos = {}) {
  const entrada = {
    timestamp: new Date().toISOString(),
    nivel,
    contexto,
    mensaje,
    ...datos
  };
  console.log(JSON.stringify(entrada));
}
```

#### Lo que NUNCA debe aparecer en logs

```javascript
// ❌ NUNCA loguear:
// - Contraseñas (ni en texto plano ni hasheadas)
// - Tokens JWT completos
// - Números de tarjeta de crédito
// - Claves de API o secretos

// ✅ Loguear de forma segura:
logOperacion('INFO', 'Auth', 'Login exitoso', { userId: 42, email: 'u***@email.com' });
logOperacion('WARN', 'Auth', 'Login fallido', { email: 'u***@email.com', intentos: 3 });
```

### 9.5 §16 — Gestión de Incidentes de Seguridad

#### Tipos de incidentes y respuesta

| Incidente | Acción Inmediata | Acción Correctiva |
|-----------|-----------------|-------------------|
| Credenciales comprometidas | Revocar tokens, forzar cambio de contraseña | Rotación de JWT_SECRET, notificar usuarios afectados |
| Vulnerabilidad en dependencia | Actualizar paquete, evaluar impacto | Auditoría `npm audit`, actualizar lockfile |
| Acceso no autorizado a BD | Revocar credenciales de BD, auditar logs | Cambiar contraseña BD, revisar permisos |
| Ataque de fuerza bruta | Rate limiting activado automáticamente | Revisar logs, considerar CAPTCHA |
| Exposición de datos en logs | Purgar logs afectados | Revisar y corregir logging code |

#### Escalamiento

```
Nivel 1 (Bajo)    → Intento de acceso fallido → Monitoreo
Nivel 2 (Medio)   → Múltiples intentos fallidos → Alerta al equipo
Nivel 3 (Alto)    → Acceso no autorizado detectado → Respuesta inmediata
Nivel 4 (Crítico) → Exfiltración de datos confirmada → Incidente formal, notificación legal
```

---

## Checklist de Seguridad para Pull Requests

Antes de aprobar cualquier PR, verificar:

- [ ] No hay secretos hardcodeados en el código
- [ ] Todos los inputs de usuario se validan con Zod
- [ ] Las funciones asíncronas tienen try/catch
- [ ] Las rutas sensibles tienen middleware de autenticación
- [ ] Las rutas de admin tienen middleware de autorización
- [ ] No se importan frameworks CSS externos
- [ ] Los queries a BD usan Prisma ORM (no raw SQL con concatenación)
- [ ] Los logs no contienen datos sensibles
- [ ] Las variables de entorno se acceden via `process.env`
- [ ] Los errores en producción no exponen stack traces al cliente

---

*Última actualización: Marzo 2026*
*Referencias: ISO/IEC 27001:2022, ISO/IEC 27002:2022, OWASP Top 10 2021*
