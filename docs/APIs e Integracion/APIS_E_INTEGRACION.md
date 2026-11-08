# APIs e integración de Ferretería Los Maestros

> Documento de entrega y evidencia de la revisión indicada en el informe. Las referencias a AWS pendiente describen ese momento: el equipo confirmó posteriormente el despliegue. Para operación actual, consultar la [guía de despliegue](<../../Fase 3/despliegue/README.md>). Los resultados medidos y los archivos Word/Excel se conservan como registro de entrega.

Revisión 3.0 del 5 de noviembre de 2026.

[Documento Word](<APIs_e_Integracion_Los_Maestros_v3.docx>) · [Índice de documentación](../README.md)

Documentación APIs e Integración

Ferretería Los Maestros

Título: APIs e integración de Ferretería Los Maestros

Versión del Documento: 3.0

Fecha de revisión: 05/11/2026

## 1 Descripción General

La fase 3 integra React con Usuarios y Ventas mediante APIs REST versionadas. Usuarios autentica y mantiene perfiles; Ventas concentra catálogo, inventario, pedidos y cuenta corriente. Este documento está dirigido al equipo y al docente para comprender la integración y reproducir sus pruebas. La operación se verificó localmente con MySQL y datos ficticios.

Integrantes: Sebastián Diaz, Jeremy Hanglin y Martín Caviedes. Revisión: 05/11/2026. Las capturas documentan recorridos realizados en el entorno de desarrollo; no corresponden a un despliegue público.

## 2 Información General

| Recurso | Dirección local |
| --- | --- |
| React | http://localhost:5173 |
| API Usuarios | http://localhost:8081/api/v1 |
| Swagger Usuarios | http://localhost:8081/swagger-ui.html |
| OpenAPI Usuarios | http://localhost:8081/v3/api-docs |
| API Ventas | http://localhost:8082/api/v1 |
| Swagger Ventas | http://localhost:8082/swagger-ui.html |
| OpenAPI Ventas | http://localhost:8082/v3/api-docs |
| MySQL | localhost:3307; bases losmaestros_usuarios y losmaestros_ventas |

El repositorio fuente es JeremyDylan122/LosMaestros. El frontend y el backend actuales están en carpetas separadas dentro de Fase 3. La pauta solicita enlaces y comprimidos de ambos proyectos; su publicación o separación de repositorios y el envío de archivos siguen siendo tareas de entrega, no un resultado de este informe.

## 3 Modelo de datos e integración entre servicios

| Base y tabla | Clave y relación | Responsabilidad |
| --- | --- | --- |
| Usuarios: usuarios | PK id; RUN y correo únicos | Perfil, hash BCrypt, rol y activo. |
| Ventas: categorias | PK id | Familias y estado activo. |
| Ventas: productos | PK id; FK categoria_id → categorias.id | Datos comerciales, precio, descuento, stock y mínimo; baja lógica. |
| Ventas: pedidos | PK id; usuario_id lógico | Datos de cliente y entrega, estados y montos históricos. |
| Ventas: detalle_pedido | PK (pedido_id,posicion); FK pedido_id → pedidos.id | Líneas ordenadas con producto_id lógico, código, nombre, cantidad y precio histórico. |
| Ventas: cuentas_corrientes | PK usuario_id lógico | Activación, cupo, saldo y versión de concurrencia. |

Cada categoría tiene varios productos y cada pedido varias líneas. Los identificadores de usuario entre bases no tienen una clave foránea cruzada: se enlazan mediante el sub del JWT y la consulta HTTP interna. producto_id del detalle es una referencia lógica sin FK de catálogo en el SQL actual. La línea copia código, nombre y precio para preservar la venta aunque se edite el catálogo.

Los importes son DECIMAL(19,2) en MySQL y BigDecimal en Java. Producto, pedido y cuenta utilizan versión para concurrencia; Ventas bloquea los recursos que modifica. Pedido, stock y crédito comparten la misma base y transacción. La configuración de crédito consulta antes a Usuarios; no existe una transacción distribuida entre los dos servicios.

Scripts reproducibles: usuarios-service/database/usuarios-mysql.sql, ventas-service/database/jeremy-catalogo-mysql.sql y ventas-service/database/seba-mysql.sql. El script preparar-mysql.ps1 los carga y crea usuarios de aplicación con permisos sobre su propia base. El modelo mantiene instantáneas históricas en el detalle; no se presenta una demostración formal de tercera forma normal.

