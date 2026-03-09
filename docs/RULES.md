# 📐 RULES.md — Reglas de Desarrollo de The Center

> Documento normativo que establece los estándares obligatorios de desarrollo para el proyecto **The Center**.
> Todo código que ingrese al repositorio debe cumplir al 100% con las reglas aquí definidas.

---

## Índice

1. [Regla 1 — Sintaxis JavaScript (ECMAScript vigente)](#regla-1--sintaxis-javascript-ecmascript-vigente)
2. [Regla 2 — Lógica de Programación JS](#regla-2--lógica-de-programación-js)
3. [Regla 3 — Estructuras de Datos JS](#regla-3--estructuras-de-datos-js)
4. [Regla 4 — Patrones de Diseño en JS](#regla-4--patrones-de-diseño-en-js)
5. [Regla 5 — Principios SOLID, POO, Encapsulación y Polimorfismo](#regla-5--principios-solid-poo-encapsulación-y-polimorfismo)
6. [Regla 6 — Redundancia, Determinismo y Aislamiento](#regla-6--redundancia-determinismo-y-aislamiento)
7. [Regla 7 — Patrones de Resiliencia ante Ciberataques](#regla-7--patrones-de-resiliencia-ante-ciberataques)
8. [Regla 8 — ISO/IEC 27001 y 27002](#regla-8--isoiec-27001-y-27002)

---

## Regla 1 — Sintaxis JavaScript (ECMAScript vigente)

> Alineado con el estándar **ECMA-262** (ECMAScript 2024) publicado por ECMA International.

### 1.1 Lexical Grammar

#### Tokens válidos

| Token | Definición | Ejemplo |
|-------|-----------|---------|
| **IdentifierName** | Secuencia de caracteres Unicode iniciando con `$`, `_` o letra | `precioTotal`, `_cache`, `$elemento` |
| **Keywords** | Palabras reservadas del lenguaje | `const`, `let`, `class`, `import`, `export`, `async`, `await` |
| **Literals** | Valores literales primitivos | `42`, `'texto'`, `true`, `null`, `undefined` |
| **TemplateLiteral** | Cadenas con interpolación usando backticks | `` `Precio: ${producto.precio}` `` |
| **Punctuator** | Símbolos de operación y delimitación | `{`, `}`, `(`, `)`, `=>`, `...`, `?.` |

#### WhiteSpace y LineTerminator

- Usar **2 espacios** como indentación (no tabuladores)
- Line Feed (`\n`) como terminador de línea obligatorio
- Archivos deben terminar con una línea vacía

#### Comment Grammar

```javascript
// Comentario de línea — para notas breves

/**
 * Comentario de bloque JSDoc — obligatorio para funciones exportadas
 * @param {string} nombre - Nombre del producto
 * @returns {Object} Producto creado
 */
```

#### NumericLiteral

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Decimal | Base 10 | `42`, `3.14` |
| Binary | Prefijo `0b` | `0b1010` |
| Octal | Prefijo `0o` | `0o52` |
| Hexadecimal | Prefijo `0x` | `0xFF` |
| BigInt | Sufijo `n` | `9007199254740991n` |

### 1.2 Syntactic Grammar

#### Expressions y AssignmentTargetType

```javascript
// ✅ CORRECTO — Destructuring assignment
const { nombre, precio } = producto;
const [primero, ...resto] = listaProductos;

// ✅ CORRECTO — Optional chaining y nullish coalescing
const ciudad = usuario?.direccion?.ciudad ?? 'Sin ciudad';

// ❌ INCORRECTO — No usar var
var precio = 100; // PROHIBIDO
```

#### Statements y Declarations

```javascript
// ✅ Usar const por defecto, let solo cuando se reasigne
const PRECIO_MAXIMO = 999.99;
let cantidadActual = 0;

// ✅ FunctionDeclaration para funciones con nombre
function calcularTotal(items) {
  return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

// ✅ ArrowFunction para callbacks y funciones anónimas
const productosActivos = productos.filter(p => p.stock > 0);

// ✅ ClassDeclaration para entidades con estado
class CarritoService {
  #items = [];

  agregarItem(producto) {
    this.#items.push(producto);
  }
}
```

#### Module Grammar

```javascript
// ✅ ImportDeclaration — imports explícitos
import express from 'express';
import { Router } from 'express';
import prisma from '../prisma/client.js';

// ✅ ExportDeclaration — exports con nombre o default
export default router;
export { calcularTotal, validarStock };
```

#### BindingPattern y Destructuring

```javascript
// ✅ Destructuring de parámetros
function crearProducto({ nombre, precio, categoriaId }) {
  // ...
}

// ✅ Destructuring con valores por defecto
const { pagina = 1, limite = 20 } = req.query;
```

#### FormalParameters

```javascript
// ✅ Parámetros con valores por defecto
function listarProductos(filtros = {}, pagina = 1, limite = 20) {
  // ...
}

// ✅ Rest parameters
function combinarFiltros(...filtros) {
  return Object.assign({}, ...filtros);
}
```

### 1.3 ASI (Automatic Semicolon Insertion)

> **Política del proyecto: usar punto y coma explícito en todas las sentencias.**

Reglas ASI según ECMA-262 §12.9:

1. Cuando el parser encuentra un token no permitido por la gramática y hay un LineTerminator antes de él
2. Al final de un archivo fuente
3. Antes de `}` que cierra un bloque

```javascript
// ✅ CORRECTO — Punto y coma explícito
const precio = 100;
const items = obtenerItems();

// ❌ INCORRECTO — Sin punto y coma (depender de ASI es riesgoso)
const precio = 100
const items = obtenerItems()
```

### 1.4 Early Errors

| Error | Descripción | Ejemplo |
|-------|-------------|---------|
| Duplicate lexical bindings | No declarar la misma variable dos veces en el mismo scope | `let x = 1; let x = 2;` ❌ |
| Invalid assignment targets | No asignar a expresiones no válidas | `1 = x;` ❌ |
| Illegal use of await/yield | Solo usar en contextos async/generator | `function f() { await x; }` ❌ |
| Strict mode violations | En módulos ES, strict mode es automático | `delete x;` (variable no cualificada) ❌ |
| Reserved words misuse | No usar palabras reservadas como identificadores | `const enum = 5;` ❌ |

### 1.5 Restricciones de Angular

- **Solo CSS nativo** — Ningún import de Tailwind, Bootstrap, Material UI u otro framework CSS es válido
- **HTML5 semántico** — Usar tags semánticos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **Standalone components** — Todos los componentes deben ser `standalone: true`

---

## Regla 2 — Lógica de Programación JS

### 2.1 Control de Flujo

```javascript
// ✅ Guard clauses para reducir anidación
function obtenerProducto(id) {
  if (!id) {
    throw new ApiError(400, 'ID de producto requerido');
  }

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    throw new ApiError(404, 'Producto no encontrado');
  }

  return producto;
}

// ❌ INCORRECTO — Anidación excesiva
function obtenerProducto(id) {
  if (id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
      return producto;
    } else {
      throw new Error('No encontrado');
    }
  } else {
    throw new Error('ID requerido');
  }
}
```

### 2.2 Manejo de Errores

```javascript
// ✅ OBLIGATORIO — try/catch en toda función asíncrona
async function crearProducto(datos) {
  try {
    const producto = await prisma.product.create({ data: datos });
    return producto;
  } catch (error) {
    console.error('[ProductService] Error al crear producto:', error.message);
    throw new ApiError(500, 'Error al crear el producto');
  }
}
```

### 2.3 Promesas y Async/Await

```javascript
// ✅ Preferir async/await sobre .then()/.catch()
async function procesarCheckout(userId) {
  try {
    const carrito = await obtenerCarrito(userId);
    const orden = await crearOrden(userId, carrito);
    await vaciarCarrito(userId);
    return orden;
  } catch (error) {
    throw new ApiError(500, 'Error al procesar el checkout');
  }
}

// ✅ Promise.all para operaciones independientes en paralelo
async function obtenerDashboard() {
  try {
    const [ventas, stockCritico, pedidosPendientes] = await Promise.all([
      calcularVentasTotales(),
      obtenerStockCritico(),
      contarPedidosPendientes()
    ]);
    return { ventas, stockCritico, pedidosPendientes };
  } catch (error) {
    throw new ApiError(500, 'Error al obtener métricas del dashboard');
  }
}
```

### 2.4 Inmutabilidad de Datos

```javascript
// ✅ No mutar objetos de entrada
function actualizarPrecio(producto, nuevoPrecio) {
  return { ...producto, precio: nuevoPrecio };
}

// ❌ INCORRECTO — Mutación directa
function actualizarPrecio(producto, nuevoPrecio) {
  producto.precio = nuevoPrecio; // Muta el original
  return producto;
}

// ✅ Usar métodos inmutables de Array
const productosActivos = productos.filter(p => p.activo);
const precios = productos.map(p => p.precio);
const total = precios.reduce((sum, p) => sum + p, 0);
```

### 2.5 Separación de Responsabilidades

```
Controller → Recibe la petición HTTP, valida parámetros, llama al servicio, responde
Service    → Contiene la lógica de negocio, interactúa con Prisma/BD
Middleware → Corta transversalmente (auth, validación, logging, errores)
Route      → Define mapeo de URL → Controller
```

Ningún controller debe acceder directamente a Prisma. Ningún servicio debe manejar `req`/`res`.

---

## Regla 3 — Estructuras de Datos JS

### 3.1 Estructuras Básicas

#### Array — Catálogo de productos en memoria

```javascript
// Filtrado eficiente del catálogo
const productosFemeninos = catalogo.filter(p => p.gender === 'femenino');
const nombresProductos = catalogo.map(p => p.name);
const existeProducto = catalogo.some(p => p.id === idBuscado);
```

#### Object — Configuración y entidades

```javascript
// Objeto de configuración centralizado
const CONFIG = Object.freeze({
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  MAX_CART_ITEMS: 50,
  STOCK_CRITICO: 5
});
```

#### Map — Caché de sesiones o búsquedas frecuentes

```javascript
// Caché de productos frecuentes
const cacheProductos = new Map();

function obtenerProductoConCache(id) {
  if (cacheProductos.has(id)) {
    return cacheProductos.get(id);
  }
  const producto = buscarEnBD(id);
  cacheProductos.set(id, producto);
  return producto;
}
```

#### Set — Eliminación de duplicados

```javascript
// Categorías únicas del catálogo
const categoriasUnicas = new Set(catalogo.map(p => p.category));
```

### 3.2 Estructuras Intermedias

#### Pila (Stack) — Historial de navegación del catálogo

```javascript
class HistorialNavegacion {
  #pila = [];

  agregar(pagina) {
    this.#pila.push(pagina);
  }

  retroceder() {
    return this.#pila.pop();
  }

  get actual() {
    return this.#pila[this.#pila.length - 1];
  }
}
```

#### Cola (Queue) — Procesamiento de pedidos

```javascript
class ColaPedidos {
  #cola = [];

  encolar(pedido) {
    this.#cola.push(pedido);
  }

  desencolar() {
    return this.#cola.shift();
  }

  get pendientes() {
    return this.#cola.length;
  }
}
```

#### Lista Enlazada — Cadena de middlewares

```javascript
class NodoMiddleware {
  constructor(handler) {
    this.handler = handler;
    this.siguiente = null;
  }
}

class CadenaMiddleware {
  #cabeza = null;

  agregar(handler) {
    const nodo = new NodoMiddleware(handler);
    if (!this.#cabeza) {
      this.#cabeza = nodo;
      return;
    }
    let actual = this.#cabeza;
    while (actual.siguiente) {
      actual = actual.siguiente;
    }
    actual.siguiente = nodo;
  }

  async ejecutar(req, res) {
    let actual = this.#cabeza;
    while (actual) {
      await actual.handler(req, res);
      actual = actual.siguiente;
    }
  }
}
```

### 3.3 Estructuras Avanzadas

#### Árbol — Categorías jerárquicas de productos

```javascript
class NodoCategoria {
  constructor(nombre) {
    this.nombre = nombre;
    this.hijos = [];
  }

  agregarSubcategoria(nombre) {
    const hijo = new NodoCategoria(nombre);
    this.hijos.push(hijo);
    return hijo;
  }

  buscar(nombre) {
    if (this.nombre === nombre) return this;
    for (const hijo of this.hijos) {
      const encontrado = hijo.buscar(nombre);
      if (encontrado) return encontrado;
    }
    return null;
  }
}

// Ejemplo: Ropa → Hombre → Camisetas, Pantalones
const raiz = new NodoCategoria('Ropa');
const hombre = raiz.agregarSubcategoria('Hombre');
hombre.agregarSubcategoria('Camisetas');
hombre.agregarSubcategoria('Pantalones');
```

#### HashMap personalizado — Índice de búsqueda rápida

```javascript
class IndiceProductos {
  #buckets = new Array(64).fill(null).map(() => []);

  #hash(clave) {
    let hash = 0;
    for (const char of String(clave)) {
      hash = (hash * 31 + char.charCodeAt(0)) % this.#buckets.length;
    }
    return hash;
  }

  insertar(clave, producto) {
    const indice = this.#hash(clave);
    const bucket = this.#buckets[indice];
    const existente = bucket.find(([k]) => k === clave);
    if (existente) {
      existente[1] = producto;
    } else {
      bucket.push([clave, producto]);
    }
  }

  buscar(clave) {
    const indice = this.#hash(clave);
    const par = this.#buckets[indice].find(([k]) => k === clave);
    return par ? par[1] : undefined;
  }
}
```

---

## Regla 4 — Patrones de Diseño en JS

### 4.1 Factory — Creación de respuestas HTTP estandarizadas

```javascript
/**
 * Fábrica de respuestas HTTP estandarizadas
 */
class RespuestaFactory {
  static exito(res, datos, mensaje = 'Operación exitosa', codigo = 200) {
    return res.status(codigo).json({
      exito: true,
      mensaje,
      datos,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, mensaje, codigo = 500) {
    return res.status(codigo).json({
      exito: false,
      mensaje,
      datos: null,
      timestamp: new Date().toISOString()
    });
  }

  static paginado(res, datos, total, pagina, limite) {
    return res.status(200).json({
      exito: true,
      datos,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
      }
    });
  }
}
```

### 4.2 Singleton — Cliente Prisma y configuración global

```javascript
// prisma/client.js — Singleton de PrismaClient
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma; // Siempre la misma instancia
```

### 4.3 Observer — Notificaciones de cambio de stock

```javascript
class EventoInventario {
  #suscriptores = new Map();

  suscribir(evento, callback) {
    if (!this.#suscriptores.has(evento)) {
      this.#suscriptores.set(evento, []);
    }
    this.#suscriptores.get(evento).push(callback);
  }

  notificar(evento, datos) {
    const callbacks = this.#suscriptores.get(evento) || [];
    callbacks.forEach(cb => cb(datos));
  }
}

// Uso: notificar cuando el stock baja del mínimo
const inventarioEventos = new EventoInventario();
inventarioEventos.suscribir('stock_critico', (producto) => {
  console.log(`⚠️ Stock crítico: ${producto.nombre} — ${producto.stock} unidades`);
});
```

### 4.4 Strategy — Estrategias de cálculo de precio

```javascript
// Diferentes estrategias de descuento
const estrategiasDescuento = {
  ninguno: (precio) => precio,
  porcentaje: (precio, valor) => precio * (1 - valor / 100),
  fijo: (precio, valor) => Math.max(0, precio - valor),
  dosXuno: (precio, cantidad) => cantidad >= 2 ? precio * Math.ceil(cantidad / 2) : precio * cantidad
};

function calcularPrecioFinal(producto, estrategia, valor) {
  const calcular = estrategiasDescuento[estrategia];
  if (!calcular) {
    throw new Error(`Estrategia de descuento desconocida: ${estrategia}`);
  }
  return calcular(producto.precio, valor);
}
```

### 4.5 Repository — Acceso a datos abstracción

```javascript
/**
 * Repositorio genérico — abstrae el acceso a Prisma
 */
class RepositorioBase {
  #modelo;

  constructor(modelo) {
    this.#modelo = modelo;
  }

  async buscarTodos(filtros = {}, opciones = {}) {
    return this.#modelo.findMany({ where: filtros, ...opciones });
  }

  async buscarPorId(id) {
    return this.#modelo.findUnique({ where: { id } });
  }

  async crear(datos) {
    return this.#modelo.create({ data: datos });
  }

  async actualizar(id, datos) {
    return this.#modelo.update({ where: { id }, data: datos });
  }

  async eliminar(id) {
    return this.#modelo.delete({ where: { id } });
  }
}
```

### 4.6 Decorator — Logging automático en servicios

```javascript
/**
 * Decorador de logging para funciones asíncronas
 */
function conLogging(nombreOperacion, fn) {
  return async function (...args) {
    const inicio = Date.now();
    console.log(`[${nombreOperacion}] Iniciando...`);
    try {
      const resultado = await fn.apply(this, args);
      console.log(`[${nombreOperacion}] Completado en ${Date.now() - inicio}ms`);
      return resultado;
    } catch (error) {
      console.error(`[${nombreOperacion}] Error en ${Date.now() - inicio}ms:`, error.message);
      throw error;
    }
  };
}

// Uso
const crearProductoConLog = conLogging('CrearProducto', crearProducto);
```

---

## Regla 5 — Principios SOLID, POO, Encapsulación y Polimorfismo

### 5.1 Single Responsibility Principle (SRP)

> Cada clase/módulo debe tener una sola razón para cambiar.

```javascript
// ❌ VIOLACIÓN — El controlador hace lógica de negocio y acceso a BD
class ProductController {
  async crear(req, res) {
    const datos = req.body;
    // Validación, lógica de negocio Y acceso a BD juntos
    if (datos.precio < 0) throw new Error('Precio inválido');
    const producto = await prisma.product.create({ data: datos });
    res.json(producto);
  }
}

// ✅ CUMPLIMIENTO — Cada capa tiene su responsabilidad
// Controller: maneja HTTP
// Service: lógica de negocio
// Prisma: acceso a datos
```

### 5.2 Open/Closed Principle (OCP)

> Abierto para extensión, cerrado para modificación.

```javascript
// ✅ Las estrategias de descuento se extienden sin modificar el código existente
// Para agregar un nuevo tipo de descuento, solo se agrega una nueva key al objeto
estrategiasDescuento.empleado = (precio) => precio * 0.7;
```

### 5.3 Liskov Substitution Principle (LSP)

> Las subclases deben poder sustituir a sus clases base sin alterar el comportamiento.

```javascript
// ✅ CUMPLIMIENTO
class Notificacion {
  enviar(mensaje) { throw new Error('Método abstracto'); }
}

class NotificacionEmail extends Notificacion {
  enviar(mensaje) {
    // Envía por email — cumple el contrato de enviar()
    return enviarEmail(mensaje);
  }
}

class NotificacionSMS extends Notificacion {
  enviar(mensaje) {
    // Envía por SMS — cumple el contrato de enviar()
    return enviarSMS(mensaje);
  }
}
```

### 5.4 Interface Segregation Principle (ISP)

> No obligar a implementar métodos que no se usan.

```javascript
// ❌ VIOLACIÓN — Interfaz "gorda"
// Un servicio que obliga a implementar métodos CRUD completos cuando solo se necesita lectura

// ✅ CUMPLIMIENTO — Servicios separados por responsabilidad
// productService.js → lectura del catálogo
// adminProductService.js → CRUD completo para admin
```

### 5.5 Dependency Inversion Principle (DIP)

> Depender de abstracciones, no de implementaciones concretas.

```javascript
// ✅ El servicio recibe la dependencia, no la crea internamente
class ProductService {
  #repositorio;

  constructor(repositorio) {
    this.#repositorio = repositorio;
  }

  async obtenerTodos(filtros) {
    return this.#repositorio.buscarTodos(filtros);
  }
}
```

### 5.6 Encapsulación con campos privados (#)

```javascript
class Carrito {
  #items = [];
  #userId;

  constructor(userId) {
    this.#userId = userId;
  }

  get total() {
    return this.#items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  get cantidadItems() {
    return this.#items.length;
  }

  agregarItem(producto, cantidad = 1) {
    const existente = this.#items.find(i => i.productoId === producto.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.#items.push({ productoId: producto.id, precio: producto.precio, cantidad });
    }
  }
}
```

### 5.7 Polimorfismo

```javascript
// Diferentes tipos de usuario con comportamiento polimórfico
class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
  }

  obtenerPermisos() {
    return ['ver_catalogo', 'comprar'];
  }
}

class Vendedor extends Usuario {
  obtenerPermisos() {
    return [...super.obtenerPermisos(), 'crear_producto', 'editar_producto'];
  }
}

class Admin extends Usuario {
  obtenerPermisos() {
    return [...super.obtenerPermisos(), 'gestionar_usuarios', 'ver_metricas', 'gestionar_pedidos'];
  }
}
```

---

## Regla 6 — Redundancia, Determinismo y Aislamiento

### 6.1 Funciones Puras

```javascript
// ✅ Función pura — mismo input, mismo output, sin efectos secundarios
function calcularSubtotal(precio, cantidad, descuento = 0) {
  return precio * cantidad * (1 - descuento / 100);
}

// ❌ IMPURA — depende de estado externo
let descuentoGlobal = 10;
function calcularSubtotal(precio, cantidad) {
  return precio * cantidad * (1 - descuentoGlobal / 100); // Depende de variable externa
}
```

### 6.2 Aislamiento de Efectos Secundarios

```javascript
// ✅ Los efectos secundarios (BD, API, logs) se aíslan en la capa de servicio
// Nunca mezclar lógica pura con I/O

// Capa pura (sin efectos)
function validarStock(stockActual, cantidadSolicitada) {
  return stockActual >= cantidadSolicitada;
}

// Capa con efectos (aislada)
async function procesarCompra(productoId, cantidad) {
  try {
    const stock = await obtenerStock(productoId);        // Efecto: BD
    if (!validarStock(stock.quantity, cantidad)) {         // Pura
      throw new ApiError(400, 'Stock insuficiente');
    }
    await actualizarStock(productoId, -cantidad);          // Efecto: BD
  } catch (error) {
    throw error;
  }
}
```

### 6.3 Idempotencia de Operaciones

```javascript
// ✅ Operación idempotente — ejecutarla N veces produce el mismo resultado
async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  try {
    // Si ya tiene el estado solicitado, no hace nada
    const pedido = await prisma.order.findUnique({ where: { id: pedidoId } });
    if (pedido.status === nuevoEstado) {
      return pedido; // Idempotente: no cambia nada
    }
    return await prisma.order.update({
      where: { id: pedidoId },
      data: { status: nuevoEstado }
    });
  } catch (error) {
    throw new ApiError(500, 'Error al actualizar estado del pedido');
  }
}
```

### 6.4 Redundancia de Datos Críticos

```javascript
// ✅ Guardar precio unitario en OrderDetail al momento de la compra
// Esto garantiza que si el precio del producto cambia, el histórico se preserva
async function crearDetalleOrden(ordenId, producto, cantidad) {
  try {
    return await prisma.orderDetail.create({
      data: {
        orderId: ordenId,
        productId: producto.id,
        quantity: cantidad,
        unitPrice: producto.price  // ← Redundancia intencional: precio congelado
      }
    });
  } catch (error) {
    throw new ApiError(500, 'Error al crear detalle de orden');
  }
}
```

---

## Regla 7 — Patrones de Resiliencia ante Ciberataques

> Ver documento detallado en [`docs/SECURITY_RULES.md`](SECURITY_RULES.md)

### Resumen de controles obligatorios:

1. **Sanitización de inputs** — XSS, SQL Injection, NoSQL Injection
2. **Autenticación JWT** — Access tokens + refresh tokens con rotación
3. **Rate limiting** — Limitar peticiones por IP/usuario (express-rate-limit)
4. **CORS estricto** — Solo orígenes explícitamente permitidos
5. **Helmet.js** — Cabeceras HTTP seguras
6. **Validación de esquemas** — Zod para validar todos los inputs
7. **Variables de entorno** — Nunca expuestas al cliente

---

## Regla 8 — ISO/IEC 27001 y 27002

> Ver documento detallado en [`docs/SECURITY_RULES.md`](SECURITY_RULES.md)

### Principios aplicables al proyecto:

| ISO/IEC | Sección | Aplicación en The Center |
|---------|---------|--------------------------|
| 27002 §9 | Control de acceso | Roles (cliente/vendedor/admin), JWT, guards en frontend |
| 27002 §8 | Gestión de activos | Inventario de datos sensibles, clasificación de información |
| 27002 §10 | Criptografía | Hashing de contraseñas (bcrypt), HTTPS obligatorio en producción |
| 27001 Cláusula 6.1 | Gestión de riesgos | Evaluación de riesgos de seguridad, plan de tratamiento |
| 27002 §16 | Gestión de incidentes | Logging de acciones administrativas, alertas de seguridad |
| 27002 §12 | Seguridad en operaciones | Rate limiting, monitoreo, backups de BD |

---

*Última actualización: Marzo 2026*
*Versión: 1.0.0*
