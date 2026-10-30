# Servicio de Usuarios

Responsabilidad propuesta: **Martín**.

Plantilla configurada con Java 17, Spring Boot 3.5.16 y Maven Wrapper. Incluye Web, JPA, validación, Security, soporte JWT (Resource Server y JOSE), MySQL, H2, springdoc OpenAPI y dependencias de pruebas.

## Ejecutar

Desde esta carpeta, con JDK 17 instalado:

```bash
./mvnw test
./mvnw spring-boot:run
```

En Windows usar `mvnw.cmd` en lugar de `./mvnw`. La primera ejecución descarga Maven y dependencias, por lo que necesita internet. Puerto predeterminado: `8081`. Cambiar con `SERVER_PORT` si está ocupado.

El perfil predeterminado `local` usa H2 temporal y no requiere MySQL. No hay entidades ni datos de negocio. Spring Security conserva su protección automática: no hay login propio, permisos ni emisión/validación JWT configurados todavía. Si aparece una contraseña temporal en la consola, pertenece a la configuración automática de Spring, no a usuarios de Los Maestros. Swagger (`/swagger-ui/index.html`) también está protegido por esa configuración inicial.

Para MySQL, crear `losmaestros_usuarios`, definir `DB_USERNAME` y `DB_PASSWORD` (opcionalmente `DB_URL`) en la terminal o el IDE y ejecutar:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

El perfil MySQL valida el esquema y no crea tablas: el responsable deberá preparar el esquema al implementar las entidades. No se ha verificado una conexión MySQL real. Un archivo `.env` no se carga automáticamente con esta plantilla.

## Estructura

Cada módulo contiene paquetes `controller`, `service`, `repository`, `entity` y `dto`, reservados mediante `package-info.java`. `config` y `exception` quedan preparados para configuración y errores comunes del servicio. No hay CRUD, reglas comerciales ni integración React implementados.

Consultar el [reparto de trabajo](../../documentacion/PLAN_DE_TRABAJO.md). JWT, CORS y autorización son trabajo pendiente; las dependencias incluidas no equivalen a una seguridad terminada.
