# Backend de Ferretería Los Maestros

El backend se compone de Usuarios y Ventas, dos aplicaciones Spring Boot con bases MySQL independientes. Docker Compose prepara MySQL y los servicios se ejecutan mediante Maven.

## 1. Requisitos

| Herramienta | Uso |
| --- | --- |
| JDK 17 o superior | Compilación con destino Java 17. Verificado con Java 21. |
| Docker Desktop con Docker Compose | Instancia MySQL para desarrollo. |
| PowerShell 7.4 o superior en Windows | Preparación del entorno y generación de claves PEM. |
| Maven Wrapper incluido | Descarga de dependencias, compilación y arranque. |

La primera ejecución requiere conexión a Internet para descargar las dependencias que falten.

| Recurso | Configuración del proyecto |
| --- | --- |
| Imagen | `mysql:8.4`, verificada con MySQL 8.4.13 |
| Contenedor | `losmaestros-mysql` |
| MySQL desde el host | `localhost:3307` |
| Volumen | `losmaestros_mysql_data` |
| Base de Usuarios | `losmaestros_usuarios`, usuario `lm_usuarios` |
| Base de Ventas | `losmaestros_ventas`, usuario `lm_ventas` |
| API Usuarios | `http://localhost:8081` |
| API Ventas | `http://localhost:8082` |

## 2. Preparación inicial

Ejecutar los pasos desde `Fase 3/backend`, en un clon nuevo del repositorio.

### Archivos de configuración

```powershell
Copy-Item .env.example .env
Copy-Item usuarios-service/.env.example usuarios-service/.env
Copy-Item ventas-service/.env.example ventas-service/.env
```

Completar los archivos con valores propios, sin comillas. Para las contraseñas MySQL y la credencial interna se pueden generar valores alfanuméricos con este comando de PowerShell:

```powershell
[Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```

Generar un valor diferente para cada contraseña. La credencial interna debe coincidir en ambos servicios.

| Archivo | Valores que deben configurarse |
| --- | --- |
| [backend/.env.example](.env.example) | `MYSQL_ROOT_PASSWORD` para la administración de MySQL. |
| [usuarios-service/.env.example](usuarios-service/.env.example) | Conexión de su base, rutas de claves JWT, credencial interna y contraseña inicial de la aplicación. |
| [ventas-service/.env.example](ventas-service/.env.example) | Conexión de su base, clave pública JWT y credencial interna de Usuarios. |

Mantener `lm_usuarios` y `lm_ventas` como nombres de conexión, con contraseñas diferentes. `USUARIOS_ADMIN_PASSWORD` debe tener entre 4 y 10 caracteres, según las restricciones actuales del prototipo.

Los archivos `.env` y las claves PEM están excluidos de Git. Cada integrante debe preparar sus propios valores.

### Claves JWT

Desde PowerShell, generar un par RSA en una carpeta privada del usuario:

```powershell
$carpetaClaves = Join-Path $env:USERPROFILE '.losmaestros/claves'
New-Item -ItemType Directory -Force $carpetaClaves | Out-Null
$privada = Join-Path $carpetaClaves 'privada.pem'
$publica = Join-Path $carpetaClaves 'publica.pem'
$rsaUsuarios = [System.Security.Cryptography.RSA]::Create(2048)
[IO.File]::WriteAllText($privada, $rsaUsuarios.ExportPkcs8PrivateKeyPem())
[IO.File]::WriteAllText($publica, $rsaUsuarios.ExportSubjectPublicKeyInfoPem())
$rsaUsuarios.Dispose()
([Uri]$privada).AbsoluteUri
([Uri]$publica).AbsoluteUri
```

Copiar las URI mostradas a los archivos `.env`:

- Usuarios recibe la privada en `USUARIOS_JWT_PRIVATE_KEY_LOCATION` y la pública en `USUARIOS_JWT_PUBLIC_KEY_LOCATION`.
- Ventas recibe la misma pública en `VENTAS_JWT_PUBLIC_KEY_LOCATION`.
- `USUARIOS_INTERNAL_TOKEN` y `VENTAS_USUARIOS_INTERNAL_TOKEN` deben tener el mismo valor.
- `VENTAS_USUARIOS_URL` apunta a `http://localhost:8081`.

