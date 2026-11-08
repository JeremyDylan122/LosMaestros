# Servicio de Ventas

API de catálogo, inventario, pedidos y cuenta corriente. Jeremy desarrolló catálogo e inventario; Sebastián, pedidos y crédito. Los módulos comparten base y transacciones. React consume la API y Usuarios proporciona la identidad mediante JWT.

## Ejecución y configuración

Puerto predeterminado: `8082`. Requiere JDK 17 o superior y el Maven Wrapper incluido. Desde esta carpeta:

```bash
./mvnw test
./mvnw spring-boot:run
```

En Windows usar `mvnw.cmd`. El perfil predeterminado `local` utiliza H2 temporal. Para persistencia, seguir la [preparación de MySQL](../README.md), que carga ambos esquemas: `database/jeremy-catalogo-mysql.sql` y `database/seba-mysql.sql`.

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

El perfil `mysql` carga `.env` y valida las tablas existentes. Configurar `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `VENTAS_JWT_PUBLIC_KEY_LOCATION`, `VENTAS_USUARIOS_URL` y `VENTAS_USUARIOS_INTERNAL_TOKEN` según `.env.example`. La clave pública debe corresponder a Usuarios y la credencial interna debe coincidir en ambos servicios. Sin clave pública válida no se aceptan JWT.

Swagger: `http://localhost:8082/swagger-ui/index.html`. OpenAPI: `http://localhost:8082/v3/api-docs`.

## Catálogo e inventario

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

El vendedor puede consultar, pero las escrituras requieren ADMIN.

## Pedidos y cuenta corriente

| Método y ruta | Quién | Resultado |
| --- | --- | --- |
| POST `/api/v1/pedidos` | CLIENTE, CONTRATISTA, ADMIN | 201, pedido creado y Location |
| GET `/api/v1/pedidos?page=0&size=20` | Roles del sistema | 200, página con `content`; máximo 100 resultados por página |
| GET `/api/v1/pedidos/{id}` | Dueño del pedido, ADMIN o VENDEDOR | 200; 404 si no existe o pertenece a otro cliente |
| PATCH `/api/v1/pedidos/{id}/estado` | ADMIN | 200, avance o anulación |
| GET `/api/v1/cuentas-corrientes/me` | CONTRATISTA | 200, cupo, saldo y disponible; 404 si no tiene cuenta |
| PUT `/api/v1/cuentas-corrientes/{usuarioId}` | ADMIN | 200, configuración del cupo y habilitación |

| GET `/api/v1/cuentas-corrientes/{usuarioId}` | ADMIN | 200, cuenta del usuario; 404 si no existe |

Las rutas protegidas requieren `Authorization: Bearer <token>`. Las consultas de pedidos restringen los resultados según titularidad y rol. Errores habituales: 400 por entrada inválida, 401 por autenticación, 403 por permisos, 404 por recurso no disponible, 409 por conflicto de negocio y 503 por dependencia no disponible.

## Reglas y contratos

El servidor calcula precios y totales; descuenta stock y crédito de forma transaccional. Anular restituye existencias y saldo una sola vez. Los productos se desactivan sin borrar el historial. La cuenta corriente admite configuración de cupo y habilitación, pero no registro de abonos. Webpay y transferencia no efectúan cobros reales.

- [Cuerpos de petición, estados y contratos transaccionales](../../documentacion/IMPLEMENTACION_SEBA.md).
- [Detalles del catálogo](../../documentacion/IMPLEMENTACION_JEREMY.md).
- [Contrato completo de APIs e integración](<../../../docs/APIs e Integracion/APIS_E_INTEGRACION.md>).
- [Pruebas de persistencia, concurrencia y rollback en MySQL](../../documentacion/PRUEBAS_MYSQL.md).
- [Despliegue del conjunto](../../despliegue/README.md).
