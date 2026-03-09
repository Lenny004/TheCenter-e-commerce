# 📝 SYNTAX_RULES.md — Reglas de Sintaxis ECMAScript para The Center

> Validador formal alineado al estándar ECMAScript (ECMA-262, edición 2024) publicado por ECMA International.
> Este documento sirve como referencia canónica para toda revisión de código del proyecto.

---

## 1. Gramática Léxica (Lexical Grammar)

### 1.1 Identificadores (IdentifierName)

Según ECMA-262 §12.6, un IdentifierName es una secuencia de `IdentifierStart` seguida de cero o más `IdentifierPart`.

**Reglas del proyecto:**

| Contexto | Convención | Ejemplo |
|----------|-----------|---------|
| Variables y funciones | `camelCase` | `precioTotal`, `obtenerProductos()` |
| Clases | `PascalCase` | `ProductService`, `CarritoController` |
| Constantes | `UPPER_SNAKE_CASE` | `MAX_ITEMS_CARRITO`, `STOCK_CRITICO` |
| Archivos | `kebab-case` | `product.service.js`, `auth.middleware.js` |
| Campos privados | Prefijo `#` | `#items`, `#userId` |
| Parámetros no usados | Prefijo `_` | `(_req, res)`, `(err, _req, res, _next)` |

**Caracteres iniciales válidos:** `$`, `_`, letras Unicode (A-Z, a-z, y equivalentes Unicode).

```javascript
// ✅ Válidos
const precioTotal = 100;
const _interno = 'privado';
const $elemento = document.getElementById('app');

// ❌ Inválidos
const 1variable = 10;    // No puede iniciar con número
const mi-variable = 10;  // El guion no es válido en identificadores
```

### 1.2 Palabras Reservadas (Keywords)

Según ECMA-262 §12.7, las siguientes palabras están reservadas y **NO deben usarse como identificadores**:

```
await    break     case      catch    class      const
continue debugger  default   delete   do         else
enum     export    extends   false    finally    for
function if        import    in       instanceof let
new      null      return    super    switch     this
throw    true      try       typeof   undefined  var
void     while     with      yield
```

**Palabras reservadas futuras (strict mode):** `implements`, `interface`, `package`, `private`, `protected`, `public`, `static`.

### 1.3 Literales (Literals)

#### String Literals

```javascript
// ✅ Preferir comillas simples para strings simples
const nombre = 'Camiseta Premium';

// ✅ Template literals para interpolación
const mensaje = `Producto: ${nombre} — Precio: $${precio}`;

// ✅ Template literals para strings multilínea
const query = `
  SELECT * FROM product
  WHERE category_id = ${categoriaId}
  AND gender = '${genero}'
`;

// ❌ No usar comillas dobles (convención del proyecto)
const nombre = "Camiseta";  // Usar comillas simples
```

#### Numeric Literals (ECMA-262 §12.9.3)

```javascript
// Decimal
const precio = 29.99;
const cantidad = 42;

// Separador numérico (ES2021+)
const precioAlto = 1_000_000.00;

// Binary (0b)
const permisos = 0b1010;  // 10 en decimal

// Octal (0o)
const modoArchivo = 0o755;

// Hexadecimal (0x)
const colorAccent = 0xE63946;

// BigInt (sufijo n)
const idGrande = 9007199254740991n;
```

#### Boolean y especiales

```javascript
const activo = true;
const eliminado = false;
const vacio = null;
const sinDefinir = undefined;
```

### 1.4 Puntuadores (Punctuators)

```javascript
// Spread/Rest operator (...)
const copia = { ...producto, precio: nuevoPrecio };
const [primero, ...resto] = productos;

// Optional chaining (?.)
const ciudad = usuario?.direccion?.ciudad;

// Nullish coalescing (??)
const limite = req.query.limit ?? 20;

// Logical assignment (&&=, ||=, ??=)
opciones.pagina ??= 1;

// Arrow function (=>)
const cuadrado = (x) => x * x;
```

### 1.5 Espacios en Blanco y Terminadores de Línea

| Regla | Especificación |
|-------|---------------|
| Indentación | 2 espacios (no tabs) |
| Terminador de línea | LF (`\n`) — nunca CRLF |
| Línea final | Todo archivo termina con línea vacía |
| Longitud máxima de línea | 100 caracteres (preferente), 120 máximo |
| Líneas en blanco | Máximo 1 entre bloques lógicos |

### 1.6 Gramática de Comentarios

