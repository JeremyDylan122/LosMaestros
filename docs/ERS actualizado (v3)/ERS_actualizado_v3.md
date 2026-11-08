# Especificación de Requisitos de Software

> Documento de entrega y evidencia de la revisión indicada en el informe. Las referencias a AWS pendiente describen ese momento: el equipo confirmó posteriormente el despliegue. Para operación actual, consultar la [guía de despliegue](<../../Fase 3/despliegue/README.md>). Los resultados medidos y los archivos Word/Excel se conservan como registro de entrega.

Revisión 3.0 del 5 de noviembre de 2026.

[Documento Word](<ERS_Ferreteria_Los_Maestros_v3.docx>) · [Índice de documentación](../README.md)

## Ficha del documento

| Dato | Descripción |
| --- | --- |
| Proyecto | Ferretería Los Maestros |
| Documento | Especificación de Requisitos de Software revisión 3.0 |
| Asignatura y entrega | DSY1104 Desarrollo FullStack II Evaluación Parcial 3 |
| Fecha | 5 de noviembre de 2026 |
| Integrantes | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes |
| Estado | Versión integrada para revisión de la tercera entrega |
| Código documentado | Implementación local en Fase 3 con React, Usuarios y Ventas sobre MySQL. |

| Fecha | Versión | Responsables | Cambio |
| --- | --- | --- | --- |
| 11/09/2026 | 1.0 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Especificación de la primera versión con HTML, CSS y JavaScript. |
| 13/10/2026 | 2.0 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Evolución a React, persistencia local y gestión comercial de demostración. |
| 14/10/2026 | 2.1 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Revisión de reglas, requisitos y consistencia de las operaciones locales. |
| 16/10/2026 | 2.2 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Consolidación final de navegación, perfiles, cobertura referencial, imágenes y trazabilidad de pruebas. |
| 05/11/2026 | 3.0 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Integración REST, JWT, MySQL, permisos de vendedor, crédito administrado y continuidad de formularios. |

V3 identifica la etapa integrada con React, Spring Boot y MySQL. La revisión 3.0 actualiza la especificación de fase 2 y conserva sus identificadores para facilitar la trazabilidad.

## 1. Introducción

Ferretería Los Maestros necesita facilitar la consulta de productos y mejorar la gestión de ventas, inventario y cuentas corrientes. Este documento describe las necesidades del negocio y los requisitos de la solución, indicando cuáles pueden observarse en la aplicación actual y cuáles requieren desarrollo posterior.

### 1.1. Propósito

Definir las funciones, reglas y restricciones de Ferretería Los Maestros y establecer criterios observables para su aceptación. La especificación está dirigida a quienes evalúan, utilizan y mantienen el sistema; describe el comportamiento esperado sin exigir conocimientos de programación.

### 1.2. Ámbito del Sistema

La tercera versión entrega una tienda React conectada a dos servicios Spring Boot: Usuarios y Ventas. El catálogo inicial contiene 27 productos en siete categorías. Incluye fichas, ofertas, carrito local, registro e inicio de sesión, pedidos persistentes y un panel con permisos según el perfil.

Usuarios, productos, pedidos y cuentas corrientes se conservan en MySQL. Ventas confirma la compra, descuenta existencias y carga crédito dentro de una transacción. Los pagos electrónicos y las tarifas de despacho son de demostración; no se integra una pasarela bancaria ni correo saliente.

### 1.3. Definiciones, Acrónimos y Abreviaturas

| Término | Significado |
| --- | --- |
| ERS | Especificación de Requisitos de Software. |
| RF / RNF / RT | Requisito funcional, requisito no funcional y restricción técnica, respectivamente. |
| Regla de negocio | Condición que determina cómo debe operar el negocio o quién puede realizar una acción. |
| Stock | Cantidad disponible de un producto. El stock mínimo es el umbral utilizado para advertir la necesidad de reposición. |
| Cuenta corriente | Registro de compras de un cliente habilitado cuyo pago queda pendiente a fin de mes. |
| Simulación | Demostración de una interacción que todavía no realiza la operación comercial completa. |
| Almacenamiento local | Carrito, token y caché del navegador. Usuarios, catálogo, pedidos y crédito se resuelven mediante APIs y MySQL. |
| Frontend / backend | Interfaz que utiliza el usuario / servicios que procesan y guardan las operaciones. |
| API REST y JSON | Forma de comunicación entre la interfaz y los servicios, y formato de intercambio de los datos. |

### 1.4. Referencias

| Referencia | Descripción |
| --- | --- |
| ERS_Los_Maestros_V1.pdf | Especificación entregada para la primera versión; base de reglas e identificadores. |
| DSY1104 - Forma E - Ferreteria Los Maestros.docx | Contexto del negocio y características de la solución final. |
| DSY1104 - Forma E - Catalogo Ferreteria Los Maestros.xlsx | Productos, categorías y datos comerciales de referencia. |
| DSY1104 Evaluación Parcial 2_EE_EP_Estudiante.pdf | Criterios y entregables de la segunda evaluación. |
| DSY1104 Evaluación Parcial 2 - Anexo 1 Instrucciones.pdf | Orientación funcional y técnica de la etapa React. |
| 2.3.4 MC_Informes de cobertura.docx | Guía para interpretar y documentar la cobertura de pruebas. |
| Repositorio LosMaestros e indicaciones docentes | Implementación de la V2 y uso de Vitest para sus pruebas unitarias. |
| DSY1104 Evaluación Parcial 3 Anexos 1 a 4 | Instrucciones, modelo propuesto y plantillas de APIs, integración y manual en Fase 3/documentacion/referencias-profesor. |
| ERS revisión 2.2 e informe de pruebas de fase 2 | Antecedentes conservados en docs; sus cifras y alcance local corresponden a la etapa anterior. |

### 1.5. Visión General del Documento

El capítulo 1 presenta objetivo, alcance y referencias. El capítulo 2 explica el negocio, sus usuarios y reglas. El capítulo 3 identifica requisitos, criterios de aceptación y aplicación concreta. Las restricciones técnicas describen también la evolución prevista.

