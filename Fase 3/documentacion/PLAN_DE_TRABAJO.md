# Plan de trabajo para la fase 3

Reparto propuesto para que los tres integrantes desarrollen backend, prueben su parte y la conecten al frontend. Las plantillas ya están configuradas; la lógica de negocio queda a cargo del equipo.

## Secuencia

1. Revisar la propuesta de dos servicios, permisos de vendedor, continuidad del contratista y compra con sesión. Actualizar el ERS con las decisiones.
2. Usar las plantillas Java 17 / Spring Boot 3.5.16 incluidas, crear las bases MySQL y acordar DTO y contratos antes de conectar React.
3. Implementar Usuarios con registro, login, JWT y permisos. Preparar cuentas ficticias sin subir secretos.
4. Implementar catálogo en Ventas e integrar consulta y gestión autorizada en React. Reutilizar los 27 productos de demostración.
5. Implementar pedidos, stock y crédito con transacciones, anulación e historial propio. Integrar checkout y panel.
6. Probar casos correctos y errores; completar Swagger, documentación de APIs, integración y manual con evidencia real.
7. Preparar repositorios públicos y comprimidos separados de frontend/backend, instrucciones de ejecución y presentación de 15 minutos más 5 de preguntas.

## Trabajo entre tres integrantes

| Responsable y frente | Resultado que implementará |
| --- | --- |
| Martín — Usuarios y seguridad | `usuarios-service`: módulos `usuario` y `auth`, JWT y reglas de acceso. Integración de login, registro, sesión y administración de usuarios. Pruebas y documentación de sus endpoints. |
| Jeremy — Catálogo e inventario | `ventas-service`: módulo `catalogo`, productos, categorías y stock. Integración de catálogo, detalle y gestión de productos. Pruebas y documentación de sus endpoints. |
| Seba — Pedidos y cuenta corriente | `ventas-service`: módulos `pedidos` y `cuentacorriente`, compra, anulación y crédito. Integración de checkout, historial y gestión de pedidos. Pruebas y documentación de sus endpoints. |

Los dos frentes comerciales trabajan en el mismo servicio: acordar archivos y contratos para evitar conflictos. Cada integrante documenta y prueba lo que implementa; el equipo revisa la integración y todos deben poder explicar el flujo completo.

Jeremy define con Seba las operaciones internas para consultar precios y descontar/restituir stock. Seba coordina la transacción completa de compra y anulación, utilizando esas operaciones. Martín acuerda con ambos el contenido del JWT y la validación de permisos; Jeremy y Seba aplican esos permisos a sus endpoints. Las clases de configuración compartidas de Ventas se modifican coordinadamente.

Ramas sugeridas: `fase3/martin-usuarios`, `fase3/jeremy-catalogo` y `fase3/seba-pedidos`. Cada cambio se revisa antes de integrarlo. No se han creado ramas ni asignaciones remotas.

## Qué está preparado y qué queda por hacer

Preparado: dos proyectos independientes, Maven Wrapper, dependencias, paquetes por responsabilidad, puertos distintos, perfiles H2 local/MySQL y prueba de arranque del contexto.

Parte de Seba implementada: entidades y esquema SQL de pedidos/cuentas, repositorios, DTO, servicios transaccionales, controladores, validaciones, permisos de sus rutas, consumo de JWT, errores y cinco pruebas. Ver [API y contratos de integración](IMPLEMENTACION_SEBA.md).

Pendiente del equipo: catálogo y su adaptador (Jeremy), Usuarios y emisión del JWT/verificación de contratistas (Martín), CORS e integración React por sus responsables. No se implementaron las partes de Jeremy o Martín; las operaciones dependientes quedan explícitamente bloqueadas hasta conectarlas.

## Verificaciones para la implementación

Para la parte de Seba se priorizan los [cinco casos de prueba definidos](PRUEBAS_SEBA.md), sin meta porcentual de cobertura. Ya están automatizados en `PedidosSebaTests`, sin medir cobertura.

- Datos conservados después de reiniciar los servicios.
- Registro y login válidos e inválidos; token vencido o alterado rechazado.
- Vendedor sin acceso a escrituras; cliente sin acceso a pedidos ajenos ni gestión.
- Pedido recalculado en servidor aunque se alteren los precios del carrito.
- Stock y crédito insuficientes sin escrituras parciales; dos compras concurrentes sin sobreventa.
- Anulación repetida sin devolver dos veces stock o crédito.
- Errores de red visibles en React sin informar éxito ni perder el carrito.
- Pruebas existentes de fase 2 conservadas como antecedente; adaptar las afectadas al nuevo comportamiento asíncrono.

## Documentación pendiente

| Entregable | Contenido que debe prepararse al implementar |
| --- | --- |
| ERS final | Requisitos actualizados, alcance, roles, reglas y estado real |
| APIs | Método, ruta versionada, entrada, respuestas, autenticación, roles y observaciones por endpoint real |
| APIs e integración | Modelo de datos, URLs reales, Swagger, comunicación React/backend, pruebas y capturas de éxito/error |
| Manual | Instalación, inicio de sesión y recorridos por perfil con pantallazos detallados |
| Guía de ejecución | Requisitos, configuración sin secretos, bases de datos, orden de arranque y datos de demostración |

Los anexos se mantienen como originales de referencia. Las nuevas versiones de entrega se guardarán en `Fase 3/documentacion/`, separadas de esos originales. Las URLs y resultados se registrarán cuando existan; no completar plantillas con evidencia inventada.