```javascript
// ── Comentario de sección ────────────────────────────────────
// Usar para separar secciones lógicas dentro de un archivo

// Comentario de línea — explicación breve
const resultado = calcularTotal(items);

/**
 * Comentario JSDoc — OBLIGATORIO para funciones y clases exportadas
 * @param {number} precio - Precio unitario del producto
 * @param {number} cantidad - Cantidad de unidades
 * @param {number} [descuento=0] - Porcentaje de descuento (opcional)
 * @returns {number} Subtotal calculado
 * @throws {ApiError} Si el precio es negativo
 */
function calcularSubtotal(precio, cantidad, descuento = 0) {
  return precio * cantidad * (1 - descuento / 100);
}

/* Comentario de bloque — para desactivar código temporalmente
   NOTA: No dejar código comentado en producción */
```

---

## 2. Gramática Sintáctica (Syntactic Grammar)

### 2.1 Declaraciones de Variables

```javascript
// ✅ OBLIGATORIO: const por defecto
const STOCK_MINIMO = 5;
const configuracion = Object.freeze({ maxItems: 50 });

// ✅ let SOLO cuando se necesite reasignar
let intentos = 0;
intentos += 1;

// ❌ PROHIBIDO: var — nunca usar en este proyecto
var precio = 100; // ❌ PROHIBIDO
```

### 2.2 Declaraciones de Funciones

```javascript
// ✅ Function Declaration — para funciones con nombre en el scope del módulo
function validarEmail(email) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(email);
}

// ✅ Arrow Function — para callbacks, métodos cortos, funciones anónimas
const productosActivos = productos.filter(p => p.stock > 0);
const obtenerPrecio = (producto) => producto.precio;

// ✅ Async Function — con try/catch obligatorio
async function obtenerProductos(filtros) {
  try {
    const productos = await prisma.product.findMany({ where: filtros });
    return productos;
  } catch (error) {
    throw new ApiError(500, 'Error al obtener productos');
  }
}

// ✅ Arrow async
const crearProducto = async (datos) => {
  try {
    return await prisma.product.create({ data: datos });
  } catch (error) {
    throw new ApiError(500, 'Error al crear producto');
  }
};
```

### 2.3 Declaraciones de Clase

```javascript
// ✅ Class Declaration con campos privados
class ProductService {
  /** @type {import('@prisma/client').PrismaClient} */
  #prisma;

  /**
   * @param {import('@prisma/client').PrismaClient} prismaClient
   */
  constructor(prismaClient) {
    this.#prisma = prismaClient;
  }

  /**
   * Obtiene todos los productos con filtros opcionales
   * @param {Object} filtros
   * @returns {Promise<Array>}
   */
  async obtenerTodos(filtros = {}) {
    try {
      return await this.#prisma.product.findMany({ where: filtros });
    } catch (error) {
      throw new ApiError(500, 'Error al obtener productos');
    }
  }
}
```

### 2.4 Module Grammar

#### ImportDeclaration (ECMA-262 §16.2.2)

```javascript
// ✅ Default import
import express from 'express';
import prisma from '../prisma/client.js';

// ✅ Named imports
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

// ✅ Namespace import
import * as validators from '../validators/index.js';

// ✅ Side-effect import
import 'dotenv/config';

// ⚠️ IMPORTANTE: Siempre incluir extensión .js en imports relativos (ESM)
import productService from './services/product.service.js';  // ✅
import productService from './services/product.service';     // ❌
```

#### ExportDeclaration (ECMA-262 §16.2.3)

```javascript
// ✅ Default export — uno por archivo
export default router;

// ✅ Named exports — múltiples por archivo
export { calcularTotal, validarStock };
export const STOCK_MINIMO = 5;

// ✅ Re-exports (para archivos index)
export { default as ProductService } from './product.service.js';
export { default as CartService } from './cart.service.js';
```

### 2.5 Destructuring y Binding Patterns

```javascript
// ✅ Object destructuring con renombrado
const { name: nombre, price: precio } = producto;

// ✅ Array destructuring
const [primerProducto, ...restoProductos] = listaProductos;

// ✅ Nested destructuring
const { direccion: { ciudad, codigoPostal } } = usuario;

// ✅ Default values en destructuring
const { pagina = 1, limite = 20, orden = 'asc' } = req.query;

// ✅ Parameter destructuring
function crearProducto({ nombre, precio, categoriaId, imagen = null }) {
  // ...
}
```