El campo Aplicación actual relaciona cada requisito con la versión integrada. El apartado 3.4.3 presenta ejemplos observables. El documento de APIs e integración registra contratos, modelo de datos, pruebas automatizadas y recorridos manuales; el informe de cobertura de fase 2 se conserva como antecedente histórico.

## 2. Descripción General

### 2.1. Perspectiva del Producto

Los Maestros es una ferretería familiar ubicada en La Serena, Región de Coquimbo, con 22 años de trayectoria. El dueño, su hijo y dos empleados atienden a particulares y contratistas. Su oferta incluye materiales de construcción, herramientas y artículos de ferretería, con más de 800 referencias en el negocio.

Actualmente, las consultas de disponibilidad se atienden por teléfono y requieren revisar la bodega o un archivo Excel. Las ventas se anotan en una libreta y el inventario se actualiza al final del día. Esto puede producir diferencias entre las existencias informadas y las reales. Las compras a cuenta corriente se registran por separado y se suman manualmente para su cobro mensual.

La aplicación centraliza usuarios en losmaestros_usuarios y las operaciones comerciales en losmaestros_ventas. React consulta las APIs para mostrar catálogo, pedidos y crédito. El navegador conserva el carrito, el token y una caché de productos; estos últimos datos no sustituyen las decisiones del servidor.

### 2.2. Funciones del Producto

El visitante consulta catálogo, categorías, ofertas y contenido informativo y prepara un carrito. Para confirmar una compra debe iniciar sesión como CLIENTE, CONTRATISTA o ADMIN. El registro público permite CLIENTE y CONTRATISTA, sin conceder privilegios administrativos ni habilitar crédito.

El administrador mantiene usuarios, productos, stock, estados de pedidos y cupos de contratistas. El vendedor consulta productos y órdenes y sus detalles. Los indicadores del panel se calculan con datos de las APIs. La consulta de cobertura mantiene tarifas referenciales por comuna.

### 2.3. Características de los Usuarios

Los usuarios tienen distinta experiencia digital. La atención en mesón requiere controles claros y consulta rápida de existencias. El contratista necesita identificar materiales para una obra, revisar entrega y crédito desde el teléfono. El cliente particular necesita comparar productos y comprender el total de su compra. La navegación y los iconos mantienen su identificación al cambiar de perfil o tamaño de pantalla.

| Perfil | Necesidades y relación con el sistema |
| --- | --- |
| Visitante y cliente | El visitante consulta la tienda y prepara un carrito. El cliente autenticado compra y consulta sus propios pedidos. |
| Contratista | Cliente especializado que consulta su crédito y puede utilizarlo cuando el administrador habilita la cuenta y existe cupo suficiente. |
| Vendedor | Consulta catálogo, inventario y órdenes con sus detalles. No modifica productos, stock, usuarios, pedidos ni crédito. |
| Dueño o administrador | Administra usuarios, roles, productos, existencias, estados de pedidos y cupos; consulta indicadores generales. |

La aplicación distingue ADMIN, VENDEDOR, CONTRATISTA y CLIENTE. CONTRATISTA es una especialización del cliente definida por el caso del equipo; la pauta enumera Administrador, Vendedor y Cliente. Registrar un contratista no crea cupo automático. El administrador habilita la cuenta y fija el crédito máximo en Ventas, que comprueba el rol activo mediante una consulta interna a Usuarios.

### 2.4. Restricciones

La V3 utiliza React, Vite, React Router, JavaScript y CSS propio en el frontend; Spring Boot, Spring Security, JPA y Java 17 en dos servicios; y MySQL 8.4 en desarrollo. H2 se utiliza en pruebas automatizadas. La carpeta Fase 3 reúne la implementación integrada y docs contiene los entregables formales.

La tienda y el panel requieren una presentación utilizable en teléfonos, tabletas y computadores. Los datos de pedidos y cuentas corrientes se consultan según el perfil y la titularidad. Las imágenes se sirven desde archivos locales, representan el tipo de artículo y conservan sus créditos; la marca y las especificaciones se indican en cada ficha.

#### 2.4.1. Reglas del negocio

| Regla | Condición y requisitos relacionados |
| --- | --- |
| RN-01 Ubicación | La Serena, Región de Coquimbo; dirección exacta referencial. RF-003 RF-039. |
| RN-02 Stock | No confirmar cantidades superiores a existencias ni cantidades no enteras o negativas. RF-008 RF-009 RF-031. |
| RN-03 Reposición | La demo alerta con stock menor o igual al mínimo como prevención. No envía avisos externos. RF-032. |
| RN-04 Entrega | Distinguir retiro y despacho; aplicar tarifa de demo por comuna y subtotal. Fuera de cobertura requiere cotización. RF-033 RF-044. |
| RN-05 Crédito | El administrador habilita el crédito y su cupo; Ventas verifica contratista activo en Usuarios. El cargo incluye despacho y exige cupo disponible. RF-036 RF-037 RF-047. |
| RN-06 Privacidad | La compra requiere sesión. Clientes y contratistas consultan pedidos propios; administrador y vendedor consultan las órdenes de la tienda. RNF-002. |
| RN-07 Personal | Administrador modifica usuarios, inventario, pedidos y crédito. Vendedor consulta productos y pedidos. RF-029 RF-030 RF-035. |
| RN-08 Consistencia | Guardar precio efectivo, subtotal, flete y total coherentes. Fallos no deben informar éxito. Anulación restituye stock y crédito una sola vez. RF-013 RF-035 RNF-004. |

### 2.5. Suposiciones y Dependencias

La ejecución requiere React en 5173, Usuarios en 8081, Ventas en 8082 y una base MySQL disponible. Los dos servicios comparten la clave pública de validación JWT; la privada permanece en Usuarios. Las credenciales y los archivos .env se configuran por entorno y se excluyen de Git. La guía de backend describe cómo preparar claves, bases y servicios.

Las direcciones, tarifas y plazos usados en la demostración son referenciales. La Serena y Coquimbo utilizan $4.990 bajo $100.000 y retiro o despacho urbano sin costo desde ese monto; Vicuña utiliza $14.990. Otras comunas requieren cotización o retiro en tienda. El esquema no geocodifica direcciones ni calcula distancias.