## 3.1 Recorrido de una compra

- 1. React obtiene el catálogo de Ventas y conserva el carrito local. Usuarios devuelve un JWT y perfil al autenticar.

- 2. React envía a POST /pedidos los identificadores, cantidades, datos de entrega y medio de pago junto con Bearer JWT. No envía precios ni identidad como fuente de autoridad.

- 3. Ventas toma el usuario del token, bloquea y valida productos, calcula precio efectivo y despacho y comprueba crédito si corresponde.

- 4. Una transacción guarda pedido y líneas, reduce stock y aumenta saldo. Una excepción revierte todas las escrituras. React vacía el carrito solo tras recibir 201.

- 5. PATCH de ADMIN anula una orden abierta, restituye existencias y crédito y conserva el historial. Repetir el mismo estado no duplica efectos.

## 4 Seguridad y convenciones REST

Las rutas de negocio usan /api/v1. Las consultas privadas llevan Authorization: Bearer con JWT RS256, emisor losmaestros-usuarios, sub numérico como texto, roles sin prefijo ROLE_ y expiración a 30 minutos. Usuarios posee la clave privada; Ventas utiliza la pública. No se publican claves, tokens reales ni contraseñas de entorno.

La consulta GET /api/v1/interno/usuarios/{id} utiliza X-Service-Token, configurado mediante USUARIOS_INTERNAL_TOKEN y VENTAS_USUARIOS_INTERNAL_TOKEN. Devuelve únicamente id, activo y rol. Ventas rechaza configurar crédito si el usuario no existe, está inactivo o no es contratista; si la dependencia falla responde 503.

| Perfil | Permisos de negocio |
| --- | --- |
| Público | Lecturas de catálogo, ofertas, stock crítico y categorías; registro y login. |
| CLIENTE | Crear compras y consultar pedidos propios. |
| CONTRATISTA | Funciones de cliente y consulta de cuenta propia; crédito sujeto a habilitación y cupo. |
| VENDEDOR | Consultar productos y todos los pedidos con sus detalles; sin escrituras. |
| ADMIN | CRUD de usuarios y catálogo, consulta general de pedidos, cambio de estados y configuración/consulta de cuentas. |

React comprueba usuarios/me al restaurar sesión y al recuperar el foco; la revalidación posterior conserva páginas y formularios autorizados. El cierre se sincroniza entre pestañas. Ventas valida los roles incluidos en el JWT hasta vencer, sin revocación inmediata ni consulta de perfil por cada operación. Las peticiones rechazadas siguen protegidas por Spring Security.

Las rutas responden 201 en altas, 200 en consultas y cambios y 204 en bajas lógicas. Errores: 400 datos inválidos; 401 autenticación; 403 permiso; 404 recurso no visible; 409 conflicto y 503 dependencia. Los errores de negocio usan mensaje; los de seguridad pueden carecer de cuerpo. La paginación usa content y totalPages, con size máximo 100. CORS admite el origen local.

## 4.1 Uso de Swagger

Abrir Swagger del servicio, iniciar sesión por /auth/login en Usuarios y copiar únicamente el token de la respuesta. Usar Authorize con bearerAuth para probar las rutas privadas. En la consulta interna de Usuarios usar serviceToken con la credencial configurada, únicamente desde el entorno técnico. Nunca adjuntar tokens ni secretos a capturas compartidas.

## 5 Documentación de Endpoints

El archivo Documentacion_APIs_Los_Maestros_v3.xlsx conserva las columnas de la plantilla docente y detalla las 26 operaciones. Las rutas y permisos de esta sección se contrastaron con los controladores y reglas de Spring Security; Swagger es la descripción ejecutable del servicio.

## 5.1 Servicio Usuarios

POST /api/v1/auth/registro

Registrar cliente o contratista. Entrada: UsuarioRequest; password obligatorio. Respuestas: 201; 400; 409. Autenticación: No. Roles: Sin sesión. Devuelve {token,usuario}; no permite ADMIN/VENDEDOR ni habilita crédito.

POST /api/v1/auth/login

