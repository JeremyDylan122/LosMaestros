# Manual de usuario de Ferretería Los Maestros

Revisión 3.1 del 13 de noviembre de 2026.

[Documento Word](<Manual_Usuario_Los_Maestros_v3.docx>) · [Índice de documentación](../README.md)

Manual de Usuario

Ferretería Los Maestros

Versión del Documento: 3.1

Fecha de revisión: 13/11/2026

## 1 Introducción

Este manual explica cómo consultar la tienda, preparar una compra, revisar pedidos y utilizar el panel según el perfil. Corresponde a la versión integrada de fase 3, con datos persistentes en MySQL. Está dirigido a clientes, contratistas, vendedores y administradores.

Recorra primero Requisitos y Comenzando. Después consulte el procedimiento de su tarea. Las figuras 1 a 11 conservan capturas de los recorridos del 05/11 con cuentas ficticias; documentan las operaciones de negocio y pueden mostrar la cabecera anterior. La sección 7 muestra la navegación vigente del 13/11. Los montos y existencias pueden cambiar al realizar nuevas operaciones.

| Perfil | Acceso disponible |
| --- | --- |
| Visitante | Catálogo, categorías, ofertas, información y carrito. Debe iniciar sesión para comprar. |
| CLIENTE | Compra con Webpay simulado o transferencia; consulta pedidos propios. |
| CONTRATISTA | Funciones de cliente y cuenta corriente, si está habilitada y tiene cupo. |
| VENDEDOR | Consulta productos, existencias, pedidos y comprobantes. |
| ADMIN | Mantiene usuarios, productos, stock, pedidos y cupos. |

## 2 Requisitos del Sistema

Para usar la tienda se necesita un navegador actualizado con JavaScript y almacenamiento local. Puede accederse desde computador, tableta o teléfono. No se requiere instalar una aplicación de escritorio ni un dispositivo especial. La impresión de comprobantes requiere una impresora o la opción Guardar como PDF del navegador.

En el entorno local, el responsable técnico debe tener activos React, Usuarios, Ventas y MySQL. Para preparar ese entorno necesita JDK 17 o superior, Node.js compatible con Vite, Docker Desktop con Compose y PowerShell 7.4 o superior. Las versiones utilizadas y la preparación completa están en Fase 3/backend/README.md y Fase 3/frontend/README.md.

## 3 Instalación y Configuración

La solución se utiliza desde el navegador. La siguiente preparación corresponde al responsable técnico; el usuario final comienza abriendo la dirección de la tienda cuando los servicios ya están disponibles.

- 1. Clonar o descargar el repositorio LosMaestros y entrar en Fase 3/backend.

- 2. Copiar los tres archivos .env.example a .env, definir contraseñas propias y generar el par de claves RSA siguiendo la guía del backend. Configurar la clave pública en Ventas y la credencial interna coincidente en ambos servicios.

- 3. Iniciar Docker Desktop y ejecutar .\preparar-mysql.ps1 desde backend. Comprobar con docker compose ps que MySQL está saludable. El script prepara bases y tablas sin reemplazar el volumen existente.

- 4. En terminales separadas de usuarios-service y ventas-service, ejecutar .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=mysql". Usuarios utiliza 8081 y Ventas 8082.

- 5. Desde Fase 3/frontend, ejecutar npm install y npm run dev. Si se necesitan otras URLs, configurar las variables de .env.example antes de iniciar Vite.

- 6. Abrir http://localhost:5173. Verificar que el catálogo carga y que ambas páginas Swagger responden en http://localhost:8081/swagger-ui.html y http://localhost:8082/swagger-ui.html.

- 7. Para administración inicial, utilizar admin@duoc.cl y la contraseña USUARIOS_ADMIN_PASSWORD configurada en el entorno. Las claves reales no se publican en el manual.

La cuenta inicial se crea si no existe un administrador. El alta pública de un contratista no activa crédito. La persistencia de negocio pertenece a MySQL; borrar los datos del navegador puede cerrar la sesión o perder el carrito, pero no borra los pedidos del servidor.

## 4 Comenzando

## 4.1 Crear una cuenta e iniciar sesión