### 2.6. Requisitos Futuros

Permanecen fuera de la implementación actual los reportes comerciales por período, la geocodificación exacta, el video del negocio, los pagos bancarios reales y el correo saliente. Docker se utiliza para MySQL; el despliegue completo de las aplicaciones en contenedores y AWS no está implementado. Estas diferencias se mantienen visibles en sus fichas.

## 3. Requisitos Específicos

La especificación contiene 59 requisitos: 48 funcionales, ocho no funcionales y tres restricciones técnicas. Conserva los 57 identificadores de la revisión 2.2 y agrega la configuración administrativa de crédito y la continuidad de la sesión. Implementado en V3 identifica funciones disponibles en esta etapa; Parcial y Pendiente delimitan lo que falta.

Cada ficha presenta perfil, estado, descripción, criterio de aceptación, aplicación actual y origen. Los criterios expresan resultados esperados; las pruebas se documentan por separado. La revisión registra 48 requisitos implementados en V3, 10 parciales y 1 pendientes.

### 3.1. Requisitos comunes de las interfaces

#### 3.1.1. Interfaces de usuario

La interfaz comprende tienda pública, formularios, carrito, checkout, historial personal y panel administrativo. React Router gestiona rutas e historial. La cabecera adapta enlaces por perfil y el panel utiliza navegación lateral. Revalidar una sesión al recuperar el foco no debe desmontar una página autorizada ni borrar formularios.

#### 3.1.2. Interfaces de hardware

El usuario necesita un computador, tableta o teléfono con navegador y JavaScript; la impresión utiliza la función del navegador. El equipo que aloja el entorno local necesita las herramientas de ejecución descritas en el manual y en la guía del backend. No se han fijado mínimos de RAM o CPU mediante pruebas de rendimiento.

#### 3.1.3. Interfaces de software

React consume Usuarios y Ventas con fetch y JSON. Spring Boot organiza controladores, DTO, servicios y repositorios por dominio. JPA persiste los datos y Spring Security aplica permisos. Vitest y Testing Library verifican React; Maven, JUnit y MockMvc verifican el backend con H2.

#### 3.1.4. Interfaces de comunicación

Las rutas de negocio usan /api/v1. Usuarios y Ventas se ejecutan en puertos separados y admiten el origen local de React mediante CORS. Las solicitudes privadas incluyen Authorization: Bearer con un JWT RS256. Ventas consulta al servicio de Usuarios con X-Service-Token para comprobar contratistas al configurar crédito. Swagger publica los contratos de cada servicio.

### 3.2. Requisitos funcionales

#### 3.2.1. Navegación e información del catálogo

| RF-001 | Navegar entre páginas |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | La aplicación deberá permitir la navegación por rutas y conservar búsqueda, categoría y ofertas según el historial del navegador. |
| Criterio de aceptación | Abrir catálogo y carrito; retroceder y avanzar. La ruta, búsqueda, categoría y selección de ofertas deben corresponder a cada destino. |
| Aplicación actual | React Router mantiene las rutas; Products interpreta los filtros de la URL y Navbar ofrece enlaces comunes. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-002 | Acceder a funciones desde inicio |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El inicio deberá ofrecer accesos a catálogo, categorías, contacto y contenido. |
| Criterio de aceptación | Accionar los enlaces del inicio y comprobar su destino. |
| Aplicación actual | Los enlaces del inicio permiten abrir catálogo, categorías, contacto y contenido informativo. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-003 | Consultar información del negocio |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | La interfaz deberá identificar la ferretería con La Serena, Región de Coquimbo. |
| Criterio de aceptación | Consultar Nosotros y pie de página y comprobar ciudad y región. |
| Aplicación actual | About.jsx y Footer.jsx; dirección exacta y datos de contacto son referenciales. |
| Origen | Caso de negocio y datos de demostración. |

| RF-004 | Consultar el catálogo de la entrega |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El catálogo inicial deberá presentar 27 registros en siete categorías. |
| Criterio de aceptación | Con datos iniciales, contar 27 productos y siete categorías. |
| Aplicación actual | El catálogo inicial muestra 27 productos agrupados en siete categorías, con búsqueda, datos comerciales y acceso a la ficha. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-005 | Mantener datos comerciales |
| --- | --- |
| Usuario y estado | Cliente — Parcial |
| Descripción | Los productos deberán conservar código, nombre, unidad, categoría, marca, precio y stock coherentes con el catálogo fuente. |
| Criterio de aceptación | Comparar cada registro y su ficha con el Excel entregado. |
| Aplicación actual | El catálogo presenta los campos comerciales de los 27 registros seleccionados. Las evidencias funcionales no incluyen la verificación íntegra de todos los valores contra el Excel de referencia. |
| Origen | Catálogo proporcionado y ERS entregada. |

| RF-006 | Mostrar imágenes referenciales |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Cada producto deberá mostrar una imagen referencial coherente con su tipo, texto alternativo y encuadre completo en catálogo, ficha y carrito. |
| Criterio de aceptación | Los 27 productos cargan su imagen local. Los botines muestran calzado y los guantes protección de manos. La actualización conserva precios, stock e imágenes personalizadas. |
| Aplicación actual | Las respuestas REST sustituyen únicamente imágenes genéricas antiguas de productos conocidos antes de mostrarlas y guardarlas en caché. Catálogo, ofertas, ficha y carrito usan la misma referencia; una imagen personalizada del servidor se conserva. |
| Origen | Recurso multimedia de la primera etapa y diseño del catálogo de la V2. |

#### 3.2.2. Selección de productos y carrito