Autenticar cuenta activa. Entrada: {email,password}. Respuestas: 200; 400; 401. Autenticación: No. Roles: Sin sesión. JWT RS256 de 30 minutos y perfil sin credenciales.

GET /api/v1/usuarios/me

Obtener perfil autenticado. Entrada: Sin cuerpo. Respuestas: 200; 401. Autenticación: Bearer JWT. Roles: ADMIN, VENDEDOR, CLIENTE, CONTRATISTA. Comprueba perfil y cuenta activa en Usuarios.

GET /api/v1/usuarios

Listar cuentas. Entrada: Sin cuerpo. Respuestas: 200; 401; 403. Autenticación: Bearer JWT. Roles: ADMIN. Incluye cuentas activas e inactivas.

GET /api/v1/usuarios/{id}

Consultar cuenta por id. Entrada: id numérico. Respuestas: 200; 401; 403; 404. Autenticación: Bearer JWT. Roles: ADMIN.

POST /api/v1/usuarios

Crear cuenta administrativa. Entrada: UsuarioRequest. Respuestas: 201; 400; 401; 403; 409. Autenticación: Bearer JWT. Roles: ADMIN.

PUT /api/v1/usuarios/{id}

Actualizar perfil y rol. Entrada: id y UsuarioRequest completo. Respuestas: 200; 400; 401; 403; 404; 409. Autenticación: Bearer JWT. Roles: ADMIN. No es PATCH. Omitir nueva clave conserva la existente.

DELETE /api/v1/usuarios/{id}

Desactivar cuenta. Entrada: id numérico. Respuestas: 204; 401; 403; 404. Autenticación: Bearer JWT. Roles: ADMIN. Baja lógica; conserva registro e historial.

GET /api/v1/interno/usuarios/{id}

Verificar perfil para crédito. Entrada: id y cabecera interna. Respuestas: 200; 401; 404. Autenticación: X-Service-Token. Roles: Servicio Ventas. Devuelve {id,activo,rol}; no se expone al flujo de React.

## 5.2 Servicio Ventas

GET /api/v1/productos

Consultar catálogo paginado. Entrada: categoriaId, enOferta, buscar, page, size, sort. Respuestas: 200. Autenticación: No. Roles: Sin sesión. Page de ProductoResponseDto; size máximo 100. React recorre páginas.

GET /api/v1/productos/{id}

Consultar detalle. Entrada: id numérico. Respuestas: 200; 404. Autenticación: No. Roles: Sin sesión. Incluye activo; React no presenta productos inactivos.

GET /api/v1/productos/criticos

Consultar stock crítico. Entrada: Sin cuerpo. Respuestas: 200. Autenticación: No. Roles: Sin sesión. Lista de productos activos con stock <= mínimo.

GET /api/v1/productos/ofertas

Consultar ofertas. Entrada: Sin cuerpo. Respuestas: 200. Autenticación: No. Roles: Sin sesión. Lista de productos activos en oferta.

POST /api/v1/productos

Crear producto. Entrada: ProductoCreacionDto. Respuestas: 201; 400; 401; 403; 404; 409. Autenticación: Bearer JWT. Roles: ADMIN. categoriaId se obtiene de la API; no suponer ids.

PUT /api/v1/productos/{id}

Editar producto. Entrada: id y ProductoActualizacionDto completo. Respuestas: 200; 400; 401; 403; 404; 409. Autenticación: Bearer JWT. Roles: ADMIN.

PATCH /api/v1/productos/{id}/stock

Ajustar stock. Entrada: {delta: entero distinto de cero}. Respuestas: 200; 400; 401; 403; 404; 409. Autenticación: Bearer JWT. Roles: ADMIN. No permite stock final negativo.

DELETE /api/v1/productos/{id}

Dar de baja producto. Entrada: id numérico. Respuestas: 204; 401; 403; 404. Autenticación: Bearer JWT. Roles: ADMIN. Baja lógica activo=false.

GET /api/v1/categorias

Listar familias. Entrada: Sin cuerpo. Respuestas: 200. Autenticación: No. Roles: Sin sesión. Incluye id, nombre, descripción, activo y totalProductos.

POST /api/v1/categorias

