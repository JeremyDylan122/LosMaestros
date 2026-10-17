# Especificación de Requisitos de Software

Ferretería Los Maestros revisión 2.2 del 16 de octubre de 2026

[Documento Word](ERS_Ferreteria_Los_Maestros_v2.docx) · [Índice de documentación](../README.md)

**Contenido**

- [1. Introducción](#1-introducción)
- [2. Descripción general](#2-descripción-general)
- [3. Requisitos específicos](#3-requisitos-específicos)
- [Funciones observables de la V2](#343-funciones-observables-de-la-segunda-versión)

## Ficha del documento

| Dato | Descripción |
| --- | --- |
| Proyecto | Ferretería Los Maestros |
| Documento | Especificación de Requisitos de Software revisión 2.2 |
| Asignatura y entrega | DSY1104 Desarrollo FullStack II Evaluación Parcial 2 |
| Fecha | 16 de octubre de 2026 |
| Integrantes | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes |
| Estado | Versión final para la segunda entrega |
| Código documentado | Aplicación React V2 revisada para la entrega del 16 de octubre de 2026. |

| Fecha | Versión | Responsables | Cambio |
| --- | --- | --- | --- |
| 11/09/2026 | 1.0 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Especificación de la primera versión con HTML, CSS y JavaScript. |
| 13/10/2026 | 2.0 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Evolución a React, persistencia local y gestión comercial de demostración. |
| 14/10/2026 | 2.1 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Revisión de reglas, requisitos y consistencia de las operaciones locales. |
| 16/10/2026 | 2.2 | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes | Consolidación final de navegación, perfiles, cobertura referencial, imágenes y trazabilidad de pruebas. |

V2 identifica la segunda versión de la aplicación, desarrollada con React. La revisión 2.2 corresponde a la versión final de esta especificación para la segunda entrega.

## 1. Introducción

Ferretería Los Maestros necesita facilitar la consulta de productos y mejorar la gestión de ventas, inventario y cuentas corrientes. Este documento describe las necesidades del negocio y los requisitos de la solución, indicando cuáles pueden observarse en la aplicación actual y cuáles requieren desarrollo posterior.

### 1.1. Propósito

Definir las funciones, reglas y restricciones de Ferretería Los Maestros y establecer criterios observables para su aceptación. La especificación está dirigida a quienes evalúan, utilizan y mantienen el sistema; describe el comportamiento esperado sin exigir conocimientos de programación.

### 1.2. Ámbito del Sistema

La segunda versión entrega una tienda React con 27 productos iniciales en siete categorías, imágenes referenciales por tipo de artículo, fichas, ofertas, carrito, registro e inicio de sesión, compra simulada e historial personal. Incluye un panel para gestionar usuarios, catálogo, inventario y pedidos según los permisos de cada perfil. Las operaciones se conservan en el navegador.

La compra registra el pedido, descuenta existencias y carga el total a la cuenta corriente cuando se utiliza crédito. El pago, el despacho y el contacto son demostraciones: esta versión no realiza cobros ni envía correos. La solución final contempla servicios centrales, base de datos e inventario compartido, identificados como desarrollo posterior.

### 1.3. Definiciones, Acrónimos y Abreviaturas

| Término | Significado |
| --- | --- |
| ERS | Especificación de Requisitos de Software. |
| RF / RNF / RT | Requisito funcional, requisito no funcional y restricción técnica, respectivamente. |
| Regla de negocio | Condición que determina cómo debe operar el negocio o quién puede realizar una acción. |
| Stock | Cantidad disponible de un producto. El stock mínimo es el umbral utilizado para advertir la necesidad de reposición. |
| Cuenta corriente | Registro de compras de un cliente habilitado cuyo pago queda pendiente a fin de mes. |
| Simulación | Demostración de una interacción que todavía no realiza la operación comercial completa. |
| Almacenamiento local | Datos conservados por el navegador para carrito, usuarios, productos y pedidos. No constituyen un inventario compartido entre dispositivos. |
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

### 1.5. Visión General del Documento

El capítulo 1 presenta objetivo, alcance y referencias. El capítulo 2 explica el negocio, sus usuarios y reglas. El capítulo 3 identifica requisitos, criterios de aceptación y aplicación concreta. Las restricciones técnicas describen también la evolución prevista.

El campo Aplicación actual de cada requisito relaciona la función con la segunda versión entregada. El apartado 3.4.3 presenta ejemplos observables de esa relación. El informe de pruebas y cobertura documenta los resultados ejecutados y distingue las pruebas automatizadas de las comprobaciones en navegador.

## 2. Descripción General

### 2.1. Perspectiva del Producto

Los Maestros es una ferretería familiar ubicada en La Serena, Región de Coquimbo, con 22 años de trayectoria. El dueño, su hijo y dos empleados atienden a particulares y contratistas. Su oferta incluye materiales de construcción, herramientas y artículos de ferretería, con más de 800 referencias en el negocio.

Actualmente, las consultas de disponibilidad se atienden por teléfono y requieren revisar la bodega o un archivo Excel. Las ventas se anotan en una libreta y el inventario se actualiza al final del día. Esto puede producir diferencias entre las existencias informadas y las reales. Las compras a cuenta corriente se registran por separado y se suman manualmente para su cobro mensual.

La aplicación representa esas operaciones mediante servicios JavaScript y almacenamiento local. El catálogo contiene una selección inicial de 27 productos. Los cambios de existencias, pedidos y crédito se conservan en el mismo navegador; la conexión con los registros físicos y la sincronización entre dispositivos corresponden a la solución final.

### 2.2. Funciones del Producto

El visitante consulta productos, categorías, ofertas y contenido informativo, prepara el carrito y realiza una compra simulada. El registro permite crear una cuenta local de cliente o contratista. Con sesión iniciada, el formulario de compra propone los datos disponibles del usuario y permite consultar los pedidos propios. El contratista dispone además de saldo y crédito de demostración.

Administrador y vendedor gestionan catálogo, existencias y pedidos. La administración de usuarios se reserva al administrador. El panel presenta indicadores calculados con los datos locales. La consulta de despacho permite seleccionar comuna o zona en un esquema referencial y utiliza las mismas tarifas que la compra.

### 2.3. Características de los Usuarios

Los usuarios tienen distinta experiencia digital. La atención en mesón requiere controles claros y consulta rápida de existencias. El contratista necesita identificar materiales para una obra, revisar entrega y crédito desde el teléfono. El cliente particular necesita comparar productos y comprender el total de su compra. La navegación y los iconos mantienen su identificación al cambiar de perfil o tamaño de pantalla.

| Perfil | Necesidades y relación con el sistema |
| --- | --- |
| Visitante y cliente | Consulta productos, prepara una compra y elige retiro o despacho. El cliente registrado consulta únicamente sus pedidos. Requiere información clara de precio, disponibilidad y resultado. |
| Contratista | Compra materiales para obras, utiliza crédito de demostración con cupo suficiente y consulta pedidos, saldo y crédito disponible. Necesita acceso desde el teléfono. |
| Vendedor | Gestiona productos, existencias y pedidos de la tienda. Requiere controles rápidos para la atención y no dispone de administración de usuarios. |
| Dueño o administrador | Administra cuentas, roles, catálogo y pedidos. Consulta indicadores locales; los reportes comerciales completos corresponden a la solución final. |

La aplicación distingue ADMIN, VENDEDOR, CONTRATISTA y CLIENTE, además del visitante sin sesión. Para la demostración, el registro de un contratista habilita automáticamente un cupo de $2.500.000. La cuenta contratista precargada dispone de $3.500.000 y saldo inicial de $450.000. Estos valores son datos de prueba; la política definitiva de autorización y cupos pertenece a la operación comercial final.

### 2.4. Restricciones

La V2 utiliza React, Vite, React Router, JavaScript, CSS propio y localStorage. La interfaz se adapta con estilos del proyecto. Vitest y Testing Library constituyen el entorno de pruebas, conforme a la indicación docente para esta entrega. El repositorio conserva la primera etapa en fase1, la aplicación React en fase 2 y los documentos en docs.

La tienda y el panel requieren una presentación utilizable en teléfonos, tabletas y computadores. Los datos de pedidos y cuentas corrientes se consultan según el perfil y la titularidad. Las imágenes se sirven desde archivos locales, representan el tipo de artículo y conservan sus créditos; la marca y las especificaciones se indican en cada ficha.

#### 2.4.1. Reglas del negocio

| Regla | Condición y requisitos relacionados |
| --- | --- |
| RN-01 Ubicación | La Serena, Región de Coquimbo; dirección exacta referencial. RF-003 RF-039. |
| RN-02 Stock | No confirmar cantidades superiores a existencias ni cantidades no enteras o negativas. RF-008 RF-009 RF-031. |
| RN-03 Reposición | La demo alerta con stock menor o igual al mínimo como prevención. No envía avisos externos. RF-032. |
| RN-04 Entrega | Distinguir retiro y despacho; aplicar tarifa de demo por comuna y subtotal. Fuera de cobertura requiere cotización. RF-033 RF-044. |
| RN-05 Crédito | Exigir contratista activo y cupo suficiente; el cargo incluye flete. Habilitación automática y cupos son decisiones de demo. RF-036 RF-037. |
| RN-06 Privacidad | Cliente ve pedidos propios. Invitado ve su último comprobante en la pestaña de compra. Personal autorizado gestiona pedidos. RNF-002. |
| RN-07 Personal | Administrador y vendedor gestionan inventario y pedidos; sólo administrador gestiona usuarios. RF-029 RF-030. |
| RN-08 Consistencia | Guardar precio efectivo, subtotal, flete y total coherentes. Fallos no deben informar éxito. Anulación restituye stock y crédito una sola vez. RF-013 RF-035 RNF-004. |

### 2.5. Suposiciones y Dependencias

La persistencia depende de que el navegador permita localStorage y conserve sus datos. El alojamiento debe servir las rutas de React. Web Crypto requiere localhost o un contexto seguro HTTPS. No se garantiza sincronización ni transacciones concurrentes entre dispositivos.

La dirección exacta, las cuentas precargadas, las tarifas y los plazos corresponden a la demostración. La tarifa urbana de La Serena y Coquimbo es $4.990 para compras menores a $100.000 y gratuita desde ese monto. Vicuña utiliza $14.990; otras comunas requieren cotización. El esquema ilustra localidades y zonas, sin calcular distancias ni validar una dirección exacta.

### 2.6. Requisitos Futuros

El resultado final esperado incorpora autenticación y autorización en servidor, persistencia relacional, inventario compartido, reportes por período y verificación geográfica precisa. Usuarios, pedidos y crédito ya se demuestran localmente; esto no completa las integraciones de RF-028, RF-038 a RF-040 y RT-001 a RT-003.

## 3. Requisitos Específicos

La especificación contiene 57 requisitos: 46 funcionales, ocho no funcionales y tres restricciones técnicas. Mantiene los identificadores de la primera versión e incorpora las funciones de la etapa React. Implementado en V2 indica disponibilidad en el alcance local; Parcial identifica una función entregada de forma limitada; Pendiente corresponde a desarrollo posterior.

Cada ficha presenta el perfil relacionado, el estado, la descripción, el criterio de aceptación, la aplicación actual y el origen. Los criterios describen el resultado esperado; la evidencia de su comprobación se desarrolla en el informe de pruebas y cobertura. La distribución es de 38 requisitos implementados en V2, 15 parciales y 4 pendientes.

### 3.1. Requisitos comunes de las interfaces

#### 3.1.1. Interfaces de usuario

La interfaz comprende tienda pública, formularios, carrito, compra, historial personal y panel administrativo. React Router gestiona rutas y el historial del navegador. La cabecera distribuye marca, enlaces y acciones según el ancho de pantalla, mantiene visibles los iconos y ofrece acceso móvil al historial. El panel utiliza navegación lateral.

#### 3.1.2. Interfaces de hardware

Se requiere un navegador con JavaScript, almacenamiento local y Web Crypto. La demo no necesita dispositivos especializados ni servidor de base de datos. La impresión utiliza la función del navegador.

#### 3.1.3. Interfaces de software

React gestiona vistas y estados; React Router gestiona rutas; los servicios JavaScript persisten productos, usuarios y pedidos en localStorage. Vite ejecuta y compila el frontend. Vitest, jsdom y Testing Library verifican servicios y componentes. Spring Boot aún no participa en esta versión.

#### 3.1.4. Interfaces de comunicación

La V2 no consume una API de negocio. El servidor de Vite o alojamiento entrega archivos y los datos permanecen en el navegador. La solución final deberá comunicarse con el backend mediante API y controles de autenticación y autorización apropiados.

### 3.2. Requisitos funcionales

#### 3.2.1. Navegación e información del catálogo

| RF-001 | Navegar entre páginas |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | La aplicación deberá permitir la navegación por rutas y conservar búsqueda, categoría y ofertas según el historial del navegador. |
| Criterio de aceptación | Abrir catálogo y carrito; retroceder y avanzar. La ruta, búsqueda, categoría y selección de ofertas deben corresponder a cada destino. |
| Aplicación actual | React Router mantiene las rutas; Products interpreta los filtros de la URL y Navbar ofrece enlaces comunes. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-002 | Acceder a funciones desde inicio |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El inicio deberá ofrecer accesos a catálogo, categorías, contacto y contenido. |
| Criterio de aceptación | Accionar los enlaces del inicio y comprobar su destino. |
| Aplicación actual | Los enlaces del inicio permiten abrir catálogo, categorías, contacto y contenido informativo. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-003 | Consultar información del negocio |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | La interfaz deberá identificar la ferretería con La Serena, Región de Coquimbo. |
| Criterio de aceptación | Consultar Nosotros y pie de página y comprobar ciudad y región. |
| Aplicación actual | About.jsx y Footer.jsx; dirección exacta y datos de contacto son referenciales. |
| Origen | Caso de negocio y datos de demostración. |

| RF-004 | Consultar el catálogo de la entrega |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
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
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Cada producto deberá mostrar una imagen referencial coherente con su tipo, texto alternativo y encuadre completo en catálogo, ficha y carrito. |
| Criterio de aceptación | Los 27 productos cargan su imagen local. Los botines muestran calzado y los guantes protección de manos. La actualización conserva precios, stock e imágenes personalizadas. |
| Aplicación actual | El catálogo utiliza 26 referencias visuales distintas; las dos pinturas blancas comparten imagen. Se actualizaron 24 productos con 23 recursos nuevos. El pie ofrece créditos y la ficha indica el carácter referencial. |
| Origen | Recurso multimedia de la primera etapa y diseño del catálogo de la V2. |

#### 3.2.2. Selección de productos y carrito

| RF-007 | Agregar productos al carrito |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El sistema deberá agregar una unidad del producto seleccionado o aumentar en una la cantidad de su producto existente cuando haya disponibilidad. |
| Criterio de aceptación | Dos incorporaciones del mismo código generan un solo producto de cantidad dos, si el stock lo permite. |
| Aplicación actual | Los botones del catálogo y la ficha agregan artículos mediante el contexto de carrito. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-008 | Rechazar productos sin stock |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El sistema deberá impedir la primera incorporación y cualquier nueva incorporación si el stock del producto es cero o inferior, mostrando un aviso. |
| Criterio de aceptación | Con un producto de prueba en stock cero, el carrito no cambia y se informa que no hay stock disponible. |
| Aplicación actual | El carrito comprueba la existencia vigente antes de la primera incorporación y de cada incremento. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-009 | Respetar existencias |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | La cantidad total por producto no deberá superar el stock vigente. |
| Criterio de aceptación | Superar el límite al agregar y al confirmar: ambas operaciones deben rechazarse sin descontar stock. |
| Aplicación actual | CartContext.jsx y orderService.js; las líneas repetidas se consolidan antes de validar. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-010 | Modificar la cantidad seleccionada |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El carrito deberá permitir sumar o restar una unidad. Al disminuir la cantidad hasta cero, deberá eliminar el producto. |
| Criterio de aceptación | Desde cantidad dos, pulsar menos produce uno; pulsarlo de nuevo elimina la fila y actualiza los totales. |
| Aplicación actual | Los controles del carrito aumentan o reducen cantidades respetando stock y actualizan los importes. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-011 | Eliminar un producto |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El usuario deberá poder retirar una línea completa mediante Eliminar, conservando los demás productos. |
| Criterio de aceptación | Con dos códigos distintos, eliminar uno retira únicamente ese código y recalcula el total. |
| Aplicación actual | La acción Eliminar retira la línea seleccionada y recalcula el carrito. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-012 | Vaciar el carrito con confirmación |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El sistema deberá solicitar confirmación antes de eliminar todos los productos. |
| Criterio de aceptación | Cancelar conserva el carrito; aceptar deja el carrito vacío y el contador en cero. |
| Aplicación actual | El vaciado utiliza una confirmación antes de retirar todos los artículos. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-013 | Calcular importes coherentes |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El total deberá sumar líneas con precio vigente y descuento aplicable más despacho. El pedido conservará el desglose. |
| Criterio de aceptación | Comparar precio efectivo por cantidad, subtotal, flete y total en una compra con oferta. |
| Aplicación actual | Checkout.jsx, productService.js y orderService.js; valores en pesos chilenos. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-014 | Actualizar el contador del menú |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El contador deberá representar la suma de cantidades, no la cantidad de códigos distintos. |
| Criterio de aceptación | Con dos unidades de un producto y una de otro, el contador muestra tres. |
| Aplicación actual | La cabecera muestra la suma de unidades y actualiza el contador al cambiar el carrito. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-015 | Conservar el carrito en el navegador |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El sistema deberá conservar los productos y cantidades del carrito al recargar la página en el mismo navegador, cuando el almacenamiento local esté disponible. |
| Criterio de aceptación | Después de agregar dos unidades y recargar, se mantienen el producto y su cantidad. |
| Aplicación actual | El navegador conserva los artículos y cantidades. Al mostrarlos, el carrito recupera del catálogo vigente su precio, disponibilidad e imagen. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-016 | Informar el carrito vacío |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Cuando no haya productos, deberá mostrarse un mensaje de carrito vacío y un acceso al catálogo. |
| Criterio de aceptación | Tras eliminar la última línea, desaparece la tabla y Ver Catálogo de Productos abre Productos. |
| Aplicación actual | El carrito vacío muestra un aviso y un enlace al catálogo. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-017 | Completar una compra local |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Una compra válida deberá registrar el pedido y mantener su confirmación visible después de vaciar el carrito. |
| Criterio de aceptación | Confirmar y comprobar pedido guardado, ruta de éxito y carrito vacío. |
| Aplicación actual | Checkout.jsx y CheckoutSuccess.jsx; regresión automatizada de navegación. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.2.3. Artículos y formularios

| RF-018 | Listar artículos informativos |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El sitio deberá listar los artículos configurados y permitir elegir su lectura. |
| Criterio de aceptación | Abrir Blogs y seleccionar un artículo del listado. |
| Aplicación actual | La página Blogs lista los artículos configurados con acceso a su lectura. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-019 | Consultar el detalle de un artículo |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El sistema deberá presentar título, autor, fecha y contenido del artículo elegido, con un botón para regresar al listado. |
| Criterio de aceptación | Seleccionar un artículo muestra su contenido completo y Volver a Noticias retorna a Blogs. |
| Aplicación actual | La vista del artículo muestra su contenido y permite regresar al listado. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-020 | Validar el formulario de contacto |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
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
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El registro deberá exigir RUN válido, nombre, apellidos, correo, contraseña confirmada, dirección, región y comuna. |
| Criterio de aceptación | Probar RUN inválido y claves distintas; corregir datos y registrar una cuenta. |
| Aplicación actual | Register.jsx: nombre máximo 50, apellidos 100 y dirección 300 caracteres; correo máximo 100. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-023 | Validar correos de los formularios |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Contacto, login y registro deberán rechazar correos vacíos, de más de 100 caracteres o sin estructura usuario@dominio.extensión. Se comparará el dominio en minúsculas con duoc.cl, profesor.duoc.cl o gmail.com. |
| Criterio de aceptación | usuario@gmail.com y Usuario@DUOC.CL son aceptados; usuario@otro.cl, usuario@@gmail.com y cadenas vacías son rechazados. No se verifica la existencia del buzón. |
| Aplicación actual | Los formularios reutilizan la validación de correo de userService. |
| Origen | ERS de la primera versión y validaciones de la interfaz. |

| RF-024 | Validar claves de la demo |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Registro, inicio de sesión y cambios de clave deberán respetar el rango actual de 4 a 10 caracteres. |
| Criterio de aceptación | Probar 3, 4, 10 y 11 caracteres; sólo el rango admitido permite continuar. |
| Aplicación actual | Criterio conservado del prototipo; no representa una recomendación de seguridad para producción. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-025 | Seleccionar región y comuna |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Al cambiar región se deberán ofrecer las comunas configuradas para ella. |
| Criterio de aceptación | Cambiar región y comprobar que la comuna pertenece a las opciones disponibles. |
| Aplicación actual | Register.jsx, Checkout.jsx y chileLocations.js; no define cobertura comercial. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-026 | Registrar una cuenta local |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El registro válido deberá crear una cuenta local, rechazar correo duplicado e iniciar su sesión. |
| Criterio de aceptación | Registrar un correo nuevo; repetirlo y verificar rechazo. |
| Aplicación actual | Register.jsx y userService.js; contratista recibe crédito de demo automático. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-027 | Iniciar y cerrar sesión local |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El usuario deberá acceder con credenciales válidas y cerrar su sesión desde la interfaz. |
| Criterio de aceptación | Acceder con credenciales válidas y cerrar sesión. Una cuenta sin permisos que intente entrar por el acceso administrativo debe ser rechazada sin reemplazar la sesión vigente. |
| Aplicación actual | El acceso normal y administrativo validan credenciales antes de establecer la sesión. El acceso al panel exige un rol autorizado. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.2.4. Usuarios inventario y operación comercial

| RF-028 | Autenticar con servicios centrales |
| --- | --- |
| Usuario y estado | Cliente — Parcial |
| Descripción | El sistema final deberá autenticar y persistir usuarios mediante servicios centrales. |
| Criterio de aceptación | En la etapa final, acceder a la misma cuenta desde otro dispositivo con validación en servidor. |
| Aplicación actual | La V2 autentica datos locales; backend y cuentas centrales pendientes. |
| Origen | Caso de negocio y arquitectura final. |

| RF-029 | Administrar usuarios y roles |
| --- | --- |
| Usuario y estado | Administrador — Parcial |
| Descripción | El administrador deberá gestionar cuentas y roles; la solución final deberá permitir desactivación controlada. |
| Criterio de aceptación | Crear y editar una cuenta como administrador; bloquear la vista a vendedor. |
| Aplicación actual | El panel permite alta, edición y eliminación local. Desactivación con conservación histórica aún pendiente. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-030 | Gestionar catálogo e inventario |
| --- | --- |
| Usuario y estado | Personal — Implementado en V2 |
| Descripción | Administrador y vendedor deberán gestionar productos y ajustar sus existencias locales. |
| Criterio de aceptación | Modificar stock y precio y comprobar cambios en catálogo. |
| Aplicación actual | AdminDashboard.jsx y productService.js; sin conexión al inventario físico. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-031 | Descontar stock por venta |
| --- | --- |
| Usuario y estado | Sistema — Implementado en V2 |
| Descripción | La confirmación deberá descontar las unidades sólo si todas las líneas tienen disponibilidad suficiente. |
| Criterio de aceptación | Comprar dos unidades y verificar descenso de dos; compra sin stock no produce descuento. |
| Aplicación actual | orderService.js; cantidades enteras positivas y consolidación de líneas repetidas. |
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
| Usuario y estado | Cliente — Implementado en V2 |
| Descripción | El pedido deberá guardar cliente, líneas, importes y modalidad. El formulario exige dirección para despacho. |
| Criterio de aceptación | Completar compras con retiro y despacho y comprobar los datos guardados y el flete. |
| Aplicación actual | Checkout.jsx y orderService.js; visitantes y cuentas registradas pueden comprar localmente. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-034 | Consultar pedidos propios |
| --- | --- |
| Usuario y estado | Cliente — Implementado en V2 |
| Descripción | El usuario deberá consultar sus pedidos sin que la interfaz muestre comprobantes ajenos. |
| Criterio de aceptación | Abrir Mis pedidos e intentar consultar un identificador de otra cuenta. |
| Aplicación actual | MyOrders.jsx y getOrderForViewer; control local pendiente de respaldo en servidor. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-035 | Actualizar y anular pedidos |
| --- | --- |
| Usuario y estado | Personal — Implementado en V2 |
| Descripción | El personal deberá usar estados válidos, sin reabrir pedidos cerrados. Anular restituirá stock y crédito una sola vez. |
| Criterio de aceptación | Anular un pedido a crédito y comprobar restitución; repetir no duplica la devolución. |
| Aplicación actual | Estados CONFIRMADO, EN_PREPARACION, DESPACHADO, ENTREGADO y ANULADO. Se permite avanzar sin exigir cada paso intermedio; no retroceder. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-036 | Cargar compras a cuenta corriente |
| --- | --- |
| Usuario y estado | Contratista — Implementado en V2 |
| Descripción | Un contratista activo con cupo suficiente podrá cargar el total del pedido, incluido despacho, a su saldo. |
| Criterio de aceptación | Comprar con flete y comprobar incremento por el total; exceder cupo impide la compra. |
| Aplicación actual | Nuevo contratista: $2.500.000 de cupo. Semilla: $3.500.000 y saldo inicial $450.000. |
| Origen | Caso de negocio; alta automática y montos definidos para demo. |

| RF-037 | Consultar historial y saldo |
| --- | --- |
| Usuario y estado | Contratista — Parcial |
| Descripción | El contratista deberá consultar compras y saldo; el dueño deberá disponer de historial comercial por cliente. |
| Criterio de aceptación | Acceder como contratista y comparar sus pedidos, saldo y crédito disponible. |
| Aplicación actual | Mis pedidos muestra historial y saldo propios. Falta estado de cuenta comercial consolidado por período para el dueño. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RF-038 | Consultar reportes comerciales |
| --- | --- |
| Usuario y estado | Dueño — Parcial |
| Descripción | El dueño deberá consultar compras por cliente, productos más vendidos y clientes frecuentes para un período. |
| Criterio de aceptación | Elegir un período y contrastar los agregados con las ventas. |
| Aplicación actual | El panel presenta indicadores locales generales; no todos los reportes ni filtros temporales del caso. |
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
| Usuario y estado | Cliente — Parcial |
| Descripción | El catálogo final deberá consultar existencias centralizadas y reflejar ventas de distintos dispositivos. |
| Criterio de aceptación | Comprar desde un dispositivo y comprobar disponibilidad desde otro. |
| Aplicación actual | La V2 actualiza el almacenamiento local; inventario central pendiente. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.2.5. Multimedia y funciones incorporadas en V2

| RF-041 | Incorporar video del negocio |
| --- | --- |
| Usuario y estado | Usuario — Pendiente |
| Descripción | El sitio deberá ofrecer un video pertinente y acceso identificable para reproducirlo. |
| Criterio de aceptación | Abrir la vista y reproducir el video con sus controles. |
| Aplicación actual | La V2 no incorpora un video del negocio. El requisito permanece pendiente. |
| Origen | Continuidad de la ERS de primera entrega. |

| RF-042 | Filtrar y ordenar productos |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El catálogo deberá permitir búsqueda por texto, selección de categoría, ofertas y ordenamiento por el precio efectivo con descuento. |
| Criterio de aceptación | Combinar filtros, volver al catálogo completo y usar atrás o adelante. Los controles deben reflejar la URL. Ordenar por precio debe considerar el descuento. |
| Aplicación actual | Búsqueda, categoría y ofertas se derivan de la URL y se restablecen al abrir el catálogo sin filtros. El orden usa el precio que paga el cliente. |
| Origen | Funciones de búsqueda y navegación de la segunda etapa. |

| RF-043 | Consultar fichas y ofertas |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | El usuario deberá consultar una ficha por producto y una vista de artículos en oferta. |
| Criterio de aceptación | Abrir una tarjeta y revisar detalle; comprobar el precio rebajado en Ofertas. |
| Aplicación actual | La ficha presenta imagen referencial, marca, descripción, especificaciones y existencias. La vista de ofertas muestra los artículos rebajados. |
| Origen | Funciones de segunda etapa. |

| RF-044 | Calcular tarifa y cobertura local |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | La consulta de cobertura y el formulario de compra deberán utilizar la misma tarifa de demostración por comuna. Las comunas sin tarifa automática deberán solicitar cotización. |
| Criterio de aceptación | Seleccionar comuna o zona actualiza ambas opciones y la tarifa. La Serena y Coquimbo: $4.990 bajo $100.000 y cero desde ese monto; Vicuña: $14.990; otras comunas: cotización. |
| Aplicación actual | CoverageMap y Checkout utilizan shippingService. El retiro es gratuito; la consulta referencial no valida una dirección exacta. |
| Origen | Configuración de despacho de la demostración V2. |

| RF-045 | Demostrar compra fallida |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Simular fallo deberá mostrar resultado fallido sin registrar venta ni modificar stock o saldo. |
| Criterio de aceptación | Activar fallo y confirmar; comprobar carrito conservado y ausencia de pedido. |
| Aplicación actual | Checkout.jsx y CheckoutFailure.jsx. |
| Origen | Instrucciones de segunda entrega. |

| RF-046 | Autocompletar compra |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Con sesión iniciada, el checkout deberá proponer los datos disponibles de cliente y entrega. |
| Criterio de aceptación | Abrir checkout con una cuenta y productos y comprobar datos propuestos y posibilidad de corregirlos. |
| Aplicación actual | Checkout.jsx y AuthContext.jsx. |
| Origen | Instrucciones de segunda entrega. |

### 3.3. Requisitos no funcionales

#### 3.3.1. Rendimiento

El funcionamiento de esta versión se verifica con 27 productos y operaciones locales. La evaluación realizada cubre comportamiento y presentación, sin medir carga concurrente, capacidad de un servidor ni tiempos máximos de respuesta.

#### 3.3.2. Seguridad

| RNF-001 | Proteger credenciales |
| --- | --- |
| Usuario y estado | Equipo — Parcial |
| Descripción | Las contraseñas no deberán almacenarse como texto legible; la solución final deberá protegerlas en servidor. |
| Criterio de aceptación | Registrar o migrar cuenta y comprobar hash y sal; el objeto de sesión no debe contenerlos. |
| Aplicación actual | PBKDF2 SHA-256, sal aleatoria y 100.000 iteraciones mediante Web Crypto. Protección de demo; no autenticación de producción. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RNF-002 | Restringir acceso por rol y titularidad |
| --- | --- |
| Usuario y estado | Todos — Parcial |
| Descripción | La interfaz deberá aplicar permisos por rol y titular; el servidor deberá respaldarlos en la solución final. |
| Criterio de aceptación | Un cliente no accede al panel ni a pedidos ajenos. El vendedor no accede a usuarios. Un intento administrativo rechazado conserva la sesión anterior. |
| Aplicación actual | Las rutas, el acceso administrativo y la consulta de pedidos aplican controles locales. La autorización en servidor sigue pendiente. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RNF-003 | Validar operaciones en servidor |
| --- | --- |
| Usuario y estado | Equipo — Pendiente |
| Descripción | El backend deberá repetir validaciones y comprobar permisos sin confiar en los datos enviados por la interfaz. |
| Criterio de aceptación | Enviar una petición inválida a la futura API y verificar rechazo sin cambios. |
| Aplicación actual | No existe backend en esta etapa. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.3. Fiabilidad

| RNF-004 | Mantener consistencia de compra |
| --- | --- |
| Usuario y estado | Sistema — Parcial |
| Descripción | Las operaciones locales deberán conservar la coherencia entre pedido, existencias y saldo. La actualización de recursos visuales deberá preservar los datos comerciales guardados. |
| Criterio de aceptación | Ante un error al guardar un pedido, no quedan cargos ni descuentos parciales. Al actualizar fotos, se conservan precios, stock, catálogo personalizado y demás registros. |
| Aplicación actual | Las escrituras múltiples revierten cambios ante fallos. La actualización de imágenes sustituye solo referencias genéricas conocidas. El control transaccional y la concurrencia entre dispositivos corresponden al servidor. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.4. Disponibilidad

| RNF-005 | Utilizar recursos del proyecto |
| --- | --- |
| Usuario y estado | Usuario — Implementado en V2 |
| Descripción | Catálogo, imágenes y carrito deberán funcionar con archivos servidos por el proyecto. |
| Criterio de aceptación | Cargar las 27 imágenes y acceder a sus créditos sin solicitudes de imágenes a servicios externos durante el uso de la tienda. |
| Aplicación actual | Los recursos se almacenan en public/assets/img/productos y se sirven desde el proyecto. Los créditos identifican fuentes, licencias y descripciones de las imágenes generadas. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.5. Mantenibilidad

| RNF-006 | Mantener código organizado |
| --- | --- |
| Usuario y estado | Equipo — Implementado en V2 |
| Descripción | Separar páginas, componentes, contextos, datos, servicios y estilos y reutilizar reglas de cálculo y validación. |
| Criterio de aceptación | Localizar cálculo de precio, despacho y correo y comprobar su reutilización. |
| Aplicación actual | La aplicación organiza páginas, componentes, contextos, datos, servicios y estilos. Precio, despacho y validaciones reutilizan servicios comunes y la presentación utiliza variables CSS. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

#### 3.3.6. Portabilidad y facilidad de uso

| RNF-007 | Adaptar vistas a dispositivos |
| --- | --- |
| Usuario y estado | Usuario — Parcial |
| Descripción | Las vistas deberán ser utilizables a 360, 768 y 1280 píxeles con menú móvil y contenido accesible. |
| Criterio de aceptación | Recorrer tienda, formularios y panel a distintos anchos. La marca, las acciones y los iconos deben mantenerse utilizables y el documento no debe desbordarse. |
| Aplicación actual | Se verificaron cinco perfiles en ocho anchos de 360 a 1920 píxeles y 69 recorridos de vistas. La comprobación no cubre todos los dispositivos, estados ni criterios de accesibilidad. |
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
| Usuario y estado | Equipo — Parcial |
| Descripción | La solución final deberá integrar React con servicios Spring Boot mediante API REST. |
| Criterio de aceptación | Demostrar intercambio con servicios independientes y errores JSON en la etapa correspondiente. |
| Aplicación actual | React y Vite implementados; Spring Boot y API pendientes. CSS propio y Vitest son decisiones vigentes. |
| Origen | ERS de la primera versión y diseño funcional de la V2. |

| RT-002 | Guardar los datos en una base relacional |
| --- | --- |
| Usuario y estado | Equipo de desarrollo — Pendiente |
| Descripción | Los datos del sistema final deberán persistir en MySQL, PostgreSQL u Oracle, con un modelo normalizado al menos hasta tercera forma normal. |
| Criterio de aceptación | Usuarios, productos y operaciones se conservan después de reiniciar los servicios y el modelo cumple la normalización requerida. |
| Aplicación actual | La V2 conserva datos en localStorage. La base relacional corresponde a la etapa de integración con servicios centrales. |
| Origen | Tecnologías obligatorias del contexto del proyecto. |

| RT-003 | Desplegar el sistema con AWS y Docker |
| --- | --- |
| Usuario y estado | Equipo de desarrollo — Pendiente |
| Descripción | La solución final deberá utilizar AWS y Docker para su despliegue. |
| Criterio de aceptación | La aplicación puede iniciarse mediante sus contenedores y accederse en el entorno desplegado. |
| Aplicación actual | La V2 se ejecuta con Vite y genera archivos estáticos. El despliegue con AWS y Docker corresponde a una etapa posterior. |
| Origen | Tecnologías obligatorias del contexto del proyecto. |

#### 3.4.2. Criterios de las validaciones actuales

El registro exige RUN válido por Módulo 11, nombre de hasta 50 caracteres, apellidos y correo de hasta 100, dirección de hasta 300, región y comuna. Contacto exige nombre de hasta 100 y comentario de hasta 500. La obligatoriedad y los límites favorecen datos completos y reducen entradas accidentales; el RUN válido no acredita por sí solo la identidad de una persona.

Los dominios duoc.cl, profesor.duoc.cl y gmail.com y las contraseñas de cuatro a diez caracteres se mantienen como restricciones funcionales del prototipo. El formato y el dominio no acreditan la titularidad del correo. Las contraseñas locales se derivan mediante PBKDF2 con sal; el límite de longitud conservado no se presenta como política de seguridad de producción.

Región y comuna se seleccionan entre opciones configuradas. La cobertura de despacho se comprueba por separado con la comuna y el subtotal de la compra. En la solución con servidor, las validaciones y los permisos también deberán ejecutarse en el backend.

#### 3.4.3. Funciones observables de la segunda versión

Los siguientes ejemplos vinculan funciones de la entrega con sus requisitos. Las cuentas y los pedidos utilizados son ficticios. La medición asociada registra 92 pruebas aprobadas y las comprobaciones complementarias en navegador, detalladas en el informe de pruebas y cobertura.

| Función observable | Requisitos | Comportamiento de la V2 |
| --- | --- | --- |
| Navegar y filtrar el catálogo | RF-001 RF-004 RF-042 | 27 registros y siete categorías; filtros coherentes con la ruta y orden por precio con descuento. |
| Consultar imágenes y fichas | RF-006 RF-043 RNF-005 | La referencia corresponde al tipo de artículo, se ve completa y dispone de texto alternativo y créditos. |
| Modificar el carrito | RF-007 a RF-016 | Cantidades, contador y totales se actualizan; stock insuficiente impide aumentar unidades. |
| Comprar con retiro o despacho | RF-013 RF-017 RF-033 RF-044 | Se guarda el desglose, se descuenta stock y se conserva la confirmación tras vaciar el carrito. |
| Consultar cobertura referencial | RF-039 RF-044 | Comuna, zona y tarifa se sincronizan; las comunas sin tarifa automática requieren cotización. |
| Simular compra fallida | RF-045 RNF-004 | Se conserva el carrito sin generar pedido ni descontar existencias. |
| Comprar como contratista | RF-036 RF-037 | El total aumenta el saldo y reduce el crédito disponible; el historial muestra los pedidos propios. |
| Controlar acceso administrativo | RF-027 RNF-002 | Se rechazan perfiles sin permiso sin reemplazar la sesión actual. |
| Consultar y anular pedidos | RF-034 RF-035 RNF-002 | El cliente consulta pedidos propios; la anulación autorizada restituye stock y crédito una sola vez. |

La entrega comprende las funciones locales identificadas en estas fichas. La integración con servidor, los pagos reales, el correo saliente y la verificación geográfica exacta permanecen fuera de esta versión.