| RF-007 | Agregar productos al carrito |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El sistema deberá agregar una unidad del producto seleccionado o aumentar en una la cantidad de su producto existente cuando haya disponibilidad. |
| Criterio de aceptación | Dos incorporaciones del mismo código generan un solo producto de cantidad dos, si el stock lo permite. |
| Aplicación actual | Los botones del catálogo y la ficha agregan artículos mediante el contexto de carrito. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-008 | Rechazar productos sin stock |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El sistema deberá impedir la primera incorporación y cualquier nueva incorporación si el stock del producto es cero o inferior, mostrando un aviso. |
| Criterio de aceptación | Con un producto de prueba en stock cero, el carrito no cambia y se informa que no hay stock disponible. |
| Aplicación actual | El carrito comprueba la existencia vigente antes de la primera incorporación y de cada incremento. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-009 | Respetar existencias |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | La cantidad total por producto no deberá superar el stock vigente. |
| Criterio de aceptación | Superar el límite al agregar y al confirmar: ambas operaciones deben rechazarse sin descontar stock. |
| Aplicación actual | CartContext limita cantidades con la última consulta de catálogo. Ventas consolida líneas repetidas y vuelve a comprobar cantidades y existencias al comprar. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-010 | Modificar la cantidad seleccionada |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El carrito deberá permitir sumar o restar una unidad. Al disminuir la cantidad hasta cero, deberá eliminar el producto. |
| Criterio de aceptación | Desde cantidad dos, pulsar menos produce uno; pulsarlo de nuevo elimina la fila y actualiza los totales. |
| Aplicación actual | Los controles del carrito aumentan o reducen cantidades respetando stock y actualizan los importes. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-011 | Eliminar un producto |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El usuario deberá poder retirar una línea completa mediante Eliminar, conservando los demás productos. |
| Criterio de aceptación | Con dos códigos distintos, eliminar uno retira únicamente ese código y recalcula el total. |
| Aplicación actual | La acción Eliminar retira la línea seleccionada y recalcula el carrito. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-012 | Vaciar el carrito con confirmación |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El sistema deberá solicitar confirmación antes de eliminar todos los productos. |
| Criterio de aceptación | Cancelar conserva el carrito; aceptar deja el carrito vacío y el contador en cero. |
| Aplicación actual | El vaciado utiliza una confirmación antes de retirar todos los artículos. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-013 | Calcular importes coherentes |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El total deberá sumar líneas con precio vigente y descuento aplicable más despacho. El pedido conservará el desglose. |
| Criterio de aceptación | Comparar precio efectivo por cantidad, subtotal, flete y total en una compra con oferta. |
| Aplicación actual | React muestra el precio efectivo recibido del servidor. Ventas calcula precio por cantidad, subtotal, flete y total con BigDecimal y guarda el desglose; admite decimales por descuentos. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-014 | Actualizar el contador del menú |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El contador deberá representar la suma de cantidades, no la cantidad de códigos distintos. |
| Criterio de aceptación | Con dos unidades de un producto y una de otro, el contador muestra tres. |
| Aplicación actual | La cabecera muestra la suma de unidades y actualiza el contador al cambiar el carrito. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-015 | Conservar el carrito en el navegador |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El sistema deberá conservar los productos y cantidades del carrito al recargar la página en el mismo navegador, cuando el almacenamiento local esté disponible. |
| Criterio de aceptación | Después de agregar dos unidades y recargar, se mantienen el producto y su cantidad. |
| Aplicación actual | El navegador conserva los artículos y cantidades. Al mostrarlos, el carrito recupera del catálogo vigente su precio, disponibilidad e imagen. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-016 | Informar el carrito vacío |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Cuando no haya productos, deberá mostrarse un mensaje de carrito vacío y un acceso al catálogo. |
| Criterio de aceptación | Tras eliminar la última línea, desaparece la tabla y Ver Catálogo de Productos abre Productos. |
| Aplicación actual | El carrito vacío muestra un aviso y un enlace al catálogo. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-017 | Confirmar una compra integrada |
| --- | --- |
| Usuario y estado | Cliente, contratista o administrador — Implementado en V3 |
| Descripción | Una compra válida deberá registrar el pedido y mantener su confirmación visible después de vaciar el carrito. |
| Criterio de aceptación | Confirmar y comprobar pedido guardado, ruta de éxito y carrito vacío. |
| Aplicación actual | Checkout envía la compra a Ventas y vacía el carrito solo tras la confirmación del servidor. La vista de éxito recupera el pedido mediante su identificador y sesión. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.2.3. Artículos y formularios

