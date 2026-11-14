# Implementación de Usuarios, Seguridad e Integración React de Martín

El módulo de Usuarios implementa registro, inicio de sesión, emisión de JWT, consulta de perfil y administración de cuentas. React consume sus endpoints y comparte el token con Ventas. La consulta interna de Usuarios permite a Ventas verificar al contratista antes de habilitar una cuenta corriente.

**Estado verificado al 5 de noviembre de 2026.** Usuarios está integrado con React y MySQL. La configuración de ejecución se encuentra en la [guía del backend](../backend/README.md).

## 1. Arquitectura y componentes

| Componente | Responsabilidad |
| --- | --- |
| [Usuario](../backend/usuarios-service/src/main/java/cl/losmaestros/usuarios/usuario/entity/Usuario.java) y `Rol` | Datos de identidad, contacto, contraseña derivada con BCrypt, rol y estado activo. |
| `UsuarioRepository` | Persistencia JPA y búsqueda de cuentas activas por correo. |
| `UsuarioRequest` y `UsuarioResponse` | Validación de entradas y respuesta de perfil. |
| `UsuarioService` | Registro, autenticación, edición, desactivación y validación del RUN. |
| `AuthController` | Registro y login con respuesta de sesión. |
| `UsuarioController` | Perfil propio y operaciones administrativas. |
| `UsuarioInternoController` | Consulta de identificador, estado y rol para Ventas. |
| `SeguridadUsuarios` | Rutas públicas, autorización por rol, firma y validación de JWT, CORS y acceso interno. |
| `ErroresUsuarios` | Respuestas de validación y negocio. |
| `AdminInicial` | Creación del primer administrador mediante configuración externa. |

Los paquetes se organizan en `usuario`, `auth`, `config` y `exception`, siguiendo la estructura utilizada en Ventas.

### Modelo y validaciones

La tabla `usuarios` conserva RUN, nombre, apellidos, correo, hash de contraseña, rol, estado, región, comuna, dirección y empresa.

- RUN y correo son únicos. El RUN se normaliza y valida con Módulo 11.
- El correo se guarda en minúsculas y admite los dominios `duoc.cl`, `profesor.duoc.cl` y `gmail.com`.
- La contraseña debe tener entre 4 y 10 caracteres, según las restricciones del prototipo.
- El registro público permite CLIENTE y CONTRATISTA. La administración permite asignar los cuatro roles.
- La baja cambia `activo` a `false` y conserva el registro.
- Las respuestas de perfil contienen los datos de contacto, el rol y el estado. La contraseña se almacena como hash BCrypt.

El [script MySQL de Usuarios](../backend/usuarios-service/database/usuarios-mysql.sql) define la tabla y sus restricciones.

## 2. API REST de Usuarios

**URL base** `http://localhost:8081`

**Swagger UI** `/swagger-ui/index.html`

**OpenAPI** `/v3/api-docs`

