# Implementación de Catálogo, Inventario y Frontend de Jeremy

Se implementó el módulo integral de **Catálogo e Inventario** en el backend (`backend/ventas-service`) y la versión integrada del **Frontend React** en `Fase 3/frontend`, dando cumplimiento estricto a las especificaciones y responsabilidades asignadas a Jeremy en el documento de Fase 3.

---

## 1. Arquitectura y Componentes Backend (`ventas-service`)

El backend fue desarrollado bajo el paquete `cl.losmaestros.ventas.catalogo`, coexistiendo armónicamente con los módulos de pedidos y cuenta corriente de Sebastián:

- **Entidades JPA**:
  - `Categoria`: id autoincremental, nombre obligatorio y único (`@Column(unique = true)`), descripción y fecha de registro.
  - `Producto`: id, código SKU único (`@Column(unique = true)`), nombre, descripción, relación `@ManyToOne` con `Categoria`, subcategoría, marca, unidad, precio lista, precio compra, stock actual, stock mínimo para umbral de seguridad, bandera de oferta (`enOferta`), porcentaje de descuento (`0` a `100`), URL/ruta de imagen, especificaciones técnicas y estado de activación (`activo`).
  - **Lógica de Precio Efectivo**: método de dominio `getPrecioEfectivo()` que calcula de forma atómica y consistente el precio final aplicando el descuento si el artículo se encuentra en oferta activa, asegurando coherencia financiera para ventas y pedidos.
- **Repositorios Spring Data JPA**:
  - `CategoriaRepository`: búsqueda por nombre y validación de existencia.
  - `ProductoRepository`:
    - `findByIdForUpdate(Long id)`: consulta nativa con bloqueo pesimista `@Lock(LockModeType.PESSIMISTIC_WRITE)` (`SELECT ... FOR UPDATE`), garantizando aislamiento y serialización atómica ante compras concurrentes.
    - `findStockCritico()`: consulta artículos donde `stock <= stockMinimo` y `activo = true`.
    - `findEnOferta()`: artículos con descuento promocional activo.
    - `buscarProductos(...)`: soporte de filtrado combinado por categoría, estado de oferta y coincidencia parcial en nombre, código o marca.
- **DTOs y Validación Jakarta**:
  - `ProductoResponseDto`, `ProductoCreacionDto`, `ProductoActualizacionDto`, `AjusteStockDto`, `CategoriaResponseDto` y `CategoriaCreacionDto`.
- **Servicio de Negocio (`CatalogoService`)**:
  - Control de reglas de negocio: código SKU único, validación de categorías existentes, stock no negativo, baja lógica sin pérdida de integridad referencial.
- **Carga Inicial / Seeder (`CatalogoDataSeeder`)**:
  - Poblamiento automático en arranque (`@Component CommandLineRunner`) con **7 categorías oficiales** y **27 artículos ferreteros** idénticos al maestro representativo del Excel.

---

## 2. API REST de Catálogo

- **Base URL**: `http://localhost:8082`
- **Swagger UI**: `/swagger-ui/index.html`
- **Documentación OpenAPI**: `/v3/api-docs`