Crear categoría. Entrada: {nombre,descripcion}. Respuestas: 201; 400; 401; 403; 409. Autenticación: Bearer JWT. Roles: ADMIN. Disponible por API; el panel presenta consulta de familias.

POST /api/v1/pedidos

Confirmar compra. Entrada: CompraRequest con items [{id,cantidad}]. Respuestas: 201; 400; 401; 403; 404; 409; 503. Autenticación: Bearer JWT. Roles: ADMIN, CLIENTE, CONTRATISTA. Identidad del JWT; precio, stock, crédito y despacho del servidor.

GET /api/v1/pedidos

Consultar historial paginado. Entrada: page, size. Respuestas: 200; 401; 403. Autenticación: Bearer JWT. Roles: ADMIN, VENDEDOR, CLIENTE, CONTRATISTA. Personal ve todas las órdenes; cliente/contratista solo propias.

GET /api/v1/pedidos/{id}

Consultar comprobante. Entrada: id numérico. Respuestas: 200; 401; 403; 404. Autenticación: Bearer JWT. Roles: ADMIN, VENDEDOR, CLIENTE, CONTRATISTA. Pedido ajeno devuelve 404 para cliente/contratista.

PATCH /api/v1/pedidos/{id}/estado

Actualizar o anular pedido. Entrada: {estado: valor permitido}. Respuestas: 200; 400; 401; 403; 404; 409. Autenticación: Bearer JWT. Roles: ADMIN. Anular devuelve stock y crédito una sola vez; terminales no se reabren.

GET /api/v1/cuentas-corrientes/me

Consultar cuenta propia. Entrada: Sin cuerpo. Respuestas: 200; 401; 403; 404. Autenticación: Bearer JWT. Roles: CONTRATISTA. 404 significa cuenta todavía no creada; no deuda cero confirmada.

GET /api/v1/cuentas-corrientes/{usuarioId}

Consultar cuenta administrativa. Entrada: usuarioId numérico. Respuestas: 200; 401; 403; 404. Autenticación: Bearer JWT. Roles: ADMIN. Incluye activa, creditoMaximo, saldoPendiente y creditoDisponible.

PUT /api/v1/cuentas-corrientes/{usuarioId}

Configurar cuenta. Entrada: {activa,creditoMaximo}. Respuestas: 200; 400; 401; 403; 409; 503. Autenticación: Bearer JWT. Roles: ADMIN. Verifica contratista activo en Usuarios; cupo no inferior a deuda. No edita saldo.

## 5.3 Contratos de datos y ejemplos

| Contrato | Campos y reglas |
| --- | --- |
| UsuarioRequest | run, nombre, apellidos, email, password, rol, region, comuna, direccion, empresa. RUN Módulo 11, correo permitido y duplicados validados. Registro/alta requieren clave; edición puede conservarla. Perfil de salida omite password y hash. |
| ProductoCreacionDto | codigo, nombre, categoriaId, subcategoria, marca, unidad, precio, precioCompra, stock, stockMinimo, enOferta, descuento, descripcion, imagen, especificaciones. ProductoActualizacionDto omite codigo e incorpora activo; el id del recurso está en la ruta. Respuesta agrega id, categoriaNombre, precioEfectivo, stockCritico y activo. |
| CompraRequest | items [{id,cantidad}], deliveryType, paymentMethod, customerName, customerEmail, region, commune, address, phone, empresa y notes. Cantidades enteras positivas. deliveryType: RETIRO_TIENDA o DESPACHO_OBRA. paymentMethod: WEBPAY_SIMULADO, TRANSFERENCIA o CUENTA_CORRIENTE. |
| PedidoResponse | id, codigoOrden, userId, fecha, estado, estadoPago, deliveryType, paymentMethod, datos de cliente/entrega, subtotal, shippingFee, totalMonto e items [{id,codigo,nombre,precioUnitario,cantidad,subtotal}]. Los importes se conservan como números JSON. |
| CuentaResponse | usuarioId, activa, creditoMaximo, saldoPendiente y creditoDisponible. PUT recibe únicamente {activa,creditoMaximo}; la deuda cambia por compras y anulaciones. |
| Estados | CONFIRMADO → EN_PREPARACION → DESPACHADO → ENTREGADO. Se permite avanzar saltando estados y anular antes del cierre. ENTREGADO y ANULADO son terminales. Webpay devuelve PAGADO_SIMULADO, transferencia PENDIENTE_TRANSFERENCIA, crédito PENDIENTE_FIN_DE_MES y la anulación ANULADO. |