### 2.6 Statements (Sentencias de Control)

```javascript
// ✅ if/else con guard clauses
if (!usuario) {
  throw new ApiError(401, 'No autenticado');
}

// ✅ switch para estados de pedido
switch (pedido.status) {
  case 'pendiente':
    // procesar
    break;
  case 'procesando':
    // preparar envío
    break;
  case 'enviada':
    // tracking
    break;
  default:
    throw new ApiError(400, `Estado desconocido: ${pedido.status}`);
}

// ✅ for...of para iteración de colecciones
for (const item of carrito.items) {
  await actualizarStock(item.productoId, -item.cantidad);
}

// ❌ EVITAR: for clásico cuando for...of es suficiente
// ❌ EVITAR: for...in para arrays (itera sobre propiedades, no valores)
```

---

## 3. ASI (Automatic Semicolon Insertion) — ECMA-262 §12.9

### Reglas formales

**Regla 1:** Si el parser encuentra un token no esperado por la gramática y hay un LineTerminator entre el token anterior y el actual, se inserta un `;` antes del token inesperado.

**Regla 2:** Al final del flujo de entrada de tokens, si el programa no puede parsearse como completo, se inserta `;` al final.

**Regla 3:** Existe una lista de producciones "restrictivas" donde no se permite LineTerminator:
- `return [no LineTerminator here] Expression`
- `throw [no LineTerminator here] Expression`
- `break [no LineTerminator here] LabelIdentifier`
- `continue [no LineTerminator here] LabelIdentifier`
- `yield [no LineTerminator here] AssignmentExpression`

### Política del proyecto

```javascript
// ✅ OBLIGATORIO — Usar punto y coma explícito
const precio = 100;
const items = obtenerItems();
return resultado;

// ❌ PROHIBIDO — No depender de ASI
const precio = 100
const items = obtenerItems()
return resultado
```

**Caso peligroso de ASI:**

```javascript
// ❌ ASI puede causar bugs silenciosos
return
  { precio: 100 }
// Se interpreta como: return;  { precio: 100 }
// Retorna undefined en lugar del objeto

// ✅ Correcto
return {
  precio: 100
};
```

---

## 4. Early Errors

Errores detectados durante el parseo estático, antes de la ejecución:

| Error | Contexto | Ejemplo |
|-------|---------|---------|
| **Duplicate lexical bindings** | Declarar dos veces con let/const en el mismo scope | `const x = 1; const x = 2;` |
| **Invalid assignment target** | Asignar a un valor no válido como target | `'texto' = x;` |
| **await fuera de async** | Usar await en función no async | `function f() { await x; }` |
| **yield fuera de generator** | Usar yield en función no generadora | `function f() { yield 1; }` |
| **Strict mode: delete variable** | En módulos ES (strict automático) | `const x = 1; delete x;` |
| **Strict mode: octal literal** | Literales octales legacy | `const n = 010;` |
| **Strict mode: duplicate params** | Parámetros duplicados | `function f(a, a) {}` |
| **Reserved word as identifier** | Usar palabra reservada | `const class = 5;` |

---

## 5. Reglas Específicas de Angular

### 5.1 Componentes Standalone

```typescript
// ✅ OBLIGATORIO — Todos los componentes son standalone
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'  // CSS nativo
})
export class ProductCardComponent {
  // ...
}
```

### 5.2 CSS — Solo Nativo

```css
/* ✅ VÁLIDO — CSS nativo con variables custom */
.product-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* ✅ VÁLIDO — Media queries responsive */
@media (max-width: 768px) {
  .product-card { padding: 1rem; }
}
```

```html
<!-- ❌ PROHIBIDO — No importar frameworks CSS externos -->
<link href="tailwind.css" rel="stylesheet">      <!-- ❌ -->
<link href="bootstrap.min.css" rel="stylesheet">  <!-- ❌ -->
```

```javascript
// ❌ PROHIBIDO — No instalar frameworks CSS
// npm install tailwindcss     ❌
// npm install bootstrap       ❌
// npm install @angular/material ❌
```

### 5.3 HTML5 Semántico

```html
<!-- ✅ OBLIGATORIO — Usar tags HTML5 semánticos -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<section>...</section>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

<!-- ❌ EVITAR — div para todo -->
<div class="header">...</div>
<div class="navigation">...</div>
```

---

*Última actualización: Marzo 2026*
*Referencia: ECMA-262, 15th Edition (ECMAScript 2024)*
