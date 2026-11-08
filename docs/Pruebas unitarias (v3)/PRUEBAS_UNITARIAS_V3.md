# Informe de pruebas y cobertura de fase 3

> Documento de entrega y evidencia de la revisión indicada en el informe. Las referencias a AWS pendiente describen ese momento: el equipo confirmó posteriormente el despliegue. Para operación actual, consultar la [guía de despliegue](<../../Fase 3/despliegue/README.md>). Los resultados medidos y los archivos Word/Excel se conservan como registro de entrega.

Revisión 3.0 del 5 de noviembre de 2026.

[Documento Word](Informe_Pruebas_Unitarias_y_Cobertura_v3.docx) · [Índice de documentación](../README.md)

## Ficha del documento

| Dato | Descripción |
| --- | --- |
| Proyecto | Ferretería Los Maestros |
| Entrega | DSY1104 Desarrollo FullStack II Evaluación Parcial 3 |
| Integrantes | Sebastián Diaz, Jeremy Hanglin y Martín Caviedes |
| Revisión | 3.0 del 5 de noviembre de 2026 |
| Base examinada | Código local integrado de Fase 3; rama fase3/martin-usuarios con cambios de trabajo. |
| Evidencia | 118 casos de React y 25 de Java; cobertura V8 exclusiva del frontend. |

## 1 Objetivo y alcance

La ejecución del 5 de noviembre de 2026 aprobó las 118 pruebas de React en 19 archivos y las 25 pruebas del backend en seis clases. La cobertura de líneas de React fue 70,39 % (951 de 1351). No hubo casos fallidos ni omitidos en la ejecución final.

Este informe reúne resultados, métricas, trazabilidad con el ERS v3 y límites de verificación. Conserva el informe de fase 2 como antecedente independiente. La fase 3 usa APIs REST, JWT y datos de negocio centralizados; las pruebas de interfaz simulan respuestas para comprobar comportamientos controlados.

La suite combina pruebas de funciones, componentes e integración. Los casos de Spring Boot utilizan H2 y MockMvc; algunas dependencias se sustituyen por dobles de prueba. Los recorridos previos con MySQL y navegador complementan esta ejecución, pero no forman parte de los porcentajes de cobertura.

## 2 Entorno y procedimiento