- 1. Abrir Registro y completar RUN válido, nombre, apellidos, correo, contraseña, región, comuna y dirección. Elegir cliente o contratista según el uso previsto.

- 2. Usar un correo de duoc.cl, profesor.duoc.cl o gmail.com y una contraseña de 4 a 10 caracteres, conforme a las restricciones académicas actuales. Un RUN o correo existente no puede registrarse otra vez.

- 3. En Iniciar Sesión, ingresar correo y contraseña y pulsar Ingresar al Sistema. En móvil, abrir el menú y elegir Ingresar. ADMIN y VENDEDOR son dirigidos al panel; clientes y contratistas continúan en la tienda. Una cuenta desactivada no puede acceder.

- 4. Utilizar el botón de salida para cerrar sesión. La sesión caduca a los 30 minutos; si se solicita acceso nuevamente, iniciar sesión antes de continuar.

Figura 1  Inicio de sesión

![Captura de la aplicación](<imagenes/acceso.png>)

Nota. Introducir correo y contraseña de una cuenta activa y pulsar Ingresar al Sistema. Los datos visibles pertenecen a una cuenta ficticia.

## 4.2 Interfaz de usuario inicial

La barra superior contiene Inicio, Catálogo, Categorías, Ofertas y las páginas informativas. A la derecha aparecen el carrito y el acceso a cuenta. Los visitantes y compradores no ven un botón de Administración. Panel Admin aparece únicamente con sesión de ADMIN o VENDEDOR; en móvil figura como Panel Administrativo dentro del menú. Mis pedidos muestra compras propias. Consulte la sección 7 para ver la cabecera vigente.

En Catálogo, usar búsqueda por nombre o código, categoría, ofertas y orden por precio. Abrir el botón del ojo para consultar la ficha. Añadir incorpora una unidad cuando hay stock. En la ficha puede seleccionarse una cantidad. Las ofertas muestran el precio efectivo con descuento.

Figura 2  Consulta del catálogo

![Captura de la aplicación](<imagenes/catalogo.png>)

Nota. La cabecera permite cambiar de sección. Cada tarjeta identifica código, nombre, marca, stock, precio y acciones de detalle y carrito. Las imágenes son referenciales.

## 5 Uso del Software

## 5.1 Preparar y revisar el carrito

- 1. Añadir los productos desde Catálogo, Ofertas o la ficha. El contador muestra unidades, no códigos diferentes.

- 2. Abrir el icono del carrito. Usar menos o más para cambiar cantidad; la disponibilidad consultada limita el incremento.

- 3. La papelera elimina una línea. Vaciar Todo el Carrito solicita confirmación antes de retirar todos los productos.

- 4. Revisar subtotal y pulsar Proceder al Checkout. Si falta sesión, iniciar sesión. El servidor vuelve a comprobar stock y precio al confirmar.

Figura 3  Revisión del carrito

![Captura de la aplicación](<imagenes/carrito.png>)

Nota. Los botones menos y más cambian cantidades; la papelera elimina una línea. El resumen muestra subtotal y el acceso al checkout. El despacho se calcula en la compra.

## 5.2 Elegir entrega y medio de pago

- 1. Revisar los datos propuestos de la cuenta. Completar teléfono si se necesita coordinación, empresa e indicaciones. Es posible editar los datos para ese pedido.

- 2. Elegir Retiro en Mesón Central o Despacho a Faena. Para despacho, completar región, comuna y dirección.

- 3. La Serena y Coquimbo: $4.990 bajo $100.000 y gratis desde ese monto. Vicuña: $14.990. Si el domicilio guardado está fuera de cobertura, Checkout selecciona retiro gratuito e informa el motivo. Puede elegir despacho e ingresar otra dirección cubierta. Si la dirección elegida no tiene cobertura, usar Continuar con retiro en tienda; no se confirma despacho sin tarifa disponible.

- 4. Elegir Webpay simulado, transferencia o cuenta corriente. El crédito exige CONTRATISTA, cuenta habilitada y cupo suficiente incluyendo despacho. Si el cupo no alcanza, reducir cantidades o elegir otro medio.

