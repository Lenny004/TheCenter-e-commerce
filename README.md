# 🏪 The Center — Plataforma E-commerce de Ropa

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/Licencia-Apache%202.0-blue)

---

## 📋 Descripción

**The Center** es una plataforma de comercio electrónico especializada en la venta de ropa. Permite a los usuarios explorar un catálogo de productos, filtrar por talla/género/categoría, gestionar un carrito de compras dinámico y realizar pedidos. Los administradores cuentan con un panel completo para gestionar inventario, pedidos y métricas del negocio.

### Propósito de Negocio

Proporcionar a comercios de ropa una solución web completa, segura y escalable para vender sus productos en línea, con gestión integral de catálogo, inventario, usuarios y transacciones.

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | Node.js + Express |
| **ORM** | Prisma |
| **Base de datos** | PostgreSQL 16 |
| **Frontend** | Angular 19 (standalone components) |
| **Estilos** | CSS nativo + HTML5 (cero frameworks CSS externos) |
| **Autenticación** | JWT (access + refresh tokens) |
| **Validación** | Zod |
| **Seguridad** | Helmet.js, CORS, Rate Limiting |

---

## 📁 Estructura del Proyecto

```
the-center/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Controladores de la API REST
│   │   ├── routes/            # Definición de rutas Express
│   │   ├── services/          # Lógica de negocio
│   │   ├── middlewares/       # Auth, validación, manejo de errores
│   │   ├── prisma/            # Schema y cliente Prisma
│   │   └── app.js             # Configuración de Express
│   ├── server.js              # Punto de entrada del servidor
│   ├── .env.example           # Variables de entorno de ejemplo
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Componentes reutilizables
│   │   │   ├── pages/         # Páginas de la aplicación
│   │   │   ├── services/      # Servicios Angular (API calls)
│   │   │   └── guards/        # Guards de rutas (auth, admin)
│   │   ├── assets/            # Recursos estáticos
│   │   └── styles.css         # Estilos globales (CSS nativo)
│   ├── angular.json
│   ├── proxy.conf.json        # Proxy para desarrollo (→ backend)
│   └── package.json
├── docs/
│   ├── RULES.md               # Reglas de desarrollo y estándares
│   ├── SYNTAX_RULES.md        # Reglas de sintaxis ECMAScript
│   └── SECURITY_RULES.md      # Reglas de seguridad y ISO 27001/27002
├── docker-compose.yml         # Orquestación Docker
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 16 (o Docker)
- **npm** >= 9.0.0
- **Angular CLI** >= 19.0.0

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/the-center.git
cd the-center
```

### 2. Configurar la base de datos

#### Opción A — Docker (recomendado)

```bash
docker-compose up -d db
```

#### Opción B — PostgreSQL local

Crear la base de datos `the_center` en tu instancia PostgreSQL.

### 3. Configurar el Backend

```bash
cd backend
cp .env.example .env          # Editar con tus credenciales
npm install
npx prisma generate           # Generar cliente Prisma
npx prisma migrate dev         # Aplicar migraciones
npm run dev                    # Servidor en http://localhost:5000
```

### 4. Configurar el Frontend

```bash
cd frontend
npm install
npm start                      # App en http://localhost:4200
```

---

## ⚙️ Variables de Entorno

Copiar `backend/.env.example` a `backend/.env` y configurar:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://postgres:postgres@localhost:5432/the_center` |
| `PORT` | Puerto del servidor backend | `5000` |
| `JWT_SECRET` | Clave secreta para access tokens | (cadena segura aleatoria) |
| `JWT_EXPIRES_IN` | Expiración del access token | `24h` |
| `JWT_REFRESH_SECRET` | Clave para refresh tokens | (cadena segura aleatoria) |
| `JWT_REFRESH_EXPIRES_IN` | Expiración del refresh token | `7d` |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |
| `CORS_ORIGIN` | Orígenes permitidos (separados por coma) | `http://localhost:4200` |

---

## 📦 Módulos del Sistema

### Catálogo de Productos
- Productos con atributos: nombre, precio, imagen, talla, género, tipo de prenda, stock
- Filtrado dinámico por talla, género y categoría
- Relaciones: Producto → Categoría → Talla (vía Stock)

### Carrito de Compras
- Agregar/eliminar/actualizar cantidades en tiempo real
- Persistencia en base de datos (usuario autenticado) o localStorage (invitado)
- Conversión del carrito a orden de compra

### Panel de Administración
- CRUD completo de productos e inventario
- Visualización de pedidos y transacciones
- Dashboard con métricas: ventas totales, stock crítico, pedidos pendientes

### Autenticación y Seguridad
- Registro e inicio de sesión con JWT
- Roles: cliente, vendedor, admin
- Protección de rutas por rol

---

## 🗃️ Modelo de Datos

El esquema de base de datos incluye las siguientes entidades:

- **User** — Usuarios del sistema (cliente, vendedor, admin)
- **Category** — Categorías de productos
- **Size** — Tallas disponibles
- **Product** — Catálogo de productos
- **Stock** — Stock por producto y talla
- **ShoppingCart** — Carrito de compras por usuario
- **Order** — Órdenes de compra
- **OrderDetail** — Detalle de cada orden

---

## 🤝 Contribución

1. Hacer fork del repositorio
2. Crear una rama descriptiva: `git checkout -b feature/nombre-feature`
3. Realizar cambios siguiendo las reglas en `docs/RULES.md`
4. Hacer commit siguiendo **Conventional Commits**:
   - `feat:` — Nueva funcionalidad
   - `fix:` — Corrección de bug
   - `docs:` — Cambios en documentación
   - `style:` — Cambios de formato (no afectan lógica)
   - `refactor:` — Refactorización de código
   - `test:` — Agregar o modificar tests
   - `chore:` — Tareas de mantenimiento
5. Hacer push y crear un Pull Request

### Ejemplo de commit:
```
feat(products): agregar filtrado por género en catálogo
fix(cart): corregir cálculo de total al actualizar cantidad
docs(readme): actualizar instrucciones de instalación
```

---

## 📄 Licencia

Este proyecto está licenciado bajo **Apache License 2.0**. Ver [LICENSE](LICENSE) para más detalles.

---

## 📚 Documentación Adicional

- [Reglas de Desarrollo](docs/RULES.md)
- [Reglas de Sintaxis ECMAScript](docs/SYNTAX_RULES.md)
- [Reglas de Seguridad e ISO 27001/27002](docs/SECURITY_RULES.md)