### Bases, cuentas y tablas

Con Docker Desktop iniciado:

```powershell
.\preparar-mysql.ps1
docker compose ps
```

El [script de preparación](preparar-mysql.ps1) inicia MySQL, espera su disponibilidad y crea las bases y los usuarios. Cada usuario de aplicación recibe SELECT, INSERT, UPDATE y DELETE sobre su propia base. La cuenta root se usa para preparar el esquema.

| Base | Scripts cargados |
| --- | --- |
| Usuarios | [usuarios-mysql.sql](usuarios-service/database/usuarios-mysql.sql) |
| Ventas | [jeremy-catalogo-mysql.sql](ventas-service/database/jeremy-catalogo-mysql.sql) y [seba-mysql.sql](ventas-service/database/seba-mysql.sql) |

La carga inicial de Ventas contiene siete categorías y 27 productos.

## 3. Iniciar las aplicaciones

En una terminal ubicada en `usuarios-service`:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=mysql"
```

En otra terminal ubicada en `ventas-service`:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=mysql"
```

El perfil `mysql` carga el archivo `.env` de la carpeta del servicio y valida las tablas mediante `ddl-auto=validate`. Las variables de entorno de la terminal tienen prioridad sobre los valores del archivo.

Usuarios crea `admin@duoc.cl` cuando la base todavía carece de un administrador y se ha configurado `USUARIOS_ADMIN_PASSWORD`. La misma variable no cambia la contraseña de un administrador existente.

En `Fase 3/frontend`, iniciar React con `npm ci` y `npm run dev`. Consultar el [README del frontend](../frontend/README.md) para sus variables de conexión.

| Servicio | Swagger UI | Especificación OpenAPI |
| --- | --- | --- |
| Usuarios | `http://localhost:8081/swagger-ui/index.html` | `http://localhost:8081/v3/api-docs` |
| Ventas | `http://localhost:8082/swagger-ui/index.html` | `http://localhost:8082/v3/api-docs` |

## 4. Uso diario y persistencia

Desde `Fase 3/backend`:

```powershell
docker compose up -d
docker compose ps
docker compose stop
```

`up -d` inicia MySQL y `stop` lo detiene. Los datos permanecen en el volumen `losmaestros_mysql_data`. Eliminar ese volumen mediante `docker compose down -v` elimina también las bases y sus datos.

La preparación conserva los usuarios MySQL existentes. Cambiar una contraseña en `.env` requiere actualizar también la contraseña de esa cuenta en MySQL. Al volver a importar el catálogo, sus scripts actualizan los nombres de los datos precargados.

## 5. Pruebas y documentación

Desde cada carpeta de servicio:

```powershell
.\mvnw.cmd test "-Dspring.profiles.active=local"
```

Estas pruebas usan H2. La verificación con MySQL se reproduce siguiendo el informe correspondiente.

- [Implementación de Usuarios y seguridad](../documentacion/IMPLEMENTACION_MARTIN.md).
- [Pruebas de los backends con MySQL](../documentacion/PRUEBAS_MYSQL.md).
- [Pruebas de React con Usuarios y MySQL](../documentacion/PRUEBAS_REACT_USUARIOS_MYSQL.md).

## Contenedores y AWS

La [guía de despliegue](../despliegue/README.md) utiliza los Dockerfile de ambos servicios y un Compose independiente del MySQL de desarrollo. Ejecuta el perfil `mysql`, monta el par JWT y conecta Ventas con Usuarios mediante el nombre Docker `usuarios`.

`APP_CORS_ALLOWED_ORIGINS` permite definir el origen del navegador al publicar en EC2. Admite una lista separada por comas; en despliegue se configura una URL exacta con protocolo y puerto cuando corresponde. Si no se define, se mantienen los orígenes locales existentes.