- 5. Revisar el total y confirmar una sola vez. Esperar el resultado. Si se informa rechazo, el carrito se conserva. La opción Simular fallo muestra el resultado fallido sin crear un pedido.

Figura 4  Selección del medio de pago

![Captura de la aplicación](<imagenes/pago.png>)

Nota. La cuenta corriente aparece para un contratista con cuenta habilitada. La pantalla informa cupo y deuda. Webpay es simulado y Transferencia registra un pago pendiente.

## 5.3 Comprobar la confirmación

La confirmación muestra código de orden, productos, despacho, total y estados. El carrito queda vacío únicamente después de que Ventas acepta la compra. Puede imprimir el comprobante o regresar a la tienda. Webpay registra un pago simulado; transferencia queda pendiente; crédito queda pendiente a fin de mes. No existe cobro bancario real ni emisión tributaria en esta demostración.

Figura 5  Confirmación del pedido

![Captura de la aplicación](<imagenes/exito.png>)

Nota. Después de aceptar la compra, el carrito queda vacío y se muestra el código de orden y su estado. El cargo a crédito queda pendiente de fin de mes.

## 5.4 Consultar pedidos y cuenta corriente

- 1. Abrir Mis pedidos desde la cabecera. Revisar fecha, monto y estado de cada orden y pulsar Ver detalle del pedido.

- 2. Como contratista, revisar Estado de cuenta, Saldo pendiente y Crédito disponible. Si no existe cuenta, se informa que está pendiente de habilitación.

- 3. Si un administrador anula un pedido a crédito, la deuda disminuye y se restituyen existencias. El pedido permanece en el historial como ANULADO. El cliente no dispone de una acción de anulación.

Figura 6  Historial y crédito propio

![Captura de la aplicación](<imagenes/historial.png>)

Nota. El pedido LM-2026-0003 de $77.473,5 deja saldo pendiente por ese monto y crédito disponible de $22.526,5 sobre un cupo de $100.000.

Figura 7  Saldo después de anular

![Captura de la aplicación](<imagenes/anulado.png>)

Nota. El pedido figura ANULADO y el crédito vuelve a $100.000 con deuda cero. La anulación mantiene el registro histórico.

## 5.5 Consultar el panel y mantener productos

Administrador y vendedor ingresan mediante Iniciar Sesión, igual que los demás perfiles, y son dirigidos al panel. Desde la tienda pueden volver mediante Panel Admin. En teléfono, abrir el menú administrativo; se cierra al elegir una sección, tocar el fondo o pulsar Escape con teclado. Las tablas pueden desplazarse horizontalmente y los formularios verticalmente. El vendedor dispone de consulta; alta, edición, ajustes y cambio de estado corresponden al administrador.

- 1. Como ADMIN, abrir Productos y buscar por código o nombre o filtrar por categoría.

- 2. Nuevo Producto abre el formulario. Completar código único, nombre, categoría, precio, stock y stock mínimo. Revisar unidad, marca, descripción, imagen y oferta antes de guardar.

- 3. Editar conserva el identificador del producto. Para reposición usar los controles rápidos de stock. La eliminación es una baja lógica que retira el producto del catálogo activo.

- 4. Una operación rechazada muestra un error; no se presenta como guardada en el navegador. El stock crítico corresponde a existencias menores o iguales al mínimo.

Figura 8  Inventario administrativo

![Captura de la aplicación](<imagenes/productos.png>)

Nota. La tabla permite consultar existencias, editar productos y ajustar stock con el perfil administrador. El vendedor utiliza una vista de consulta sin acciones de modificación.

## 5.6 Administrar usuarios y cupos

- 1. Como ADMIN, abrir Usuarios, buscar la cuenta y usar Nuevo Usuario o Editar. Revisar RUN, correo, perfil y datos de ubicación.

- 2. Asignar roles con cuidado: ADMIN mantiene operaciones; VENDEDOR consulta; CLIENTE compra; CONTRATISTA puede utilizar crédito habilitado. La interfaz protege cambios sobre la propia cuenta cuando corresponde.

- 3. Desactivar conserva el registro e impide nuevos accesos. No elimina pedidos históricos. Un error por RUN o correo duplicado exige corregir esos datos antes de guardar.

