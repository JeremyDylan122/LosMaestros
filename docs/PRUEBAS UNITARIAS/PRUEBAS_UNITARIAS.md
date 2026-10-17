# Informe de pruebas unitarias y cobertura

Ferretería Los Maestros revisión 2.2 del 16 de octubre de 2026

[Documento Word](Informe_Pruebas_Unitarias_y_Cobertura.docx) · [Índice de documentación](../README.md)

**Contenido**

- [Objetivo y alcance](#1-objetivo-y-alcance)
- [Resultados de ejecución](#3-resultados-de-ejecución)
- [Casos y trazabilidad](#4-casos-relevantes-y-trazabilidad)
- [Cobertura medida](#5-cobertura-medida)
- [Reproducción y evidencias](#8-reproducción-y-evidencias)

## Ficha del documento

| Dato | Descripción |
| --- | --- |
| Proyecto | Ferretería Los Maestros |
| Entrega | DSY1104 Desarrollo FullStack II Evaluación Parcial 2 |
| Integrantes | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes |
| Revisión | 2.2 del 16 de octubre de 2026 |
| Base examinada | Aplicación React V2 revisada para la entrega del 16 de octubre de 2026. |
| Estado | Versión final para la segunda entrega |

| Versión | Cambio |
| --- | --- |
| 2.1 | Registro inicial de 78 pruebas, medición de cobertura y alcance de las comprobaciones. |
| 2.2 | Consolidación de 92 pruebas en 13 archivos, métricas finales y verificación de navegación, perfiles, cobertura e imágenes. |

## 1 Objetivo y alcance

La suite de la segunda versión ejecutó 92 pruebas en 13 archivos, todas aprobadas y sin casos omitidos. La cobertura global de líneas es 60,85 %. Las pruebas verifican reglas de servicios, componentes de interfaz y flujos integrados de compra y acceso. Las comprobaciones en navegador complementan la medición con revisión de perfiles, adaptación e imágenes.

Este informe presenta el entorno, los casos ejecutados, su relación con los requisitos del ERS y los resultados de cobertura. El alcance corresponde a React, Vite, CSS propio y almacenamiento local. Las pruebas de servicios centrales, base de datos, pagos y despacho reales pertenecen a una etapa posterior.

La demostración incluye la habilitación automática de crédito para nuevos contratistas y conserva las validaciones de la interfaz. Las pruebas unitarias se ejecutan con Vitest, herramienta indicada por el docente para esta entrega. La adaptación visual utiliza CSS del proyecto.

## 2 Entorno y procedimiento

| Elemento | Configuración observada |
| --- | --- |
| Pruebas | Vitest 5.0.3 y proveedor @vitest/coverage-v8 5.0.3. |
| Interfaz | React 19.3.0, Vite 8.3.4 y CSS propio. |
| Simulación DOM | jsdom 30.1.2 y Testing Library. |
| Ejecución | Windows con Node.js 24.19.0. Suite final ejecutada sobre el proyecto integrado. |
| Aislamiento | Datos ficticios; limpieza de almacenamiento entre casos y restauración de espías. |
| Comando de pruebas | npm run test:coverage -- --reporter=json --outputFile=test-results.json |
| Verificación complementaria | Compilación Vite, análisis Oxlint y recorridos en Microsoft Edge con un perfil aislado. |

La cobertura incluye src/**/*.{js,jsx} y excluye src/main.jsx, src/test/** y src/data/** según vite.config.js. El cálculo global incorpora los archivos incluidos aunque ninguna prueba los ejecute. CSS, imágenes y datos iniciales no forman parte de la instrumentación JavaScript; su carga y presentación se comprueban por separado en navegador.

La suite utiliza datos ficticios y aísla el almacenamiento entre casos. Las pruebas de servicios comprueban resultados y cambios de datos; las de componentes verifican renderizado, propiedades, estado y eventos. Los casos de compra y acceso combinan componentes, contextos y servicios locales.

### Tipos de comprobación automatizada

| Tipo de comprobación | Caso representativo | Archivo |
| --- | --- | --- |
| Renderizado y propiedades | Producto, precio, oferta y advertencia de stock según los datos recibidos. | ProductCard.test.jsx |
| Estado de formularios | Entrada de campos, errores y resultado válido del contacto. | Contact.test.jsx |
| Eventos | Apertura y cierre del menú; acceso al historial desde el menú móvil. | Navbar.test.jsx y ProfileNavigation.test.jsx |
| Navegación | Restauración de búsqueda al retroceder y regreso al catálogo completo. | ProductNavigation.test.jsx |
| Integración local | Compra válida o fallida y confirmación con contextos, rutas y servicios. | Checkout.test.jsx y Access.test.jsx |

## 3 Resultados de ejecución

| Archivo | Pruebas | Resultado |
| --- | --- | --- |
| Navbar.test.jsx | 4 | Aprobadas |
| ProductCard.test.jsx | 5 | Aprobadas |
| ProfileNavigation.test.jsx | 7 | Aprobadas |
| ProductNavigation.test.jsx | 4 | Aprobadas |
| orderService.test.js | 4 | Aprobadas |
| productService.test.js | 15 | Aprobadas |
| regressions.test.js | 22 | Aprobadas |
| userService.test.js | 14 | Aprobadas |
| Access.test.jsx | 4 | Aprobadas |
| Cart.test.jsx | 3 | Aprobadas |
| Checkout.test.jsx | 3 | Aprobadas |
| Contact.test.jsx | 4 | Aprobadas |
| Login.test.jsx | 3 | Aprobadas |
| Total | 92 | 0 fallidas |

El resultado comprende los 13 archivos enumerados. ProfileNavigation.test.jsx aporta siete casos de acceso administrativo, menú móvil y sincronización de cobertura. ProductNavigation.test.jsx aporta cuatro casos de filtros, historial y precio rebajado. productService.test.js incluye tres casos de actualización de imágenes sin pérdida de datos.

## 4 Casos relevantes y trazabilidad

| Comportamiento comprobado | Evidencia | ERS |
| --- | --- | --- |
| Precio rebajado, importes y cargo del flete a crédito | regressions.test.js | RF-013 RF-036 RF-044 |
| Cantidades inválidas y líneas repetidas | regressions.test.js | RF-009 RF-031 |
| Fallo de escritura revierte stock y crédito | regressions.test.js | RNF-004 |
| Confirmación visible tras vaciar el carrito | Checkout.test.jsx | RF-017 RF-033 |
| Compra fallida conserva carrito y existencias | Checkout.test.jsx | RF-045 |
| Error del servicio comunicado en el formulario | Checkout.test.jsx | RF-017 RNF-004 |
| Pedidos propios y bloqueo de pedidos ajenos | regressions.test.js y Access.test.jsx | RF-034 RNF-002 |
| Anulación restituye stock y saldo una sola vez | regressions.test.js | RF-035 RF-036 |
| Credenciales derivadas y cambio de contraseña | regressions.test.js y userService.test.js | RF-027 RNF-001 |
| RUN inválido rechazado en servicio y panel | regressions.test.js y Access.test.jsx | RF-022 RF-029 |
| Acceso administrativo rechazado sin sustituir sesión | ProfileNavigation.test.jsx | RF-027 RNF-002 |
| Historial del contratista accesible en menú móvil | ProfileNavigation.test.jsx | RF-001 RF-037 RNF-007 |
| Comuna, zona y tarifa sincronizadas | ProfileNavigation.test.jsx | RF-039 RF-044 |
| Filtros restaurados por la ruta y orden con descuento | ProductNavigation.test.jsx | RF-001 RF-042 |
| Fotos actualizadas sin alterar datos ni imágenes personalizadas | productService.test.js | RF-006 RF-015 RNF-004 |
| Crédito automático de nuevo contratista | regressions.test.js | RF-026 RF-036 |

Las pruebas de componentes utilizan jsdom y rutas en memoria. Los casos de compra integran formulario, proveedores de estado y servicios de almacenamiento. Los espías de Vitest provocan fallos controlados de escritura o de servicios para comprobar la respuesta de la aplicación y restauran el comportamiento original después de cada caso.

## 5 Cobertura medida

| Métrica | Cubierto / total | Porcentaje |
| --- | --- | --- |
| Sentencias | 785 / 1312 | 59,83 % |
| Ramas | 598 / 1121 | 53,34 % |
| Funciones | 177 / 357 | 49,57 % |
| Líneas | 701 / 1152 | 60,85 % |

Las sentencias indican instrucciones ejecutadas; las ramas representan alternativas de decisión; las funciones, funciones invocadas; y las líneas, líneas instrumentadas ejecutadas. La cobertura describe ejecución, mientras las aserciones verifican resultados. Un porcentaje alto no demuestra por sí solo que todas las reglas o escenarios posibles sean correctos.

| Área o archivo | Sentencias | Ramas | Funciones | Líneas |
| --- | --- | --- | --- | --- |
| Servicios en conjunto | 86,84 % | 78,55 % | 95,06 % | 90,96 % |
| orderService.js | 92,15 % | 86,13 % | 100,00 % | 97,22 % |
| userService.js | 83,33 % | 73,10 % | 100,00 % | 87,38 % |
| productService.js | 83,78 % | 74,19 % | 86,66 % | 88,50 % |
| shippingService.js | 90,00 % | 93,75 % | 100,00 % | 100,00 % |
| Navbar.jsx | 84,31 % | 79,62 % | 85,00 % | 84,31 % |
| CoverageMap.jsx | 95,45 % | 92,85 % | 90,90 % | 94,44 % |
| Products.jsx | 60,97 % | 64,00 % | 38,46 % | 69,69 % |
| AdminDashboard.jsx | 31,61 % | 24,89 % | 13,00 % | 31,02 % |

Los servicios alcanzan 90,96 % de cobertura de líneas porque concentran precio, stock, crédito y persistencia. Las pruebas recientes cubren también navegación y cobertura referencial. El panel administrativo se ejecuta parcialmente: 31,02 % de sus líneas. App.jsx, Register.jsx y distintas páginas informativas no reciben ejecución en esta suite; las comprobaciones de navegador no modifican la cobertura de Vitest.

## 6 Revisión complementaria y límites

| Comprobación | Resultado y alcance |
| --- | --- |
| Compilación de producción | Vite completó la compilación sin errores. La aplicación generada se verificó en navegador. |
| Análisis estático | Oxlint informó cero errores y seis advertencias: cuatro sobre actualización de estado en efectos y dos sobre exportaciones para recarga rápida. |
| Cabecera por perfil | Visitante, administrador, vendedor, contratista y cliente; ocho anchos de 360 a 1920 px. Las 40 combinaciones no presentaron iconos comprimidos ni superposición de marca y acciones. |
| Recorridos de vistas | 69 comprobaciones de tienda, compra y panel en tres anchos, sin desbordamientos del documento ni errores JavaScript registrados. |
| Cobertura de despacho | Selección de comuna o zona sincronizada con la tarifa; otras comunas muestran solicitud de cotización. El esquema no valida una dirección real. |
| Imágenes y persistencia | 27 referencias cargadas; 24 productos actualizados con 23 archivos nuevos. Se conservaron stock y precio al actualizar fotos antiguas; ficha y carrito muestran la imagen vigente. |
| Presentación final | Catálogo, ficha, carrito y créditos revisados en la compilación de producción. Comprobaciones de imágenes en 390 y 1440 px sin desbordamientos. |

La revisión de interfaz registró 40 combinaciones de cinco perfiles y ocho anchos, además de 69 comprobaciones de vistas en tres anchos. La revisión de imágenes verificó la carga de las 27 referencias, su presentación en catálogo, ficha y carrito y la conservación de datos al sustituir fotos antiguas. La compilación final también se recorrió en navegador con datos ficticios.

El alcance no incluye una auditoría completa de accesibilidad, compatibilidad con todos los navegadores ni pruebas sobre dispositivos físicos. Tampoco cubre concurrencia entre pestañas o dispositivos, pérdida prolongada del almacenamiento ni seguridad de servidor. Las credenciales derivadas evitan el texto legible, pero los datos y roles locales siguen bajo control del propietario del navegador.

## 7 Cobertura pendiente

| Prioridad | Área | Cobertura adicional prevista |
| --- | --- | --- |
| Alta | Registro y administración | Recorridos completos de registro, CRUD y edición de crédito mediante la interfaz. Actualmente se comprueban validaciones y permisos concretos. |
| Alta | Inventario y persistencia | Concurrencia entre pestañas y recuperación ante bloqueo prolongado del almacenamiento. Los fallos locales y la actualización de fotos ya tienen pruebas específicas. |
| Media | Aplicación y navegación | Recorridos completos de App y combinaciones adicionales de filtros; historial, limpieza de filtros y precio rebajado ya están cubiertos. |
| Media | Accesibilidad | Navegación completa por teclado, modales, lectores de pantalla y estados adicionales del panel. |
| Etapa posterior | Backend y servicios reales | Autorización de servidor, transacciones, API, base de datos y pagos cuando se incorpore esa arquitectura. |

Las áreas pendientes delimitan el alcance de esta medición. La cobertura global permite localizar código sin ejecución automatizada; las pruebas funcionales y las verificaciones visuales aportan evidencias complementarias sobre los escenarios descritos.

## 8 Reproducción y evidencias

La reproducción utiliza el directorio fase 2/proyecto_Etapa2_REACT y las dependencias del archivo de bloqueo. La secuencia de comandos es la siguiente:

```text
npm ci
npm run test:coverage -- --reporter=json --outputFile=test-results.json
npm run build
npm run lint
```

La ejecución genera coverage/index.html, coverage/coverage-final.json y test-results.json. El primer archivo presenta el informe navegable, el segundo conserva los contadores instrumentados y el tercero identifica cada caso y su resultado. Los porcentajes corresponden a la medición de la revisión 2.2.

El informe reúne las métricas finales y el alcance de las comprobaciones de navegador. Los resultados de pruebas, cobertura y análisis estático se generan al ejecutar los comandos anteriores.

## 9 Referencias

ERS Ferretería Los Maestros revisión 2.2; DSY1104 Evaluación Parcial 2_EE_EP_Estudiante.pdf; DSY1104 Evaluación Parcial 2 - Anexo 1 Instrucciones.pdf; 2.3.4 MC_Informes de cobertura.docx; configuración de Vitest, archivo de bloqueo y código del repositorio. Vitest se utiliza conforme a la indicación docente de la segunda entrega.
