# Guía de Contribución - The Center E-commerce

## 🎯 Contexto del Proyecto
The Center es una plataforma de e-commerce de prendas de vestir con arquitectura separada (Backend Python + Frontend React).

## 📋 Orden de Desarrollo por PBIs

### ✅ PBI 1.0 - FUNDACIÓN (PRIORIDAD CRÍTICA)
**Dependencias**: Ninguna  
**Bloqueante para**: Todos los demás PBIs

- Estructura básica backend (Flask + SQLite)
- Estructura básica frontend (React + Vite)
- Comunicación backend-frontend funcional
- CORS configurado

### 🔐 PBI 1.1 - Autenticación
**Dependencias**: PBI 1.0  
**Bloqueante para**: PBI 1.3, PBI 1.6

- Registro de usuarios
- Login/Logout
- Roles básicos (admin/cliente)

### 🛍️ PBI 1.2 - Catálogo de Productos
**Dependencias**: PBI 1.0  
**Bloqueante para**: PBI 1.3

- Listado de productos
- Filtros básicos (categoría, precio, talla, género)
- Visualización de productos

### 🛒 PBI 1.3 - Carrito de Compras
**Dependencias**: PBI 1.1, PBI 1.2  
**Bloqueante para**: PBI 1.6

- Agregar/modificar/eliminar productos
- Cálculo de totales
- Persistencia del carrito

### 📱 PBI 1.4 - Diseño Responsive
**Dependencias**: PBI 1.0  
**Bloqueante para**: Ninguno (paralelo)

- Mobile first
- Tablet y desktop

### ⚙️ PBI 1.5 - Panel de Administración
**Dependencias**: PBI 1.1  
**Bloqueante para**: Ninguno

- CRUD de productos
- Gestión de inventario
- Gestión de precios

### 💳 PBI 1.6 - Procesamiento de Pedidos
**Dependencias**: PBI 1.1, PBI 1.3  
**Bloqueante para**: Ninguno

- Checkout
- Actualización automática de stock
- Historial de pedidos

## 🚨 Riesgos Críticos a Considerar

### 🔒 Seguridad
- **NUNCA** guardar contraseñas en texto plano (usar bcrypt)
- Validar todos los inputs del usuario
- Sanitizar datos antes de queries SQL

### ⚡ Rendimiento
- Optimizar imágenes de productos
- Implementar paginación en listados
- Caché de productos frecuentes

### 🔄 Sincronización
- El carrito debe validar stock en tiempo real
- Actualizar inventario tras cada compra
- Manejar concurrencia en compras

## 📝 Flujo de Trabajo Git

### Ramas
```
main (producción)
└── develop (integración)
    ├── feature/pbi-1.1-autenticacion
    ├── feature/pbi-1.2-catalogo
    └── fix/correccion-carrito
```

### Nomenclatura de Commits
```
feat(pbi-1.1): agregar endpoint de registro
fix(pbi-1.3): corregir cálculo de totales en carrito
docs: actualizar guía de instalación
refactor(pbi-1.2): optimizar queries de productos
```

### Pull Requests
- Título: `[PBI-X.X] Descripción breve`
- Descripción debe incluir:
  - ¿Qué problema resuelve?
  - ¿Cómo se probó?
  - Screenshots (si aplica)
  - Dependencias con otros PBIs

## ✅ Checklist antes de PR

- [ ] El código sigue los estándares definidos en CODING_STANDARDS.md
- [ ] Se agregaron comentarios donde el código es complejo
- [ ] No hay credenciales o datos sensibles en el código
- [ ] Se probó localmente la funcionalidad
- [ ] Se verificó que no rompe funcionalidades existentes
- [ ] El código es responsive (si aplica frontend)

## 🤝 Comunicación

- Usar issues de GitHub para reportar bugs
- Etiquetar issues según PBI correspondiente
- Documentar decisiones técnicas importantes en el código o issues

## 🆘 ¿Dudas?

Revisa los siguientes documentos:
- `DEVELOPMENT.md` - Setup y desarrollo local
- `CODING_STANDARDS.md` - Estándares de código
- `.github/COPILOT_INSTRUCTIONS.md` - Guía para IA

---
**Recuerda**: Siempre verifica las dependencias entre PBIs antes de empezar una nueva feature.