- 4. En una cuenta activa CONTRATISTA, pulsar Cuenta corriente. Revisar deuda y disponible, definir Cupo máximo, marcar o desmarcar Cuenta activa y Guardar cuenta. El cupo no puede ser inferior a la deuda.

- 5. El saldo no es editable: cambia mediante compras y anulaciones. Si Usuarios no está disponible o el usuario no es un contratista activo, Ventas rechaza la configuración.

Figura 9  Administración de usuarios

![Captura de la aplicación](<imagenes/usuarios.png>)

Nota. Solo el administrador accede al listado, alta, edición, asignación de rol y baja lógica. La captura corresponde a cuentas ficticias de la comprobación inicial de Usuarios.

## 5.7 Gestionar pedidos y comprobantes

- 1. Abrir Pedidos. Buscar código, cliente o correo y filtrar por estado.

- 2. Como ADMIN, cambiar CONFIRMADO a EN_PREPARACION, DESPACHADO o ENTREGADO según corresponda. Se permite avanzar sin cada estado intermedio; no retroceder.

- 3. Elegir ANULADO antes del cierre definitivo para restituir stock y crédito. ENTREGADO y ANULADO son terminales; repetir la anulación no devuelve dos veces.

- 4. Abrir Boleta para consultar el comprobante e imprimirlo. La denominación de la interfaz es referencial y no representa un documento tributario.

Figura 10  Gestión de pedidos

![Captura de la aplicación](<imagenes/pedidos.png>)

Nota. El administrador filtra órdenes, cambia su estado y abre el comprobante. Los pedidos cerrados no permiten nuevas transiciones.

Figura 11  Comprobante administrativo

![Captura de la aplicación](<imagenes/comprobante.png>)

Nota. El detalle conserva cantidades, precio unitario, subtotales, despacho y total. El pedido anulado de dos atornilladores registra productos por $77.382 y despacho por $14.990.

## 6 Solución de problemas

| Situación | Acción |
| --- | --- |
| No se pudo conectar con el servidor | Comprobar que los servicios y MySQL estén activos. Utilizar Reintentar. No asumir que una operación se guardó si no hay confirmación. |
| Sesión vencida o credenciales inválidas | Iniciar sesión de nuevo con una cuenta activa. El plazo del JWT es de 30 minutos. |
| Cuenta corriente inactiva o crédito insuficiente | Pedir revisión de habilitación al administrador, disminuir el pedido o elegir otro medio de pago. |
| Stock insuficiente | Actualizar el catálogo y reducir la cantidad; el servidor comprueba existencias al comprar. |
| RUN o correo ya registrado | Utilizar otra cuenta o pedir al administrador que revise la existente. |
| Error al cambiar de estado | Comprobar que el estado avance y que el pedido no esté cerrado. VENDEDOR solo consulta. |
| Datos diferentes entre pestañas | Las pestañas del mismo navegador comparten sesión. Cerrar sesión o entrar como otra cuenta afecta a las demás. Para probar dos perfiles simultáneos, usar perfiles de navegador separados. |

Al volver a la ventana, la sesión se comprueba en segundo plano. El mismo usuario conserva sus datos de formulario. Un cambio de cuenta o una sesión rechazada puede retirar el acceso. Las imágenes de catálogo, ofertas, ficha y carrito utilizan la misma referencia por producto.

## 7 Navegación vigente de la revisión 3.1

Las figuras siguientes corresponden al 13/11 y sustituyen la referencia de cabecera de las capturas anteriores. Iniciar Sesión es la entrada común para todos los perfiles; el panel se ofrece solo después de autenticar un rol operativo.

Figura 12  Inicio de la tienda sin sesión

![Navegación pública actual](<imagenes/navegacion-publica-v3-1.png>)

Nota. El visitante dispone de carrito, Iniciar Sesión y Registro. No se muestra un acceso adicional de Administración.

Figura 13  Menú de la tienda en teléfono

![Menú público móvil](<imagenes/menu-publico-movil-v3-1.png>)

Nota. Abrir el botón de menú y elegir Ingresar o Registrarse. ADMIN y VENDEDOR acceden al panel desde el mismo inicio de sesión; con su sesión activa aparece Panel Administrativo.