| RF-018 | Listar artículos informativos |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El sitio deberá listar los artículos configurados y permitir elegir su lectura. |
| Criterio de aceptación | Abrir Blogs y seleccionar un artículo del listado. |
| Aplicación actual | La página Blogs lista los artículos configurados con acceso a su lectura. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-019 | Consultar el detalle de un artículo |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El sistema deberá presentar título, autor, fecha y contenido del artículo elegido, con un botón para regresar al listado. |
| Criterio de aceptación | Seleccionar un artículo muestra su contenido completo y Volver a Noticias retorna a Blogs. |
| Aplicación actual | La vista del artículo muestra su contenido y permite regresar al listado. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-020 | Validar el formulario de contacto |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El contacto deberá exigir nombre de hasta 100 caracteres, correo válido y comentario de hasta 500 caracteres. El nombre y comentario no podrán quedar vacíos después de quitar espacios iniciales y finales. |
| Criterio de aceptación | Los campos incompletos muestran errores; los datos válidos permiten continuar. El correo se comprueba según RF-023. |
| Aplicación actual | El formulario de contacto presenta errores junto a los campos y comprueba los datos antes de continuar. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-021 | Informar resultado del contacto |
| --- | --- |
| Usuario y estado | Usuario — Parcial |
| Descripción | El formulario válido deberá comunicar su resultado sin fingir un envío no realizado. |
| Criterio de aceptación | Completar contacto y comprobar que el aviso identifica la simulación. |
| Aplicación actual | Se validan y limpian campos; no se envía correo ni se almacena una solicitud en servidor. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-022 | Validar datos de registro |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El registro deberá exigir RUN válido, nombre, apellidos, correo, contraseña confirmada, dirección, región y comuna. |
| Criterio de aceptación | Probar RUN inválido y claves distintas; corregir datos y registrar una cuenta. |
| Aplicación actual | React valida el formulario; Usuarios repite las validaciones de identidad, correo, clave y duplicados, guarda BCrypt y devuelve un perfil sin credenciales. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-023 | Validar correos de los formularios |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Contacto, login y registro deberán rechazar correos vacíos, de más de 100 caracteres o sin estructura usuario@dominio.extensión. Se comparará el dominio en minúsculas con duoc.cl, profesor.duoc.cl o gmail.com. |
| Criterio de aceptación | usuario@gmail.com y Usuario@DUOC.CL son aceptados; usuario@otro.cl, usuario@@gmail.com y cadenas vacías son rechazados. No se verifica la existencia del buzón. |
| Aplicación actual | Los formularios usan la validación de userService y Usuarios repite las restricciones y normaliza el correo antes de guardar o autenticar. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-024 | Validar claves de la demo |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Registro, inicio de sesión y cambios de clave deberán respetar el rango actual de 4 a 10 caracteres. |
| Criterio de aceptación | Probar 3, 4, 10 y 11 caracteres; sólo el rango admitido permite continuar. |
| Aplicación actual | Criterio conservado del prototipo; no representa una recomendación de seguridad para producción. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-025 | Seleccionar región y comuna |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Al cambiar región se deberán ofrecer las comunas configuradas para ella. |
| Criterio de aceptación | Cambiar región y comprobar que la comuna pertenece a las opciones disponibles. |
| Aplicación actual | Register.jsx, Checkout.jsx y chileLocations.js; no define cobertura comercial. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-026 | Registrar una cuenta persistente |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El registro público deberá crear un CLIENTE o CONTRATISTA en Usuarios sin conceder roles operativos ni crédito automático. |
| Criterio de aceptación | Registrar y volver a iniciar sesión; un RUN o correo repetido devuelve 409 y no duplica la cuenta. Intentar asignar ADMIN o VENDEDOR mediante registro público debe rechazarse. |
| Aplicación actual | POST /api/v1/auth/registro guarda la cuenta en MySQL y entrega JWT y perfil. Ventas administra el crédito por separado. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-027 | Iniciar y cerrar una sesión autenticada |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El usuario deberá iniciar sesión con correo y contraseña y cerrar la sesión desde la interfaz. |
| Criterio de aceptación | Acceder con credenciales válidas y cerrar sesión. Una cuenta sin permisos que intente entrar por el acceso administrativo debe ser rechazada sin reemplazar la sesión vigente. |
| Aplicación actual | Usuarios emite JWT RS256 de 30 minutos. React conserva auth_token y consulta usuarios/me para restaurar la sesión. Un 401 retira el token; salir en otra pestaña sincroniza el cierre. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.2.4. Usuarios inventario y operación comercial

| RF-028 | Autenticar con servicios centrales |
| --- | --- |
| Usuario y estado | Cliente — Implementado en V3 |
| Descripción | El sistema final deberá autenticar y persistir usuarios mediante servicios centrales. |
| Criterio de aceptación | Acceder a la misma cuenta desde otro navegador contra Usuarios y comprobar la persistencia al reiniciar el servicio. |
| Aplicación actual | Usuarios autentica cuentas persistentes con BCrypt; Spring Security valida JWT y Ventas acepta los tokens firmados por Usuarios. |
| Origen | Caso de negocio y arquitectura final. |

| RF-029 | Administrar usuarios y roles |
| --- | --- |
| Usuario y estado | Administrador — Implementado en V3 |
| Descripción | El administrador deberá gestionar cuentas y roles; la solución final deberá permitir desactivación controlada. |
| Criterio de aceptación | Crear y editar una cuenta como administrador; bloquear la vista a vendedor. |
| Aplicación actual | El panel utiliza GET, POST, PUT y DELETE de Usuarios. La baja es lógica y conserva activo=false. Solo ADMIN accede al mantenedor; el backend comprueba cada operación. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-030 | Gestionar catálogo e inventario |
| --- | --- |
| Usuario y estado | Administrador y vendedor — Implementado en V3 |
| Descripción | El administrador deberá mantener catálogo y existencias. El vendedor deberá consultar listas y detalles sin acciones de escritura. |
| Criterio de aceptación | Modificar precio o stock como ADMIN y comprobar su persistencia. El vendedor consulta el resultado y recibe 403 si intenta una escritura directa. |
| Aplicación actual | React consume productos y categorías de Ventas. Las mutaciones no simulan éxito local cuando falla la red; conservan los identificadores del servidor. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-031 | Descontar stock por venta |
| --- | --- |
| Usuario y estado | Sistema — Implementado en V3 |
| Descripción | La confirmación deberá descontar las unidades sólo si todas las líneas tienen disponibilidad suficiente. |
| Criterio de aceptación | Comprar dos unidades y verificar descenso de dos; compra sin stock no produce descuento. |
| Aplicación actual | PedidoService comprueba stock y cantidades dentro de una transacción en Ventas y aplica bloqueo sobre los productos; un rechazo revierte los cambios. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-032 | Advertir reposición |
| --- | --- |
| Usuario y estado | Personal — Parcial |
| Descripción | La interfaz deberá identificar artículos que requieren reposición. |
| Criterio de aceptación | Reducir stock hasta el mínimo y por debajo y observar indicador preventivo. |
| Aplicación actual | Panel y filtros destacan stock menor o igual al mínimo; no se envía aviso externo al dueño. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-033 | Registrar pedido y entrega |
| --- | --- |
| Usuario y estado | Cliente — Implementado en V3 |
| Descripción | El pedido deberá guardar cliente, líneas, importes y modalidad. El formulario exige dirección para despacho. |
| Criterio de aceptación | Completar compras con retiro y despacho y comprobar los datos guardados y el flete. |
| Aplicación actual | El pedido persistente conserva datos de entrega, líneas y desglose. La identidad se obtiene del JWT. Los visitantes y vendedores no pueden confirmar compras. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-034 | Consultar pedidos propios |
| --- | --- |
| Usuario y estado | Cliente — Implementado en V3 |
| Descripción | El usuario deberá consultar sus pedidos sin que la interfaz muestre comprobantes ajenos. |
| Criterio de aceptación | Abrir Mis pedidos e intentar consultar un identificador de otra cuenta. |
| Aplicación actual | Ventas filtra por el sub del token para clientes y contratistas. Consultar un pedido de otro titular devuelve 404. React recupera historial y comprobante por API. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-035 | Actualizar y anular pedidos |
| --- | --- |
| Usuario y estado | Administrador — Implementado en V3 |
| Descripción | El administrador deberá actualizar estados válidos sin retroceder ni reabrir pedidos cerrados. Anular restituirá stock y crédito una sola vez. |
| Criterio de aceptación | Anular un pedido a crédito y comprobar restitución; repetir no duplica la devolución. |
| Aplicación actual | PATCH de Ventas usa CONFIRMADO, EN_PREPARACION, DESPACHADO, ENTREGADO y ANULADO. Se permite avanzar sin cada paso intermedio. ENTREGADO y ANULADO son terminales; repetir el estado es idempotente. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-036 | Cargar compras a cuenta corriente |
| --- | --- |
| Usuario y estado | Contratista — Implementado en V3 |
| Descripción | Un contratista activo con cupo suficiente podrá cargar el total del pedido, incluido despacho, a su saldo. |
| Criterio de aceptación | Comprar con flete y comprobar incremento por el total; exceder cupo impide la compra. |
| Aplicación actual | CuentaService administra cupo y saldo persistentes. No existen montos automáticos por registro. El contratista habilitado utiliza crédito; el cargo incluye despacho y se revierte al anular. |
| Origen | Caso de negocio; alta automática y montos definidos para demo. |