| Método | Ruta | Acceso | Respuesta correcta | Función |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/auth/registro` | Público | 201 | Crea cliente o contratista y devuelve sesión. |
| POST | `/api/v1/auth/login` | Público | 200 | Autentica una cuenta activa y devuelve sesión. |
| GET | `/api/v1/usuarios/me` | JWT válido | 200 | Consulta el perfil propio. |
| GET | `/api/v1/usuarios` | ADMIN | 200 | Lista cuentas activas e inactivas. |
| GET | `/api/v1/usuarios/{id}` | ADMIN | 200 | Consulta una cuenta. |
| POST | `/api/v1/usuarios` | ADMIN | 201 | Crea una cuenta con el rol indicado. |
| PUT | `/api/v1/usuarios/{id}` | ADMIN | 200 | Actualiza el perfil y el rol. |
| DELETE | `/api/v1/usuarios/{id}` | ADMIN | 204 | Desactiva la cuenta. |
| GET | `/api/v1/interno/usuarios/{id}` | Credencial de servicio | 200 | Entrega el estado mínimo requerido por Ventas. |

### Entradas y respuestas

Ejemplo de registro con datos ficticios:

```json
{
  "run": "11111111-1",
  "nombre": "Ana",
  "apellidos": "Prueba",
  "email": "ana.prueba@gmail.com",
  "password": "prueba123",
  "rol": "CONTRATISTA",
  "region": "Región de Coquimbo",
  "comuna": "La Serena",
  "direccion": "Dirección de prueba 123",
  "empresa": "Empresa de demostración"
}
```

En registro y creación administrativa son obligatorios RUN, nombre, apellidos, correo y contraseña. Nombre admite hasta 50 caracteres, apellidos y correo hasta 100. Región y comuna admiten 100, dirección 300 y empresa 150. El rol omitido en un alta toma el valor CLIENTE.

Login recibe `email` y `password`. Registro y login responden con esta estructura:

```json
{
  "token": "<jwt-emitido-por-usuarios>",
  "usuario": {
    "id": 2,
    "run": "11111111-1",
    "nombre": "Ana",
    "apellidos": "Prueba",
    "email": "ana.prueba@gmail.com",
    "rol": "CONTRATISTA",
    "activo": true,
    "region": "Región de Coquimbo",
    "comuna": "La Serena",
    "direccion": "Dirección de prueba 123",
    "empresa": "Empresa de demostración"
  }
}
```

El identificador del ejemplo es ilustrativo. Las operaciones posteriores deben usar el identificador devuelto por la API.

PUT recibe los campos del perfil completo. Omitir `password` conserva la contraseña existente. React omite ese campo cuando el formulario de edición lo deja vacío.

| Código de error | Situación |
| --- | --- |
| 400 | Datos inválidos, RUN incorrecto, contraseña fuera de rango o rol de gestión solicitado en el registro público. |
| 401 | Credenciales inválidas, cuenta desactivada al iniciar sesión o consultar `me`, JWT inválido o credencial interna incorrecta. |
| 403 | Perfil sin permiso para la operación administrativa. |
| 404 | Identificador de usuario inexistente. |
| 409 | RUN o correo duplicado. |

Los errores de validación y negocio incluyen el campo `mensaje`.

## 3. Autenticación y autorización

Las rutas protegidas reciben `Authorization: Bearer <token>`. Usuarios firma con RS256 y Ventas valida con la misma clave pública.

| Claim | Contenido |
| --- | --- |
| `sub` | ID numérico positivo del usuario, representado como texto. |
| `roles` | Arreglo con el rol, por ejemplo `["CONTRATISTA"]`. |
| `iss` | Emisor `losmaestros-usuarios` por defecto. |
| `iat` | Instante de emisión. |
| `exp` | Vencimiento a los 30 minutos. |

Las claves PEM se configuran mediante rutas externas. La clave privada usa PKCS#8 y la pública X.509. El perfil H2 local puede generar un par temporal para ejecutar Usuarios de forma aislada. La ejecución conjunta utiliza un par configurado y compartido mediante su clave pública.

Desactivar bloquea nuevos inicios de sesión y la consulta de perfil propio. Los JWT emitidos conservan sus permisos hasta vencer. Los cambios de rol se incorporan al token del siguiente login.

## 4. Contrato con Ventas

`GET /api/v1/interno/usuarios/{id}` requiere `X-Service-Token`. El valor debe coincidir con `USUARIOS_INTERNAL_TOKEN`. La respuesta contiene `id`, `activo` y `rol`.

El [adaptador de contratistas](../backend/ventas-service/src/main/java/cl/losmaestros/ventas/cuentacorriente/service/UsuariosContratistasAdapter.java) implementa `UsuariosContratistas` en Ventas y consulta ese endpoint con la credencial `VENTAS_USUARIOS_INTERNAL_TOKEN`. Limita la conexión a tres segundos y la lectura a cinco.

| Resultado de la verificación | Respuesta al configurar la cuenta en Ventas |
| --- | --- |
| Usuario activo y CONTRATISTA | Continúa la validación del cupo y el guardado. |
| Usuario inexistente, inactivo o de otro rol | 409. |
| Error de red, respuesta inválida o credencial rechazada | 503. |
| Adaptador o credencial sin configurar | 503. |

La configuración usa `VENTAS_USUARIOS_URL`, con la URL de Usuarios sin `/api/v1`. El perfil MySQL toma `http://localhost:8081` como valor predeterminado. La verificación precede a la modificación de la cuenta. Ventas administra habilitación, cupo y saldo.

## 5. Integración con React

