# Propuesta de backend para Los Maestros

## Decisión propuesta

Implementar **dos aplicaciones Spring Boot independientes**, Usuarios y Ventas, y conectarlas al frontend React existente mediante REST y JSON. Es una propuesta del equipo para mantener el alcance sencillo: el anexo de instrucciones revisado exige Spring Boot, persistencia, API y seguridad, pero no fija una cantidad de microservicios.

Separar productos, inventario, pedidos y crédito en cuatro servicios obligaría a coordinar escrituras entre aplicaciones cuando se compra o se anula. Mantener esas operaciones juntas permite usar una transacción local y reduce el trabajo de recuperación ante fallos.

## Responsabilidades

| Servicio | Alcance | Relación con el frontend actual |
| --- | --- | --- |
| Usuarios, puerto propuesto 8081 | Registro, inicio de sesión, emisión de JWT, perfil y administración de usuarios y roles | `userService.js`, `credentialService.js`, `AuthContext.jsx`, registro, login y usuarios del panel |
| Ventas, puerto propuesto 8082 | Categorías, productos, stock, pedidos y detalles, cálculo de despacho, cuenta corriente y anulación | `productService.js`, `orderService.js`, `shippingService.js`, catálogo, checkout, historial y panel |

El carrito, las páginas informativas, el blog, las imágenes locales y la cobertura visual siguen en React. El carrito puede conservarse localmente. Productos, pedidos, usuarios y crédito pasan a tener su fuente de verdad en el servidor. Los pagos continúan simulados.

La cuenta corriente se asocia a un usuario mediante su identificador, pero su cupo, habilitación y saldo pertenecen a Ventas. Usuarios no modifica saldos. El registro público no puede asignar ADMIN o VENDEDOR ni habilitar crédito por sí mismo.

## Persistencia e integración

Propuesta: MySQL, con dos bases lógicas y credenciales separadas en una misma instancia local. Cada servicio accede únicamente a sus tablas; no se crean consultas ni claves foráneas entre bases.

| Base lógica | Entidades iniciales |
| --- | --- |
| `losmaestros_usuarios` | Usuario: RUN, nombre, correo único, contraseña cifrada mediante hash, rol, estado y datos de contacto |
| `losmaestros_ventas` | Categoría, Producto, Pedido, DetallePedido, CuentaCorriente |

Categoría tiene productos; pedido tiene detalles; cada detalle referencia un producto y guarda el precio aplicado. CuentaCorriente tiene un `usuarioId` único. Pedido guarda `usuarioId` y los datos de contacto necesarios para conservar el comprobante. El pedido es el equivalente funcional de la boleta sugerida por el anexo; no constituye una boleta tributaria electrónica.

Ventas valida la firma, vencimiento y roles del JWT emitido por Usuarios. Como propuesta sencilla, Usuarios firma con clave privada y ambos servicios validan con la pública configurada; no se requiere consultar Usuarios en cada petición. Cuando el administrador habilita una cuenta corriente, Ventas consulta una ruta interna autenticada de Usuarios para verificar que exista y sea contratista. Si Usuarios no está disponible, esa habilitación falla sin cambios. No se elimina físicamente un usuario con historial: se desactiva. La desactivación y cambios de rol requieren definir una política de tokens breves y nueva sesión; no se promete revocación inmediata con JWT sin estado.

En Ventas, confirmar un pedido debe recalcular precios y despacho, comprobar existencias y cupo, guardar pedido y detalles, descontar stock y cargar crédito en **una transacción**. Usar bloqueo de los registros afectados para impedir que dos compras consuman el mismo stock o cupo. Anular debe restituir stock y crédito una sola vez, dentro de otra transacción. El backend obtiene identidad y rol del token, nunca de valores enviados por el formulario.

## API inicial propuesta

Todas las rutas son orientativas para que el equipo las implemente, no forman parte de las plantillas. Usar `/api/v1`, errores JSON y documentación Swagger por servicio. Conservar los nombres del frontend mediante adaptación o DTO cuando ayude a la migración.