| RF-037 | Consultar historial y saldo |
| --- | --- |
| Usuario y estado | Contratista — Parcial |
| Descripción | El contratista deberá consultar compras y saldo; el dueño deberá disponer de historial comercial por cliente. |
| Criterio de aceptación | Acceder como contratista y comparar sus pedidos, saldo y crédito disponible. |
| Aplicación actual | Mis pedidos consulta historial y cuenta propia en Ventas. ADMIN consulta la cuenta de un contratista y configura su cupo. Falta un estado comercial consolidado por período. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-038 | Consultar reportes comerciales |
| --- | --- |
| Usuario y estado | Dueño — Parcial |
| Descripción | El dueño deberá consultar compras por cliente, productos más vendidos y clientes frecuentes para un período. |
| Criterio de aceptación | Elegir un período y contrastar los agregados con las ventas. |
| Aplicación actual | El panel consulta catálogo y pedidos centrales y presenta indicadores generales. No implementa productos más vendidos, clientes frecuentes ni selección de períodos. |
| Origen | Caso de negocio. |

| RF-039 | Verificar ubicación y cobertura |
| --- | --- |
| Usuario y estado | Cliente — Parcial |
| Descripción | El sistema final deberá mostrar cobertura geográfica y verificar la dirección de obra. |
| Criterio de aceptación | Validar una dirección dentro y otra fuera de cobertura sobre un mapa geográfico. |
| Aplicación actual | El esquema SVG permite elegir localidades y zonas y sincroniza comuna y tarifa. Es una representación referencial; no geocodifica direcciones ni calcula distancias. |
| Origen | Necesidad de cobertura del caso de negocio y representación local de la V2. |

| RF-040 | Consultar inventario compartido |
| --- | --- |
| Usuario y estado | Cliente — Implementado en V3 |
| Descripción | El catálogo final deberá consultar existencias centralizadas y reflejar ventas de distintos dispositivos. |
| Criterio de aceptación | Comprar desde un dispositivo y comprobar disponibilidad desde otro. |
| Aplicación actual | Ventas centraliza productos y stock en MySQL. Cada nueva consulta recupera los cambios confirmados; no existe actualización continua por WebSocket. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.2.5. Multimedia y funciones de la tienda integrada

| RF-041 | Incorporar video del negocio |
| --- | --- |
| Usuario y estado | Usuario — Pendiente |
| Descripción | El sitio deberá ofrecer un video pertinente y acceso identificable para reproducirlo. |
| Criterio de aceptación | Abrir la vista y reproducir el video con sus controles. |
| Aplicación actual | La V3 no incorpora un video del negocio. El requisito permanece pendiente. |
| Origen | Continuidad de la ERS de primera entrega. |

| RF-042 | Filtrar y ordenar productos |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El catálogo deberá permitir búsqueda por texto, selección de categoría, ofertas y ordenamiento por el precio efectivo con descuento. |
| Criterio de aceptación | Combinar filtros, volver al catálogo completo y usar atrás o adelante. Los controles deben reflejar la URL. Ordenar por precio debe considerar el descuento. |
| Aplicación actual | Búsqueda, categoría y ofertas se derivan de la URL y se restablecen al abrir el catálogo sin filtros. El orden usa el precio que paga el cliente. |
| Origen | Funciones de búsqueda y navegación de la segunda etapa. |

| RF-043 | Consultar fichas y ofertas |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | El usuario deberá consultar una ficha por producto y una vista de artículos en oferta. |
| Criterio de aceptación | Abrir una tarjeta y revisar detalle; comprobar el precio rebajado en Ofertas. |
| Aplicación actual | Catálogo, ofertas y ficha consultan Ventas con carga, error y reintento. La navegación conserva filtros y el precio efectivo incluye el descuento del servidor. |
| Origen | Funciones de segunda etapa. |

| RF-044 | Calcular tarifa y cobertura local |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | La consulta de cobertura y el formulario de compra deberán utilizar la misma tarifa de demostración por comuna. Las comunas sin tarifa automática deberán solicitar cotización. |
| Criterio de aceptación | Seleccionar comuna o zona actualiza ambas opciones y la tarifa. La Serena y Coquimbo: $4.990 bajo $100.000 y cero desde ese monto; Vicuña: $14.990; otras comunas: cotización. |
| Aplicación actual | React presenta la tarifa con shippingService y Ventas vuelve a calcularla al confirmar. El retiro es gratuito y el mapa sigue siendo referencial. |
| Origen | Configuración de despacho de la demostración V2. |

| RF-045 | Demostrar compra fallida |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Simular fallo deberá mostrar resultado fallido sin registrar venta ni modificar stock o saldo. |
| Criterio de aceptación | Activar fallo y confirmar; comprobar carrito conservado y ausencia de pedido. |
| Aplicación actual | Checkout.jsx y CheckoutFailure.jsx. |
| Origen | Instrucciones de segunda entrega. |

