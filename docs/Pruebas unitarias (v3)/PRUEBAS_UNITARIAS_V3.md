# Informe de pruebas y cobertura de Ferretería Los Maestros

Revisión 3.1 del 13 de noviembre de 2026.

[Documento Word](Informe_Pruebas_Unitarias_y_Cobertura_v3.docx) · [Índice de documentación](../README.md)

## Ficha del documento



| Dato | Descripción |
| --- | --- |
| Proyecto | Ferretería Los Maestros |
| Entrega | DSY1104 Desarrollo FullStack II Evaluación Parcial 3 |
| Integrantes | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes |
| Revisión | 3.1 del 13 de noviembre de 2026 |
| Base examinada | React, Usuarios y Ventas de Fase 3; main 8f23bf4 con el ajuste de navegación de Navbar.jsx. |
| Estado | Informe de resultados de React y los microservicios Spring Boot |

## 1 Objetivo y alcance

Las suites ejecutaron 28 pruebas: tres del frontend React, seis de Usuarios y diecinueve de Ventas. Todas aprobaron, sin fallos, errores ni casos omitidos. La cobertura de líneas del frontend fue 2,02 % (27 de 1335); no se midió cobertura de Java.

Este informe presenta el entorno, los casos y resultados, su relación con el ERS y la cobertura del frontend medida mediante V8. Incluye reglas unitarias de React y pruebas automatizadas de Spring Boot con H2, MockMvc y colaboradores de prueba. La persistencia con MySQL y los recorridos desplegados se documentan por separado en APIs e integración.

Los tres casos de React invocan funciones con datos definidos y comparan su respuesta con el resultado esperado, sin navegador ni solicitudes a los microservicios. Las pruebas Java verifican servicios, acceso HTTP simulado, repositorios y transacciones dentro de contextos de Spring. Una clase de Ventas utiliza un servidor HTTP local controlado para representar Usuarios.

## 2 Entorno y procedimiento



| Elemento | Configuración |
| --- | --- |
| Fecha de ejecución | 13 de noviembre de 2026, 23:03, hora de Santiago |
| Sistema y ejecución | Windows; Node.js 24.22.1 |
| Aplicación | React y Vite 8.3.4 |
| Pruebas | Vitest 5.0.3; entorno jsdom 30.1.2 |
| Cobertura | Proveedor V8 mediante @vitest/coverage-v8 5.0.3 |
| Preparación | Dependencias fijadas en package-lock.json; setup en src/test/setup.js |
| Ubicación | Fase 3/frontend; casos en src/test/services/ |

El procedimiento consiste en instalar las dependencias, ejecutar la suite y generar el informe de cobertura. Los comandos se ejecutan desde Fase 3/frontend:

```powershell
npm ci
npm run test:run
npm run test:coverage
```

Vitest informa el estado de cada archivo y cada caso. La ejecución con cobertura genera coverage/index.html para consulta y coverage/coverage-final.json con los contadores por archivo. La ejecución medida utilizó también el reportero JSON para registrar los nombres y estados de los casos.

