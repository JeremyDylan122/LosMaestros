# Usuarios

Servicio Spring Boot de registro, sesión y administración de usuarios. Usa el puerto 8081 y el perfil `local` con H2 temporal por defecto.

## Ejecutar

Desde esta carpeta, en PowerShell:

```powershell
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Para habilitar el administrador inicial `admin@duoc.cl`, definir `USUARIOS_ADMIN_PASSWORD` antes de arrancar. La clave debe tener entre 4 y 10 caracteres, como en la interfaz existente. Se crea el usuario si la base aún no tiene un administrador. Swagger está en `http://localhost:8081/swagger-ui/index.html`.

Para MySQL, crear `losmaestros_usuarios`, ejecutar `database/usuarios-mysql.sql`, configurar `DB_USERNAME`, `DB_PASSWORD` y arrancar con el perfil `mysql`. Se puede cambiar la URL con `DB_URL`.

El [entorno dedicado del proyecto](../README.md) usa MySQL en `localhost:3307`. Con el perfil `mysql`, este servicio carga el archivo local `.env` desde su carpeta. El ejemplo está en `.env.example`.

## API

| Método y ruta | Permiso | Respuesta |
| --- | --- | --- |
| POST /api/v1/auth/registro | Público | 201 con `token` y `usuario`. Solo admite CLIENTE y CONTRATISTA. |
| POST /api/v1/auth/login | Público | 200 con `token` y `usuario`, o 401 si las credenciales son inválidas. |
| GET /api/v1/usuarios/me | Sesión válida | 200 con el perfil propio. |
| GET /api/v1/usuarios | ADMIN | 200 con el listado. |
| GET /api/v1/usuarios/{id} | ADMIN | 200 con el perfil solicitado. |
| POST /api/v1/usuarios | ADMIN | 201 con el usuario creado. |
| PUT /api/v1/usuarios/{id} | ADMIN | 200 con el usuario actualizado. Omitir `password` conserva la clave. |
| DELETE /api/v1/usuarios/{id} | ADMIN | 204 con desactivación lógica. |

Los perfiles excluyen la contraseña y el hash. El RUN se valida con Módulo 11. El correo se normaliza antes de guardarlo. Un RUN o correo duplicado devuelve 409.

## JWT

Las rutas protegidas reciben `Authorization: Bearer <token>`. El token dura 30 minutos y lleva el ID del usuario en `sub`, su rol en el arreglo `roles` y el emisor `losmaestros-usuarios`. Configurar `USUARIOS_JWT_PRIVATE_KEY_LOCATION` y `USUARIOS_JWT_PUBLIC_KEY_LOCATION` con rutas `file:` a archivos PEM PKCS#8 y X.509 respectivamente. En local, si ambas variables están vacías, se genera un par RSA temporal al arrancar. Para que Ventas valide el mismo token, configurar el mismo PEM público en `VENTAS_JWT_PUBLIC_KEY_LOCATION` y mantener el emisor igual en ambos servicios.

Desactivar impide nuevos inicios de sesión y el acceso a `/usuarios/me`. Los permisos de un JWT emitido se mantienen hasta su vencimiento. Los cambios de rol se reflejan en el próximo inicio de sesión.

## Consulta interna desde Ventas

`GET /api/v1/interno/usuarios/{id}` recibe la credencial de servicio en `X-Service-Token`. Configurar `USUARIOS_INTERNAL_TOKEN` en Usuarios y el mismo valor en `VENTAS_USUARIOS_INTERNAL_TOKEN` en Ventas. Mantener ese valor fuera del repositorio. Un JWT de usuario por sí solo no habilita esta ruta.

La respuesta contiene únicamente `id`, `activo` y `rol`. Devuelve 404 si el usuario no existe y 401 si falta la credencial, es incorrecta o no está configurada. En Ventas, definir también `VENTAS_USUARIOS_URL=http://localhost:8081`, sin agregar `/api/v1`. La configuración y las verificaciones conjuntas se detallan en [implementación de Martín](../../documentacion/IMPLEMENTACION_MARTIN.md).