| RF-046 | Autocompletar compra |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Con sesión iniciada, el checkout deberá proponer los datos disponibles de cliente y entrega. |
| Criterio de aceptación | Abrir checkout con una cuenta y productos y comprobar datos propuestos y posibilidad de corregirlos. |
| Aplicación actual | Checkout propone los datos del perfil una sola vez por cuenta y permite corregirlos. Revalidar el mismo usuario al recuperar el foco conserva la edición. |
| Origen | Instrucciones de segunda entrega. |

| RF-047 | Configurar crédito de un contratista |
| --- | --- |
| Usuario y estado | Administrador — Implementado en V3 |
| Descripción | El administrador deberá habilitar o suspender una cuenta corriente y definir su cupo sin editar directamente la deuda. |
| Criterio de aceptación | Configurar un contratista activo, consultar saldo y cupo y rechazar un cupo inferior a la deuda. La configuración de un usuario inexistente o de otro rol no debe guardarse. |
| Aplicación actual | Panel Usuarios y GET/PUT /api/v1/cuentas-corrientes/{usuarioId}. Ventas consulta Usuarios por canal interno antes de guardar. |
| Origen | Integración de cuenta corriente de la tercera etapa. |

| RF-048 | Conservar formularios al revalidar la sesión |
| --- | --- |
| Usuario y estado | Usuario autenticado — Implementado en V3 |
| Descripción | Volver a la ventana deberá revalidar el perfil en segundo plano sin desmontar páginas autorizadas ni borrar datos sin guardar. |
| Criterio de aceptación | Editar entrega o un formulario, cambiar de ventana y volver. Una sesión válida mantiene lo escrito; un 401 cierra sesión y un cambio de rol aplica sus restricciones. |
| Aplicación actual | AuthContext distingue validación inicial y posterior, conserva perfiles iguales y sincroniza cambios de token entre pestañas. Checkout mantiene la edición del mismo usuario. |
| Origen | Corrección verificada en la revisión manual de fase 3. |

### 3.3. Requisitos no funcionales

#### 3.3.1. Rendimiento

Las comprobaciones se realizaron con el catálogo inicial y operaciones de demostración. Se probaron consistencia transaccional, persistencia y una compra concurrente controlada. No se midió capacidad de producción, disponibilidad continua ni tiempos máximos bajo carga.

#### 3.3.2. Seguridad

| RNF-001 | Proteger credenciales |
| --- | --- |
| Usuario y estado | Equipo — Implementado en V3 |
| Descripción | Las contraseñas no deberán almacenarse como texto legible; la solución final deberá protegerlas en servidor. |
| Criterio de aceptación | Comprobar hash BCrypt en Usuarios, ausencia de clave/hash en respuestas y claves privadas excluidas de Git. |
| Aplicación actual | BCrypt en servidor, DTO de salida sin credenciales y configuración externa de claves RSA y secretos internos. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RNF-002 | Restringir acceso por rol y titularidad |
| --- | --- |
| Usuario y estado | Todos — Implementado en V3 |
| Descripción | La interfaz deberá aplicar permisos por rol y titular; el servidor deberá respaldarlos en la solución final. |
| Criterio de aceptación | Un cliente no accede al panel ni a pedidos ajenos. El vendedor no accede a usuarios. Un intento administrativo rechazado conserva la sesión anterior. |
| Aplicación actual | Spring Security protege las APIs por rol y el servicio de pedidos controla titularidad. React restringe rutas y acciones. Ventas conserva los roles del JWT hasta expirar; no hay revocación inmediata. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RNF-003 | Validar operaciones en servidor |
| --- | --- |
| Usuario y estado | Equipo — Implementado en V3 |
| Descripción | El backend deberá repetir validaciones y comprobar permisos sin confiar en los datos enviados por la interfaz. |
| Criterio de aceptación | Enviar cantidades, roles, identificadores y totales manipulados; comprobar rechazo o cálculo del servidor sin modificaciones parciales. |
| Aplicación actual | DTO con Jakarta Validation, normalización y duplicados en Usuarios, autorización y reglas transaccionales en Ventas. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.3. Fiabilidad

| RNF-004 | Mantener consistencia de compra |
| --- | --- |
| Usuario y estado | Sistema — Implementado en V3 |
| Descripción | Pedido, stock y crédito deberán confirmarse o revertirse juntos. La actualización visual no deberá alterar datos comerciales. |
| Criterio de aceptación | Ante un error al guardar un pedido, no quedan cargos ni descuentos parciales. Al actualizar fotos, se conservan precios, stock, catálogo personalizado y demás registros. |
| Aplicación actual | Ventas agrupa compra y anulación en transacciones con bloqueos y control de versión. Se verificaron rollback y persistencia con MySQL; las imágenes solo actualizan referencias genéricas conocidas. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.4. Disponibilidad

| RNF-005 | Utilizar recursos del proyecto |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V3 |
| Descripción | Catálogo, imágenes y carrito deberán funcionar con archivos servidos por el proyecto. |
| Criterio de aceptación | Cargar las 27 imágenes y acceder a sus créditos sin solicitudes de imágenes a servicios externos durante el uso de la tienda. |
| Aplicación actual | Los recursos se almacenan en public/assets/img/productos y se sirven desde el proyecto. Los créditos identifican fuentes, licencias y descripciones de las imágenes generadas. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.5. Mantenibilidad

| RNF-006 | Mantener código organizado |
| --- | --- |
| Usuario y estado | Equipo — Implementado en V3 |
| Descripción | Separar páginas, componentes, contextos, datos, servicios y estilos y reutilizar reglas de cálculo y validación. |
| Criterio de aceptación | Localizar cálculo de precio, despacho y correo y comprobar su reutilización. |
| Aplicación actual | React separa páginas, componentes, contextos y servicios REST. Spring Boot organiza Usuarios y Ventas por dominio con DTO, controladores, servicios y repositorios. Swagger describe sus APIs. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.6. Portabilidad y facilidad de uso