| Servicio | Método y ruta | Acceso y función |
| --- | --- | --- |
| Usuarios | `POST /api/v1/auth/registro` | Público; crea cliente o contratista sin privilegios administrativos |
| Usuarios | `POST /api/v1/auth/login` | Público; devuelve JWT y perfil seguro |
| Usuarios | `GET /api/v1/usuarios/me` | Usuario autenticado; perfil propio |
| Usuarios | `GET /api/v1/usuarios`, `GET /api/v1/usuarios/{id}` | ADMIN; listado y detalle |
| Usuarios | `POST /api/v1/usuarios`, `PUT /api/v1/usuarios/{id}`, `DELETE /api/v1/usuarios/{id}` | ADMIN; alta, edición y desactivación |
| Usuarios | `GET /api/v1/interno/usuarios/{id}` | Credencial de servicio; existencia, estado y rol para Ventas |
| Ventas | `GET /api/v1/categorias`, `GET /api/v1/productos`, `GET /api/v1/productos/{id}` | Público; consulta y filtros |
| Ventas | `POST /api/v1/productos`, `PUT /api/v1/productos/{id}`, `DELETE /api/v1/productos/{id}` | ADMIN; gestión y baja lógica para conservar historial |
| Ventas | `POST /api/v1/pedidos` | Autenticado; compra con identidad del JWT |
| Ventas | `GET /api/v1/pedidos`, `GET /api/v1/pedidos/{id}` | ADMIN y VENDEDOR ven todos; cliente y contratista solo los propios |
| Ventas | `PATCH /api/v1/pedidos/{id}/estado` | ADMIN; avance o anulación validada |
| Ventas | `GET /api/v1/cuentas-corrientes/me` | CONTRATISTA; saldo y cupo propios |
| Ventas | `PUT /api/v1/cuentas-corrientes/{usuarioId}` | ADMIN; habilitación y cupo, sin editar saldo arbitrariamente |

Para la primera integración se propone exigir sesión al confirmar compra. La fase 2 permite invitados: este cambio debe quedar explícito en el ERS y el checkout. Si el equipo conserva invitados, deberá diseñar un comprobante con acceso temporal seguro; un número de pedido por sí solo no autoriza su consulta.

## Permisos que deben corregirse

El anexo 1, página 2, permite al vendedor **consultar productos y órdenes con su detalle** y exige ocultar los demás accesos. La fase 2 le permite gestionar inventario y pedidos. Para fase 3 se propone aplicar la instrucción nueva tanto en React como en Spring Security:

| Perfil | Permisos propuestos |
| --- | --- |
| ADMIN | Administración de usuarios, productos, pedidos y cupos |
| VENDEDOR | Consulta de productos y pedidos; sin escrituras ni administración de usuarios |
| CLIENTE | Tienda, compra y pedidos propios |
| CONTRATISTA | Tienda y pedidos propios, más crédito habilitado; perfil heredado del caso, no nombrado en el anexo nuevo |

Confirmar con el docente la continuidad de CONTRATISTA como especialización del cliente. El plan lo conserva por su presencia en el caso y frontend. No se debe eliminar silenciosamente esa funcionalidad ni extenderle acceso al panel.

## Alcance técnico sencillo

Cada servicio tendrá controladores, servicios de negocio, repositorios JPA, entidades, DTO, validaciones, configuración de seguridad y manejo de errores. Compartir convenciones, sin crear un tercer proyecto de utilidades por ahora.

Las plantillas incluyen Spring Web, JPA, Security, soporte JWT, validación, controlador MySQL, H2 local y documentación OpenAPI. Se fijaron Java 17, Spring Boot 3.5.16 y springdoc 2.10.0 en ambos servicios. La seguridad de negocio sigue pendiente.

Referencias técnicas de configuración: [requisitos de Spring Boot 3.5](https://docs.spring.io/spring-boot/3.5/system-requirements.html) y [compatibilidad de springdoc 2.x](https://springdoc.org/v2/). Maven Wrapper se obtuvo de Spring Initializr; los POM se ajustaron a la línea 3.5.

No se proponen Gateway, Eureka, Kafka, Kubernetes, servidor de configuración, servicio de pagos, servicio de despacho ni servicio de reportes. Los indicadores iniciales pueden salir de Ventas. Docker/AWS figuran en el ERS previo: se conservan como pendientes por contrastar con la pauta completa, sin convertirlos en trabajo adicional para esta preparación.

## Base de la propuesta

- Anexo 1 del profesor, páginas 1–3: requisitos técnicos, permisos, modelo sugerido y entrega. Archivos originales en `referencias-profesor/`.
- Anexos 2 y 3: formato de documentación de API e integración, con ejemplos que deben reemplazarse por datos del proyecto.
- Anexo 4: estructura del manual y evidencias con número, título, imagen y nota.
- `docs/ERS actualizado (v2)/ERS_actualizado_v2.md`: reglas de compra, stock, cuenta corriente, permisos y requisitos pendientes.
- `fase 2/proyecto_Etapa2_REACT/src/services/`: implementación local revisada de usuarios, productos, despacho y pedidos.

Esta preparación no acredita cumplimiento de la evaluación: faltan implementación, pruebas, documentación final y evidencia de integración.
