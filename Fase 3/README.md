# Fase 3 — Backend e integración

Estado: backend de catálogo, pedidos y cuenta corriente implementado. Usuarios tiene registro, login, JWT y administración conectados a React. Ambos backends se verificaron con MySQL, incluyendo persistencia tras reinicio, rollback y dos compras simultáneas. Catálogo público, checkout, historial, comprobantes y cuenta corriente de React ya consultan Ventas. La validación de sesión conserva formularios al recuperar el foco y las imágenes se normalizan antes de mostrarse y guardarse en caché. Los [documentos formales de fase 3](../docs/README.md) incluyen ERS, manual, planilla de endpoints e informe de integración. Ver [pruebas MySQL](documentacion/PRUEBAS_MYSQL.md), [implementación de Martín](documentacion/IMPLEMENTACION_MARTIN.md), [catálogo de Jeremy](documentacion/IMPLEMENTACION_JEREMY.md) y [pedidos de Seba](documentacion/IMPLEMENTACION_SEBA.md).

La implementación utiliza **dos servicios: Usuarios y Ventas**, reutilizando el frontend React de la segunda entrega. **Martín** se encarga de Usuarios y seguridad; **Jeremy**, de catálogo e inventario; **Seba**, de pedidos y cuenta corriente. Los dos últimos desarrollan módulos separados dentro de Ventas. El [plan de trabajo](documentacion/PLAN_DE_TRABAJO.md) detalla la responsabilidad de cada uno.

## Organización

```text
Fase 3/
├── README.md
├── backend/
│   ├── usuarios-service/     # Usuarios, autenticación y roles — Martín
│   ├── ventas-service/       # Catálogo, pedidos y cuenta corriente — Jeremy y Seba
│   ├── compose.yaml          # MySQL para desarrollo
│   └── README.md             # Instalación y ejecución
├── frontend/                # React integrado con Usuarios y Ventas
├── despliegue/              # Compose completo para EC2 / Learner Lab
└── documentacion/
    ├── PROPUESTA_BACKEND.md
    ├── PLAN_DE_TRABAJO.md
    └── referencias-profesor/ # Los cuatro anexos originales, sin editar
```

`fase1/` y `fase 2/` conservan sus nombres y contenido para mantener las referencias y las entregas previas. `docs/` conserva el ERS y las pruebas de fase 2. Esta carpeta contiene el desarrollo de la tercera entrega.

La evaluación pide enlaces públicos y comprimidos separados de frontend y backend. Esta estructura local prepara el trabajo; no crea un repositorio remoto. El equipo deberá publicar el backend en su repositorio propio y registrar ambos enlaces al preparar la entrega.

## Lectura

Para instalar y ejecutar el proyecto desde un clon nuevo, consultar la [guía del backend y MySQL](backend/README.md) y la [guía de React](frontend/README.md).

Para levantar todo mediante contenedores, consultar la [guía de despliegue en AWS Academy / EC2](despliegue/README.md). Esta variante prepara frontend, ambos microservicios y dos MySQL aislados, con volúmenes persistentes, proxy de APIs y credenciales propias. Su publicación y comprobación en AWS siguen pendientes hasta ejecutarla en la instancia del equipo.

1. [Propuesta y límites de los servicios](documentacion/PROPUESTA_BACKEND.md).
2. [Plan de trabajo y entregables](documentacion/PLAN_DE_TRABAJO.md).
3. [Anexos del profesor](documentacion/referencias-profesor/).

Los anexos Word y Excel son ejemplos con contenido de Pokémon y fechas de ejemplo. Se conservan como referencia; los documentos completados se encuentran en [docs](../docs/README.md) y describen Los Maestros y sus resultados verificados.

## Implementaciones y pruebas

| Documento | Contenido |
| --- | --- |
| [Implementación de Martín](documentacion/IMPLEMENTACION_MARTIN.md) | Arquitectura de Usuarios, endpoints, JWT, contrato con Ventas e integración React. |
| [Implementación de Jeremy](documentacion/IMPLEMENTACION_JEREMY.md) | Catálogo, inventario e integración de productos. |
| [Implementación de Sebastián](documentacion/IMPLEMENTACION_SEBA.md) | Pedidos, cuenta corriente y contratos internos. |
| [Pruebas MySQL](documentacion/PRUEBAS_MYSQL.md) | Casos, resultados y pasos para reproducir las transacciones. |
| [Pruebas React con Usuarios](documentacion/PRUEBAS_REACT_USUARIOS_MYSQL.md) | Registro, sesión, permisos y desactivación, con capturas incluidas. |