| RNF-007 | Adaptar vistas a dispositivos |
| --- | --- |
| Usuario y estado | Usuario — Parcial |
| Descripción | Las vistas deberán ser utilizables a 360, 768 y 1280 píxeles con menú móvil y contenido accesible. |
| Criterio de aceptación | Recorrer tienda, formularios y panel a distintos anchos. La marca, las acciones y los iconos deben mantenerse utilizables y el documento no debe desbordarse. |
| Aplicación actual | Se conserva la adaptación responsiva de fase 2. La fase 3 se verificó en recorridos de escritorio; no se ha repetido una auditoría completa de todos los perfiles y dispositivos. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RNF-008 | Facilitar formularios |
| --- | --- |
| Usuario y estado | Usuario — Parcial |
| Descripción | Los campos deberán tener etiquetas, errores comprensibles y acceso por teclado. |
| Criterio de aceptación | Recorrer campos con teclado y corregir datos según sus mensajes. |
| Aplicación actual | Formularios públicos con etiquetas y avisos; falta auditoría completa de accesibilidad de panel y modales. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

### 3.4. Otros Requisitos

#### 3.4.1. Herramientas y condiciones técnicas

| RT-001 | Evolucionar a la arquitectura final |
| --- | --- |
| Usuario y estado | Equipo — Implementado en V3 |
| Descripción | La solución final deberá integrar React con servicios Spring Boot mediante API REST. |
| Criterio de aceptación | Demostrar intercambio con servicios independientes y errores JSON en la etapa correspondiente. |
| Aplicación actual | React consume dos servicios Spring Boot por fetch y JSON. Las rutas de negocio están versionadas en /api/v1 y Swagger publica sus operaciones. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RT-002 | Guardar los datos en una base relacional |
| --- | --- |
| Usuario y estado | Equipo de desarrollo — Parcial |
| Descripción | Los datos del sistema final deberán persistir en MySQL, PostgreSQL u Oracle, con un modelo normalizado al menos hasta tercera forma normal. |
| Criterio de aceptación | Usuarios, productos y operaciones se conservan después de reiniciar los servicios y el modelo cumple la normalización requerida. |
| Aplicación actual | MySQL guarda usuarios, categorías, productos, pedidos, detalle y crédito. Se comprobó persistencia tras reinicios. El detalle conserva instantáneas comerciales históricas; no se adjunta una demostración formal de tercera forma normal. |
| Origen | Tecnologías obligatorias del contexto del proyecto. |

| RT-003 | Desplegar el sistema con AWS y Docker |
| --- | --- |
| Usuario y estado | Equipo de desarrollo — Parcial |
| Descripción | La solución final deberá utilizar AWS y Docker para su despliegue. |
| Criterio de aceptación | La aplicación puede iniciarse mediante sus contenedores y accederse en el entorno desplegado. |
| Aplicación actual | Docker Compose levanta MySQL con volumen persistente. React y los dos servicios se ejecutan en el host. No se ha desplegado el conjunto completo en AWS. |
| Origen | Tecnologías obligatorias del contexto del proyecto. |

#### 3.4.2. Criterios de las validaciones actuales

El registro y la administración validan RUN mediante Módulo 11, nombre hasta 50 caracteres, apellidos y correo hasta 100, dirección hasta 300 y empresa hasta 150. React solicita región y comuna en el registro; el DTO de Usuarios permite esos campos opcionales con límite de 100. Contacto valida nombre hasta 100 y comentario hasta 500 en la interfaz. El RUN válido no acredita identidad.

Los dominios duoc.cl, profesor.duoc.cl y gmail.com y las claves de cuatro a diez caracteres se conservan como reglas del prototipo. Usuarios normaliza correo y RUN y almacena el hash BCrypt. La edición administrativa admite conservar la contraseña existente al dejar el campo sin una nueva clave. No se verifica la propiedad del buzón.

El backend comprueba permisos, duplicados y reglas de compra sin aceptar identidad, precios ni totales del navegador. Un JWT dura 30 minutos. React revalida el perfil al recuperar el foco y recibe los cambios de acceso; Ventas valida el token firmado y sus roles hasta su vencimiento, sin lista de revocación inmediata. Este límite debe considerarse al cambiar roles o desactivar cuentas.

#### 3.4.3. Funciones observables de la tercera versión

Las pruebas de esta revisión registran 118 casos aprobados de React y 25 del backend. Las pruebas automatizadas Java utilizan H2; las comprobaciones de MySQL y el recorrido manual aportan evidencia adicional de integración. No se atribuyen a V3 los porcentajes de cobertura obtenidos en la fase 2.

| Función observable | Requisitos | Comportamiento de la V3 |
| --- | --- | --- |
| Navegar y filtrar el catálogo | RF-001 RF-004 RF-042 | Consulta REST de los productos activos y categorías de Ventas; filtros según URL y precio efectivo. |
| Consultar imágenes y fichas | RF-006 RF-043 RNF-005 | La misma imagen específica por tipo de artículo en catálogo, ofertas, ficha y carrito; recursos y créditos locales. |
| Modificar el carrito | RF-007 a RF-016 | Cantidades persistidas en el navegador; Ventas vuelve a validar existencias al confirmar. |
| Comprar con retiro o despacho | RF-013 RF-017 RF-033 RF-044 | JWT requerido; Ventas calcula importes y guarda pedido, stock y crédito en una transacción. |
| Consultar cobertura referencial | RF-039 RF-044 | Representación referencial y tarifas comprobadas otra vez en Ventas; sin geocodificación. |
| Simular compra fallida | RF-045 RNF-004 | El fallo simulado conserva carrito y no envía una compra al servidor. |
| Comprar como contratista | RF-036 RF-037 | Crédito habilitado por ADMIN; saldo y disponible se consultan en Ventas. |
| Controlar acceso administrativo | RF-027 RNF-002 | JWT y perfil remoto; VENDEDOR consulta y ADMIN modifica. Volver al foco conserva formularios. |
| Consultar y anular pedidos | RF-034 RF-035 RNF-002 | Historial autorizado por servidor; anulación de ADMIN restituye stock y crédito una sola vez. |

La entrega documenta la integración local disponible y sus límites. El manual explica las tareas de cada perfil y el informe de APIs e integración describe los datos, rutas, seguridad y pruebas. El acceso remoto en AWS y la operación comercial real siguen pendientes.
