# Servicio de Ventas

Responsabilidad propuesta: **Jeremy: catálogo e inventario. Seba: pedidos y cuenta corriente**.

Plantilla configurada con Java 17, Spring Boot 3.5.16 y Maven Wrapper. Incluye Web, JPA, validación, Security, soporte JWT (Resource Server y JOSE), MySQL, H2, springdoc OpenAPI y dependencias de pruebas.

## Ejecutar

Desde esta carpeta, con JDK 17 instalado:

```bash
./mvnw test
./mvnw spring-boot:run
```

En Windows usar `mvnw.cmd` en lugar de `./mvnw`. La primera ejecución descarga Maven y dependencias, por lo que necesita internet. Puerto predeterminado: `8082`. Cambiar con `SERVER_PORT` si está ocupado.

El perfil predeterminado `local` usa H2 temporal y no requiere MySQL. **La parte de Seba está implementada:** pedidos, detalles y cuenta corriente, con cinco pruebas de negocio. Swagger está disponible en `/swagger-ui/index.html`. La API de pedidos/cuentas valida JWT y roles; sin la clave pública de Usuarios no acepta tokens.

La compra y la anulación necesitan el adaptador de catálogo de Jeremy. La configuración de cuentas necesita el adaptador de usuarios de Martín. Si faltan, las operaciones correspondientes devuelven 503. Consultar [implementación, API y contratos](../../documentacion/IMPLEMENTACION_SEBA.md).

Para MySQL, crear `losmaestros_ventas`, definir `DB_USERNAME` y `DB_PASSWORD` (opcionalmente `DB_URL`) en la terminal o el IDE y ejecutar:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

El perfil MySQL valida el esquema y no crea tablas: ejecutar antes `database/seba-mysql.sql` para crear las tablas de Seba. No se ha verificado una conexión MySQL real. Un archivo `.env` no se carga automáticamente con esta plantilla.

## Estructura

Los módulos `pedidos` y `cuentacorriente` contienen entidades, DTO, repositorios, servicios y controladores. `config/SeguridadPedidos.java` protege sus rutas; `exception/` maneja sus errores. `catalogo` sigue reservado para Jeremy. React no se ha conectado todavía.

Consultar el [reparto de trabajo](../../documentacion/PLAN_DE_TRABAJO.md). La emisión del JWT corresponde a Martín. CORS y conexión de pantallas quedan pendientes de integración con el equipo.