| Archivo | Comportamiento |
| --- | --- |
| [userApiService.js](../frontend/src/services/userApiService.js) | Solicitudes REST de autenticación, perfil y administración. Límite de espera de diez segundos y propagación de errores. |
| [AuthContext.jsx](../frontend/src/context/AuthContext.jsx) | Sesión mediante `auth_token`, consulta de `usuarios/me`, cierre de sesión y sincronización entre pestañas. |
| `ProtectedRoute.jsx` | Espera la validación del perfil y comprueba los roles de acceso. |
| `Login.jsx` y `Register.jsx` | Formularios asíncronos con validación, estado de carga y errores visibles. |
| `AdminDashboard.jsx` | Listado, alta, edición, cambio de rol y desactivación confirmados por la API. |

El cliente recibe `VITE_API_USUARIOS_URL`, con valor predeterminado `http://localhost:8081/api/v1`. El token también es utilizado por el cliente de catálogo para las solicitudes protegidas de Ventas.

La sesión se revalida al recargar, volver a la pestaña y detectar cambios de sesión en otra pestaña. Un 401 de Usuarios elimina la sesión. Una interrupción de red ofrece Reintentar conservando el token. Los errores de registro o gestión mantienen los campos del formulario.

Usuarios aparece en el panel del administrador. El vendedor consulta productos y pedidos, con los controles de catálogo en modo de lectura. El registro y el mantenedor envían exclusivamente datos de perfil. La configuración financiera corresponde a Ventas.

## 6. Ejecución y verificación

La [guía del backend](../backend/README.md) explica la preparación de MySQL, claves y credenciales. La [guía del frontend](../frontend/README.md) documenta Vite y sus variables.

| Verificación | Resultado registrado |
| --- | --- |
| Usuarios, Maven | 6 pruebas aprobadas, incluidas las de arranque y seguridad en Swagger. |
| Ventas, Maven | 19 pruebas aprobadas, incluidas la consulta administrativa de crédito y la seguridad declarada en Swagger. |
| React, Vitest | 118 pruebas aprobadas en 19 archivos. |
| Vite | Compilación de producción correcta. |
| Oxlint | 0 errores y 9 advertencias de efectos y exportaciones de contextos. |

Las pruebas automatizadas del backend usan H2. El recorrido de MySQL y las comprobaciones de navegador se documentan por separado.

- [Resultados de la revisión integrada de fase 3](../../docs/APIs%20e%20Integracion/evidencias/resultados-automaticos-v3.txt).
- [Pruebas de APIs y transacciones con MySQL](PRUEBAS_MYSQL.md).
- [Pruebas de React con Usuarios y MySQL](PRUEBAS_REACT_USUARIOS_MYSQL.md).

## 7. Alcance de la integración

Usuarios y las operaciones comerciales de React están integrados con MySQL mediante las APIs de Usuarios y Ventas. Catálogo, checkout, pedidos y crédito usan respuestas del servidor; el carrito permanece local. La revalidación de sesión posterior conserva formularios y las imágenes se normalizan antes de mostrar y cachear. Los métodos locales de `userService` se conservan para validaciones y antecedentes de pruebas; las cuentas de la aplicación integrada se autentican por API.

La revisión del 05/11 está en [docs](../../docs/README.md), con 118 pruebas de React y 25 del backend como evidencia histórica. Las pruebas Java usan H2 y las verificaciones de MySQL se registran por separado.

## Actualización documental del 13 de noviembre de 2026

Los resultados anteriores corresponden a su fecha de comprobación. La suite vigente del frontend conserva tres reglas unitarias por el ajuste docente documentado en su README; el informe de pruebas 3.1 registra tres aprobadas y 2,02 % de líneas. El login común redirige ADMIN y VENDEDOR al panel y la barra pública ya no ofrece un acceso administrativo separado. Los contratos y controles del backend se conservan. Consultar el [índice de documentos actualizado](../../docs/README.md) para el manual, ERS y límites de estas verificaciones.

## Verificación del despliegue del 14 de noviembre de 2026

El frontend se actualizó en EC2 con respaldo previo y sin modificar los microservicios ni las bases. Se comprobaron cinco contenedores saludables, login, catálogo UTF-8 y conservación de datos y claves. Las acciones de usuarios contratistas conservan texto e iconos y un mínimo táctil de 44 px en móvil; su visualización se confirmó en iPhone 15 Pro, Zen y Chrome. Esta comprobación visual es independiente de las suites automatizadas.