## 5.4 Ejemplo reproducible de consulta y compra

Primero obtener un id activo mediante GET /productos y una categoría mediante GET /categorias. Los ids de los ejemplos son ilustrativos y no deben suponerse fijos. Usar una cuenta ficticia creada para la prueba y un token vigente.

POST /api/v1/auth/login con {"email":"cliente@gmail.com","password":"clave123"}. Respuesta esperada: {"token":"<JWT de la respuesta>","usuario":{"id":4,"rol":"CLIENTE",...}}. La cuenta del ejemplo debe crearse previamente; no es una credencial preinstalada.

POST /api/v1/pedidos con Authorization: Bearer <JWT> y {"items":[{"id":7,"cantidad":1}],"deliveryType":"RETIRO_TIENDA","paymentMethod":"WEBPAY_SIMULADO","customerName":"Cliente de prueba","customerEmail":"cliente@gmail.com"}. Respuesta: 201 con PedidoResponse; consultar luego el id devuelto.

Para crédito, ADMIN configura PUT /cuentas-corrientes/{usuarioId} con {"activa":true,"creditoMaximo":100000}. El contratista consulta /cuentas-corrientes/me y compra usando CUENTA_CORRIENTE. Para revertir, ADMIN envía PATCH /pedidos/{id}/estado con {"estado":"ANULADO"}.

## 6 Integración con el Frontend

| Componente | Comunicación y resultado |
| --- | --- |
| apiService | fetch, JSON, límite de espera de 10 s y propagación de errores. 401 retira la sesión correspondiente. |
| AuthContext y userApiService | Registro/login, perfil y mantenedor de usuarios. Revalidación posterior en segundo plano. |
| productService y páginas públicas | Carga REST, todas las páginas, normalización de categoriaNombre y referencias de imágenes antes de mostrar y cachear. |
| CartContext | Cantidades y carrito locales; consulta la caché de catálogo para imagen y precio. Ventas vuelve a comprobar al comprar. |
| Checkout y orderService | POST de compra; preserva carrito ante error y evita dos envíos simultáneos desde el formulario. |
| MyOrders y CheckoutSuccess | Historial, cuenta y comprobante recuperados desde Ventas, con carga, error y reintento. |
| AdminDashboard | Listas y cambios REST. VENDEDOR consulta; ADMIN modifica catálogo, usuarios, estados y cupos. |

Un fallo de red no se transforma en una escritura local exitosa. El servidor devuelve el id definitivo y sus datos; React los conserva. Un catálogo vacío real se muestra vacío. La consulta de cuenta inexistente (404) se distingue de un fallo de dependencia. No hay actualización continua: volver a consultar o navegar recupera cambios de otras operaciones.

## 6.1 Evidencia de consulta y confirmación

Figura 1  Consulta del catálogo

![Captura de la aplicación](<../Manual de usuario/imagenes/catalogo.png>)

Nota. La cabecera permite cambiar de sección. Cada tarjeta identifica código, nombre, marca, stock, precio y acciones de detalle y carrito. Las imágenes son referenciales.

Figura 2  Confirmación del pedido

![Captura de la aplicación](<../Manual de usuario/imagenes/exito.png>)

Nota. Después de aceptar la compra, el carrito queda vacío y se muestra el código de orden y su estado. El cargo a crédito queda pendiente de fin de mes.

## 6.2 Evidencia de crédito y anulación

Figura 3  Historial y crédito propio

![Captura de la aplicación](<../Manual de usuario/imagenes/historial.png>)

Nota. El pedido LM-2026-0003 de $77.473,5 deja saldo pendiente por ese monto y crédito disponible de $22.526,5 sobre un cupo de $100.000.

Figura 4  Saldo después de anular

![Captura de la aplicación](<../Manual de usuario/imagenes/anulado.png>)

Nota. El pedido figura ANULADO y el crédito vuelve a $100.000 con deuda cero. La anulación mantiene el registro histórico.

## 6.3 Evidencia de comprobante y consistencia visual

Figura 5  Comprobante administrativo