| Elemento | Configuración y alcance |
| --- | --- |
| Frontend | Vitest 5.0.3 y @vitest/coverage-v8 5.0.3; jsdom 30.1.2 y Testing Library. |
| Ejecución | Windows, Node.js 24.22.1; cobertura React ejecutada a las 22:12, hora de Santiago. |
| Backend | Java 21.0.12.1, Spring Boot 3.5.16, Maven Wrapper y Surefire 3.5.6; destino Java 17. |
| Datos Java | Perfil local, H2 en memoria. No se conectó la suite Maven a MySQL. |
| Aislamiento | Datos ficticios; restauración de mocks y almacenamiento en frontend; contextos y datos de prueba en Java. |
| Instrumentación | V8 instrumenta src/**/*.{js,jsx}; excluye src/main.jsx, src/test/** y src/data/**. |

La cobertura incluye archivos elegibles aunque no reciban ejecución; no incluye CSS ni imágenes. Se calculan sentencias, ramas, funciones y líneas del frontend. No se configuró una medición JaCoCo de Java y no se atribuye a Java el porcentaje de React.

### Tipos de comprobación automatizada

| Tipo | Ejemplo y herramienta |
| --- | --- |
| Funciones y servicios | Validaciones, contratos HTTP y normalización de imágenes con Vitest. |
| Componentes e integración React | Formularios, sesión y rutas con jsdom; API o servicios simulados. |
| Integración Spring | Controladores, servicios, repositorios y permisos con MockMvc y H2. |
| Adaptador HTTP | Servidor HTTP de prueba para verificar la consulta de contratistas; no un servicio Usuarios desplegado. |

Un primer intento de instrumentación no pudo leer archivos temporales del entorno de ejecución. Se repitió con un directorio temporal accesible, sin modificar la aplicación ni sus pruebas. Los resultados siguientes corresponden a la ejecución final completada.

## 3 Resultados de ejecución

### 3.1 React

| Archivo de prueba | Casos | Resultado |
| --- | --- | --- |
| Access.test.jsx | 5 | Aprobadas |
| AdminUsers.test.jsx | 2 | Aprobadas |
| AuthSession.test.jsx | 7 | Aprobadas |
| Cart.test.jsx | 3 | Aprobadas |
| Checkout.test.jsx | 6 | Aprobadas |
| Contact.test.jsx | 4 | Aprobadas |
| Login.test.jsx | 3 | Aprobadas |
| ProductNavigation.test.jsx | 4 | Aprobadas |
| Register.test.jsx | 2 | Aprobadas |
| VentasIntegration.test.jsx | 6 | Aprobadas |
| catalogoJeremyFase3.test.jsx | 7 | Aprobadas |
| orderService.test.js | 10 | Aprobadas |
| productService.test.js | 15 | Aprobadas |
| regressions.test.js | 9 | Aprobadas |
| userApiService.test.js | 5 | Aprobadas |
| userService.test.js | 14 | Aprobadas |
| Navbar.test.jsx | 4 | Aprobadas |
| ProductCard.test.jsx | 5 | Aprobadas |
| ProfileNavigation.test.jsx | 7 | Aprobadas |
| Total | 118 | 0 fallidas; 0 omitidas |

La suite tardó 10,40 s en esta ejecución; ese tiempo incluye preparación y ejecución de pruebas, no representa latencia de usuario ni rendimiento de producción. Los nombres completos y estados de los casos se conservan en evidencias/resultados-v3.json.

### 3.2 Servicios Spring Boot

| Servicio y clase | Casos | Resultado |
| --- | --- | --- |
| usuarios / UsuariosMartinTests | 5 | 0 fallos y errores |
| usuarios / UsuariosServiceApplicationTests | 1 | 0 fallos y errores |
| ventas / CatalogoJeremyTests | 9 | 0 fallos y errores |
| ventas / PedidosSebaTests | 6 | 0 fallos y errores |
| ventas / UsuariosContratistasTests | 3 | 0 fallos y errores |
| ventas / VentasServiceApplicationTests | 1 | 0 fallos y errores |
| Total backend | 25 | 0 omitidas |

Usuarios ejecutó seis casos y Ventas diecinueve; ambos finalizaron con BUILD SUCCESS. Los casos contextLoads verifican el arranque del contexto y se contabilizan por separado de las reglas de negocio.

UsuariosMartinTests comprueba registro, duplicados, rechazo de roles administrativos en registro público, gestión y desactivación, documentación Swagger y credencial de consulta interna. CatalogoJeremyTests verifica catálogo, oferta efectiva, stock y permisos de escritura.

PedidosSebaTests verifica identidad del comprador, importes del servidor, rollback ante stock o crédito insuficiente, consultas autorizadas y restitución única al anular. UsuariosContratistasTests comprueba la habilitación con respuesta HTTP válida y el rechazo o conservación de la cuenta frente a perfiles inválidos o fallos de dependencia.

Las advertencias de instrumentación de Mockito y serialización de PageImpl no impidieron la ejecución. El error de unicidad registrado en H2 corresponde al caso que comprueba un RUN duplicado rechazado; Surefire reporta cero errores de prueba.

## 4 Casos relevantes y trazabilidad

| Comportamiento | Prueba representativa | ERS v3 |
| --- | --- | --- |
| Registro y roles públicos | Register.test.jsx; UsuariosMartinTests | RF-022 RF-026 RNF-002 |
| Acceso administrativo y baja | Access.test.jsx; UsuariosMartinTests | RF-027 RF-029 RNF-002 |
| Conservar formulario al volver a ventana | AuthSession.test.jsx; Checkout.test.jsx | RF-046 RF-048 |
| Compra y errores visibles | Checkout.test.jsx; orderService.test.js | RF-017 RF-033 RF-045 |
| Precio, identidad y rollback en servidor | PedidosSebaTests | RF-013 RF-031 RNF-004 |
| Pedidos propios y permisos de personal | PedidosSebaTests; catalogoJeremyFase3.test.jsx | RF-034 RNF-002 |
| Anular devuelve stock y crédito una vez | PedidosSebaTests | RF-035 RF-036 |
| Cupo administrado y contratista verificado | UsuariosContratistasTests; PedidosSebaTests | RF-047 |
| Comprobante e imágenes REST coherentes | VentasIntegration.test.jsx; productService.test.js | RF-006 RF-015 RF-033 |
| Filtros y navegación | ProductNavigation.test.jsx; ProfileNavigation.test.jsx | RF-001 RF-042 |

La tabla relaciona escenarios comprobados con requisitos; no constituye certificación completa de cada requisito. Un caso puede contener varias aserciones y cubrir más de una regla. El archivo de evidencia conserva los nombres para localizar cada escenario en el código.

## 5 Cobertura medida

| Métrica React | Cubierto / total | Porcentaje |
| --- | --- | --- |
| Sentencias | 1062 / 1573 | 67,51 % |
| Ramas | 827 / 1316 | 62,84 % |
| Funciones | 259 / 432 | 59,95 % |
| Líneas | 951 / 1351 | 70,39 % |

La cobertura indica código ejecutado durante esta suite. Las aserciones comprueban resultados; el porcentaje no demuestra por sí mismo que todos los escenarios, requisitos o fallos posibles estén cubiertos.

| Archivo | Sentencias | Ramas | Funciones | Líneas |
| --- | --- | --- | --- | --- |
| context/AuthContext.jsx | 95,60 % | 79,48 % | 100,00 % | 98,68 % |
| context/CartContext.jsx | 62,22 % | 55,88 % | 65,21 % | 67,53 % |
| services/apiService.js | 90,00 % | 96,29 % | 66,66 % | 94,11 % |
| services/orderService.js | 87,87 % | 70,00 % | 76,92 % | 88,88 % |
| services/productService.js | 73,91 % | 70,25 % | 82,00 % | 79,64 % |
| services/userApiService.js | 75,00 % | 66,66 % | 88,88 % | 80,00 % |
| pages/Register.jsx | 70,42 % | 60,00 % | 75,00 % | 75,80 % |
| pages/Checkout.jsx | 74,00 % | 59,59 % | 54,54 % | 77,77 % |
| pages/admin/AdminDashboard.jsx | 52,36 % | 53,52 % | 36,75 % | 52,72 % |
| App.jsx | 0,00 % | 0,00 % | 0,00 % | 0,00 % |

AuthContext tiene 98,68 % de líneas y AdminDashboard 52,72 %. App.jsx no recibió ejecución en esta suite. MyOrders alcanza 100 % de líneas, pero solo 37,50 % de ramas: ejecutar sus líneas no significa comprobar todas sus alternativas. Los valores por archivo están disponibles en la evidencia JSON.

El informe de fase 2 registró 60,85 % de líneas; el actual registra 70,39 %. Son mediciones sobre bases de código y conjuntos de pruebas diferentes: no se interpreta la diferencia como una comparación controlada de calidad ni se reutilizan los porcentajes anteriores.

## 6 Verificación complementaria y límites

| Comprobación | Resultado y procedencia |
| --- | --- |
| MySQL y APIs reales | Evidencias previas: compra, persistencia, rollback, crédito, anulación y concurrencia controlada. No se repitieron al medir cobertura. |
| Recorrido manual React | Martín confirmó compra, carrito vacío, historial, deuda, anulación y devolución de stock. Capturas en manual e informe de integración. |
| Regresiones posteriores | Foco de ventana, comprobante administrativo e imágenes confirmados manualmente y con casos automatizados. |
| Compilación y lint | Verificación previa: Vite y JAR correctos; Oxlint con 0 errores y 9 advertencias. No son métricas de cobertura. |

Los dobles de prueba permiten provocar errores de red y respuestas específicas, pero no validan por sí solos la comunicación entre procesos desplegados. Las pruebas con autenticación simulada verifican autorización en escenarios definidos; no sustituyen los recorridos previos con JWT firmado.

No se realizó una auditoría completa de accesibilidad, una nueva matriz de dispositivos móviles, una prueba de carga, un ensayo de disponibilidad ni una evaluación de seguridad de producción. Tampoco se midió cobertura Java. Los pagos continúan simulados y no se comprobó un despliegue completo en AWS.

La cobertura incluye servicios locales conservados de la etapa anterior además de los adaptadores REST. Su ejecución no demuestra que la persistencia local de fase 2 sea el almacenamiento de negocio actual. La aplicación integrada obtiene usuarios, catálogo, pedidos y crédito de las APIs.

## 7 Cobertura pendiente

| Prioridad | Área | Próxima comprobación útil |
| --- | --- | --- |
| Alta | Aplicación completa | Recorridos desde App con rutas reales y servicios desplegados; App.jsx tiene 0 % de líneas. |
| Alta | Administración y crédito | Más combinaciones de errores, edición y respuesta de cupos; AdminDashboard conserva ramas sin ejecutar. |
| Alta | Backend | Medir cobertura Java con una herramienta específica antes de afirmar un porcentaje. |
| Media | Consulta pública | Casos para Home, Offers, Categories y ProductDetail; sus líneas no reciben ejecución en esta suite. |
| Media | Errores y ramas | Red intermitente, reintentos y alternativas de MyOrders y CartContext. |
| Media | Accesibilidad y presentación | Teclado, foco de modales y matriz móvil actual; estas verificaciones no aumentan por sí mismas la cobertura V8. |

Las prioridades se basan en rutas sin ejecución y riesgos funcionales. El objetivo de ampliar las pruebas es comprobar decisiones y resultados relevantes; no aumentar porcentajes con pruebas que solo reproduzcan el código.

## 8 Reproducción y evidencias

Desde Fase 3/frontend, instalar las versiones del archivo de bloqueo y ejecutar:

```powershell
npm ci
npm run test:coverage -- --reporter=default --reporter=json --outputFile=test-results.json
```

Vitest genera coverage/index.html, coverage/coverage-final.json y test-results.json. El HTML permite inspección interactiva; el JSON de cobertura conserva contadores y el de pruebas identifica casos y estados. Las rutas se pueden redirigir con --coverage.reportsDirectory y --outputFile sin cambiar la configuración de inclusión.

Desde Fase 3/backend/usuarios-service y, por separado, desde ventas-service:

```powershell
.\mvnw.cmd test
```

Los resultados Java se generan en target/surefire-reports de cada servicio. Utilizar el perfil local predeterminado para reproducir esta suite H2. No activar el perfil mysql para atribuirle estos resultados; la preparación de la integración real está en el README del backend.

Se publica evidencias/resultados-v3.json con resultados por archivo y clase, nombres de casos y contadores de cobertura por archivo. No contiene contraseñas, tokens, rutas personales ni los volcados de propiedades de la JVM. La salida detallada se regenera con los comandos anteriores.

## 9 Referencias

ERS Ferretería Los Maestros v3; APIs e Integración v3; informe de pruebas de fase 2; vite.config.js y package-lock.json del frontend; pruebas en src/test; pom.xml y pruebas Java de ambos servicios; pauta DSY1104 Evaluación Parcial 3 Anexo 1. Las referencias corresponden a archivos del repositorio.

## Archivos de consulta

[Resultados y cobertura por archivo](evidencias/resultados-v3.json)

[ERS v3](<../ERS actualizado (v3)/ERS_actualizado_v3.md>) · [APIs e integración](<../APIs e Integracion/APIS_E_INTEGRACION.md>)