| Método | Ruta | Autorización (Rol) | Código HTTP | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/productos` | Público | `200 OK` | Catálogo paginado con filtros (`categoriaId`, `enOferta`, `buscar`, `page`, `size`, `sort`) |
| `GET` | `/api/v1/productos/{id}` | Público | `200 OK` | Ficha técnica y detalle de un producto por ID |
| `GET` | `/api/v1/productos/criticos` | Público | `200 OK` | Listado de artículos con existencia $\le$ stock mínimo |
| `GET` | `/api/v1/productos/ofertas` | Público | `200 OK` | Artículos promocionales con descuento vigente |
| `POST` | `/api/v1/productos` | Requiere `ADMIN` | `201 Created` | Creación de nuevo producto en catálogo |
| `PUT` | `/api/v1/productos/{id}` | Requiere `ADMIN` | `200 OK` | Actualización completa de datos de producto |
| `PATCH` | `/api/v1/productos/{id}/stock` | Requiere `ADMIN` | `200 OK` | Ajuste rápido o reabastecimiento (`{"delta": 10}`) |
| `DELETE` | `/api/v1/productos/{id}` | Requiere `ADMIN` | `204 No Content` | Baja lógica del producto (`activo = false`) |
| `GET` | `/api/v1/categorias` | Público | `200 OK` | Listado completo de familias de productos |
| `POST` | `/api/v1/categorias` | Requiere `ADMIN` | `201 Created` | Creación de nueva categoría |

> [!NOTE]
> Los usuarios con rol `VENDEDOR` tienen acceso público y de consulta (`GET`), pero cualquier intento de alteración (`POST`, `PUT`, `PATCH`, `DELETE`) es denegado con `403 Forbidden` a nivel de seguridad Spring Security.

---

## 3. Contrato Transaccional con Sebastián (`CatalogoPedidos`)

Se implementó el adaptador oficial `CatalogoPedidosAdapter`:

```java
@Service
public class CatalogoPedidosAdapter implements CatalogoPedidos {
    // Participa en la misma conexión administrada y transacción activa de Ventas
    public Producto bloquear(long productoId) { ... }
    public void ajustarStock(long productoId, int delta) { ... }
}
```

1. **Bloqueo Pesimista en la Misma Transacción**:
   - `bloquear(productoId)` ejecuta `productoRepo.findByIdForUpdate(id)`, adquiriendo un lock pesimista de escritura a nivel de fila (`FOR UPDATE`).
   - Retorna el record `Producto(id, codigo, nombre, precioEfectivo, stock, activo)`.
   - Se comunica en el mismo hilo sin llamadas HTTP intermedias ni `REQUIRES_NEW`, permitiendo el rollback atómico coordinado de pedido, existencias y cuenta corriente.
2. **Ajuste Concurrente Seguro**:
   - `ajustarStock(productoId, delta)` suma o resta existencias verificando que el inventario resultante no sea negativo. Ante stock insuficiente arroja `NegocioException.conflicto(...)` provocando el rollback total de la transacción.

---

## 4. Seguridad Spring Security y CORS (`SeguridadCatalogo`)

Se configuró la cadena de filtros `SeguridadCatalogo` con orden de precedencia `@Order(2)` para complementar la cadena de pedidos (`@Order(1)`):

- **Endpoints de Lectura**: `/api/v1/productos/**` y `/api/v1/categorias/**` con método `GET` permitidos para todos (`permitAll()`).
- **Endpoints de Escritura**: métodos `POST`, `PUT`, `PATCH`, `DELETE` requieren autenticación y rol `ADMIN` (`hasAuthority("ROLE_ADMIN")`).
- **CORS Unificado**: Bean `@Primary CorsConfigurationSource` habilitando orígenes frontend de desarrollo (`http://localhost:5173`, `http://localhost:3000`) con soporte para credenciales y encabezados de autorización.

---

## 5. Script de Base de Datos MySQL (`jeremy-catalogo-mysql.sql`)

Ubicado en `Fase 3/backend/ventas-service/database/jeremy-catalogo-mysql.sql`:
- Creación de tablas `categorias` y `productos`.
- Índices de rendimiento para `codigo` (SKU), `categoria_id`, `stock` y `en_oferta`.
- Inserción de las 7 categorías y 27 productos ferreteros base con existencias y precios reales.

---

## 6. Frontend Integrado (`Fase 3/frontend`)

Se migró y adaptó la aplicación React construida con Vite:

1. **Estructura limpia**: copia completa sin artefactos volátiles (`node_modules`, `dist`, `coverage`).
2. **Variables de Entorno (`.env`)**:
   ```properties
   VITE_API_VENTAS_URL=http://localhost:8082/api/v1
   VITE_API_USUARIOS_URL=http://localhost:8081/api/v1
   ```
3. **Servicio de Productos Asíncrono (`productService.js`)**:
   - Integración asíncrona mediante `fetch` hacia `${VITE_API_VENTAS_URL}/productos` y `${VITE_API_VENTAS_URL}/categorias`.
   - Métodos asíncronos implementados: `fetchProducts()`, `fetchProductById()`, `fetchCriticalStock()`, `fetchOffers()`, `fetchCategories()`, `createProductApi()`, `updateProductApi()`, `adjustStockApi()` y `deleteProductApi()`.
   - **Mecanismo de Resiliencia / Fallback**: ante desconexión temporal del backend o ejecución en tests unitarios aislados, sincroniza y consulta el almacenamiento local manteniendo plena funcionalidad operativa.
4. **Restricción RBAC de Vendedor en `AdminDashboard.jsx`**:
   - Cumplimiento de la regla de negocio: **El vendedor solo tiene acceso de consulta**.
   - Se ocultan los botones "Nuevo Producto", las acciones de ajuste rápido de stock (`-1`, `+1`, `+5 Reabastecer`) y los botones de edición/eliminación para usuarios con rol `VENDEDOR`.
   - En las tablas de inventario y stock crítico se muestran indicadores visuales de `Solo Lectura`.
   - Bloqueo programático en manejadores (`handleSaveProduct`, `handleQuickStockAdjust`, `handleDeleteProduct`) con alertas táctiles si un vendedor intenta disparar una mutación.

---

## 7. Matriz de Pruebas y Resultados de Verificación

### Backend (`ventas-service` - Maven)
- Comando ejecutado: `.\mvnw.cmd test`
- **Resultados**: `Tests run: 14, Failures: 0, Errors: 0, Skipped: 0` (BUILD SUCCESS).
  - `CatalogoJeremyTests`: 8 pruebas unitarias y de integración pasando (100% éxito):
    1. Creación de producto con código SKU único.
    2. Rechazo de código duplicado con excepción de negocio (409).
    3. Consulta de stock crítico ($\le$ stock mínimo).
    4. Cálculo de precio efectivo con oferta activa.
    5. Contrato `bloquear` con lock pesimista e ID ordenado.
    6. Contrato `ajustarStock` decrementando y rechazando existencias negativas.
    7. Endpoint público `GET /api/v1/productos` accesible sin autenticación.
    8. Endpoint administrativo `POST /api/v1/productos` restringido ante tokens sin rol `ADMIN`.
  - `PedidosSebaTests`: 5 pruebas de Seba pasando en coexistencia armónica.
  - `VentasServiceApplicationTests`: 1 prueba de arranque de contexto pasando.

### Frontend (`frontend` - Vitest & Vite)
- Comando ejecutado: `npm run test:run`
- **Resultados**: `Test Files: 14 passed (14), Tests: 99 passed (99)` (100% éxito).
  - Nueva suite `catalogoJeremyFase3.test.jsx`: 7 pruebas específicas para llamadas API asíncronas y validación de restricción RBAC de `VENDEDOR`.
  - 13 suites existentes de Fase 2: 92 pruebas pasando sin regresiones.
- Build de producción: `npm run build` completado exitosamente en 1.09s (`dist/` generado).
- Linter: `npm run lint` (`oxlint`) con 0 errores.