![Captura de la aplicación](<../Manual de usuario/imagenes/comprobante.png>)

Nota. El detalle conserva cantidades, precio unitario, subtotales, despacho y total. El pedido anulado de dos atornilladores registra productos por $77.382 y despacho por $14.990.

Figura 6  Revisión del carrito

![Captura de la aplicación](<../Manual de usuario/imagenes/carrito.png>)

Nota. Los botones menos y más cambian cantidades; la papelera elimina una línea. El resumen muestra subtotal y el acceso al checkout. El despacho se calcula en la compra.

## 7 Pruebas y resultados de comunicación

| Comprobación | Resultado registrado | Alcance |
| --- | --- | --- |
| React Vitest | 118 aprobadas en 19 archivos | Servicios REST, sesión, acceso, formularios, navegación, carrito y regresiones de integración. |
| Usuarios Maven | 6 aprobadas | Autenticación, roles, baja, consulta interna y Swagger; H2. |
| Ventas Maven | 19 aprobadas | Catálogo, pedidos, transacciones, crédito, adaptador HTTP y Swagger; H2. |
| Compilación | Vite y ambos JAR correctos | Verificación local; no prueba de despliegue AWS. |
| Oxlint | 0 errores y 9 advertencias | Efectos y exportaciones de contextos; no se afirma ausencia de advertencias. |
| MySQL y APIs reales | Compra, rollback, persistencia, anulación y concurrencia controlada comprobados | Evidencias existentes y prueba adicional de descuento decimal y crédito con despacho. |
| Recorrido manual de React | Compra, vaciado, historial, saldo, anulación y stock comprobados | Realizado por Martín; capturas incluidas. |
| Correcciones posteriores | Foco, comprobante e imágenes confirmados manualmente | Regresiones automatizadas añadidas; sin repetir auditoría móvil completa. |

La prueba adicional de API con MySQL creó un producto ficticio de $999 con 10 % de descuento. Ventas calculó $899,10 y despacho $4.990, total $5.889,10, ignorando montos del cliente. La anulación repetida restituyó stock y dejó deuda cero; el producto ficticio fue dado de baja. El recorrido manual posterior confirmó una orden a crédito por $77.473,5 y devolución del cupo de $100.000 al anular.

El conjunto automatizado de backend usa H2 y, en casos concretos, autenticación simulada. La integración con JWT firmado y MySQL se comprobó por separado. La prueba de concurrencia fue acotada; no equivale a una prueba de carga. El informe de cobertura de fase 2 registra sus métricas históricas y no se recalculó como parte de este documento.

## 7.1 Reproducción

- 1. Preparar .env, claves y bases con Fase 3/backend/README.md; iniciar Usuarios, Ventas y React.

- 2. Ejecutar .\mvnw.cmd test en cada servicio y npm test -- --run en frontend. Para compilar: .\mvnw.cmd package y npm run build. Para lint: npm run lint.

- 3. Registrar una cuenta ficticia, autenticarla y guardar el JWT fuera de las capturas. Consultar catálogo y perfil desde Swagger o cliente HTTP.

- 4. Como ADMIN, habilitar crédito de un contratista; confirmar una compra con despacho y comprobar precio, stock y deuda. Anular y comprobar restitución; repetir la anulación para validar idempotencia.

- 5. Intentar escritura como VENDEDOR y acceso a pedido ajeno como CLIENTE; comprobar 403 y 404, respectivamente. Probar stock/cupo insuficientes y verificar que no queden escrituras parciales.

- 6. Recargar y reiniciar servicios sin borrar el volumen para comprobar persistencia. El manual describe el recorrido de pantalla; los archivos de evidencia registran resultados del entorno verificado.

## 7.2 Evidencias y límites de entrega

Las evidencias se conservan en Fase 3/documentacion/evidencias/martin y en esta carpeta. Los archivos resultados-automaticos-v3.txt y resultados-integracion-v3.txt resumen las ejecuciones verificadas. Las capturas se comparten como parte de la documentación, sin credenciales ni claves privadas.

Siguen pendientes los reportes por período, geocodificación exacta, video, cobros reales y despliegue completo en AWS. La exportación o separación final de frontend/backend, los comprimidos, la publicación de cambios y su entrega al docente no se realizan automáticamente por generar estos documentos.