La instrumentación incluye src/**/*.{js,jsx} y excluye src/main.jsx, src/test/** y src/data/**, conforme a vite.config.js. Los archivos incluidos que no reciben ejecución permanecen en el total de cobertura.

## 3 Casos de React y trazabilidad



| Caso y responsable | Servicio y archivo | Resultado |
| --- | --- | --- |
| PU-01 Martín | userService.validateEmail; userService.test.js | Aprobado |
| PU-02 Jeremy | productService.getUnitPrice; productService.test.js | Aprobado |
| PU-03 Sebastián | shippingService.quote; shippingService.test.js | Aprobado |

PU-01. Se validaron alumno@duoc.cl, docente@profesor.duoc.cl y cliente@gmail.com, con respuesta esperada true. Para cliente@hotmail.com se esperaba false. Las cuatro comparaciones coincidieron con los resultados esperados.

PU-02. Se utilizó un producto con precio 10000, enOferta true y descuento 20. La función devolvió 8000, coincidente con el precio unitario esperado de $8.000.

PU-03. Se cotizó RETIRO_TIENDA con Región Metropolitana de Santiago, comuna Santiago y subtotal 10000. La respuesta indicó available true y fee 0, coincidente con el retiro disponible y gratuito.



| Caso | Requisito relacionado | Parte comprobada |
| --- | --- | --- |
| PU-01 | RF-023 Validar correos | Dominios admitidos y rechazo de un dominio ajeno. |
| PU-02 | RF-013 Calcular importes coherentes | Precio unitario con una oferta de 20 %. |
| PU-03 | RF-044 Calcular tarifa y cobertura local | Retiro gratuito con una dirección fuera de cobertura. |

La relación con el ERS identifica la regla ejercitada por cada caso. No acredita todas las condiciones del requisito: no se prueban aquí las demás estructuras de correo, el total transaccional del pedido ni las tarifas de despacho a domicilio.

## 4 Pruebas de Spring Boot

Las pruebas se ejecutaron el 13/11/2026 con Java 21.0.12.1, Spring Boot 3.5.16, JUnit Jupiter y Maven Surefire 3.5.6. Ambos proyectos declararon BUILD SUCCESS. Usuarios terminó a las 23:58:46 y Ventas a las 23:58:49, hora de Santiago. El perfil local utiliza H2 en memoria con creación y eliminación del esquema.

Desde Fase 3/backend/usuarios-service y, por separado, desde Fase 3/backend/ventas-service, ejecutar el Maven Wrapper:

```powershell

.\mvnw.cmd -B -ntp test

```



| Servicio | Clase ejecutada | Casos | Resultado |
| --- | --- | --- | --- |
| Usuarios | UsuariosMartinTests | 5 | Aprobados |
| Usuarios | UsuariosServiceApplicationTests | 1 | Aprobado |
| Ventas | CatalogoJeremyTests | 9 | Aprobados |
| Ventas | PedidosSebaTests | 6 | Aprobados |
| Ventas | UsuariosContratistasTests | 3 | Aprobados |
| Ventas | VentasServiceApplicationTests | 1 | Aprobado |

Usuarios comprobó registro, perfil y duplicados; rechazo de roles de gestión en el registro público; credencial del canal interno; gestión administrativa y bloqueo de login tras desactivar una cuenta; esquemas de seguridad de OpenAPI y arranque del contexto. Estas comprobaciones se relacionan con RF-026, RF-027, RF-029 y RNF-002.

Ventas comprobó consulta pública del catálogo, alta y ajuste de stock por ADMIN, rechazo de modificaciones según rol, stock crítico, precio efectivo, adaptación del catálogo a pedidos y seguridad OpenAPI. En pedidos verificó precio e identidad del servidor, permisos, stock o crédito insuficientes sin cambios parciales, consulta administrativa de crédito y restitución única al repetir una anulación. Estos casos se relacionan con RF-013, RF-030, RF-035, RF-036 y RNF-004.

UsuariosContratistasTests comprobó la habilitación de un contratista mediante una respuesta HTTP controlada, el rechazo de perfiles no válidos y la conservación de la cuenta cuando Usuarios falla. Los casos contextLoads verifican el arranque de Spring. MockMvc no levanta un servidor comercial real; Ventas simula JWT y sustituye algunos colaboradores. Estas pruebas utilizan H2 y no acreditan por sí solas la integración con MySQL o AWS.

## 5 Resultados y cobertura



| Componente | Aprobadas | Fallos | Errores | Omitidas |
| --- | --- | --- | --- | --- |
| React | 3 | 0 | 0 | 0 |
| Usuarios | 6 | 0 | 0 | 0 |
| Ventas | 19 | 0 | 0 | 0 |
| Total | 28 | 0 | 0 | 0 |



| Métrica React V8 | Cubierto y total | Porcentaje |
| --- | --- | --- |
| Sentencias | 29 de 1560 | 1,85 % |
| Ramas | 19 de 1318 | 1,44 % |
| Funciones | 4 de 430 | 0,93 % |
| Líneas | 27 de 1335 | 2,02 % |

Las 28 pruebas finalizaron correctamente. Vitest tardó 2,89 segundos; Maven informó 20,591 segundos para Usuarios y 24,113 segundos para Ventas. Son duraciones de ejecución de suites independientes, incluida su preparación, y no representan el tiempo de respuesta de la aplicación para un usuario.

La cobertura expresa la proporción de código instrumentado que se ejecutó durante la suite. El 2,02 % de líneas corresponde al alcance de las tres reglas unitarias seleccionadas y no acredita una cobertura completa del frontend. Los componentes, las páginas y los recorridos que no se invocan desde estos casos no reciben ejecución.

## 6 Conclusiones y límites

Las reglas de React y los escenarios de Usuarios y Ventas devolvieron los resultados esperados. Las pruebas cubren los tres cálculos o validaciones seleccionados del frontend y escenarios de registro, permisos, catálogo, compra, crédito y anulación del backend. No se observaron fallos ni errores en las 28 pruebas ejecutadas.

Los escenarios con H2 y colaboradores de prueba no constituyen un recorrido completo de la interfaz contra MySQL. Tampoco prueban todas las combinaciones de permisos o errores ni la operación del sistema desplegado. La cobertura V8 se aplica exclusivamente al frontend; no se configuró una medición JaCoCo para Java. La evaluación de rendimiento, accesibilidad y seguridad completa queda fuera de estas ejecuciones.

## 7 Evidencias y referencias

El archivo evidencias/resultados-v3-1.json conserva la fecha de ejecución, los tres nombres de caso, sus estados y los contadores globales de cobertura. El archivo evidencias/resultados-backend-v3-1.json registra las seis clases Java, sus 25 nombres de caso y sus contadores. Los reportes Maven se generan en target/surefire-reports de cada microservicio; las evidencias publicadas excluyen propiedades de la JVM, credenciales y la salida de diagnóstico.

Fuentes del repositorio: src/test/services/userService.test.js, productService.test.js y shippingService.test.js; vite.config.js; package-lock.json; ERS actualizado v3 y APIs e integración v3.

Las comprobaciones con MySQL y los recorridos desplegados se consultan en docs/APIs e Integracion/APIS_E_INTEGRACION.md. Esas comprobaciones se mantienen separadas de las 28 pruebas automatizadas de este informe.

## Archivos de consulta

[Resultados de React](evidencias/resultados-v3-1.json)

[Resultados de Spring Boot](evidencias/resultados-backend-v3-1.json)

[ERS v3](<../ERS actualizado (v3)/ERS_actualizado_v3.md>) · [APIs e integración](<../APIs e Integracion/APIS_E_INTEGRACION.md>)
