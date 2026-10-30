# Fase 3 — Backend e integración

Estado: plantillas configuradas y módulos backend de Seba implementados con cinco pruebas de negocio. Catálogo, Usuarios e integración React siguen pendientes del equipo. Ver [implementación de Seba y contratos](documentacion/IMPLEMENTACION_SEBA.md).

Se propone desarrollar **dos microservicios: Usuarios y Ventas**, reutilizando el frontend React de la segunda entrega. **Martín** se encarga de Usuarios y seguridad; **Jeremy**, de catálogo e inventario; **Seba**, de pedidos y cuenta corriente. Los dos últimos desarrollan módulos separados dentro de Ventas. El [plan de trabajo](documentacion/PLAN_DE_TRABAJO.md) detalla la responsabilidad de cada uno.

## Organización

```text
Fase 3/
├── README.md
├── backend/
│   ├── usuarios-service/     # Plantilla Spring Boot — Martín
│   └── ventas-service/       # Plantilla Spring Boot — Jeremy y Seba
├── frontend/                # Instrucciones para evolucionar el React existente
└── documentacion/
    ├── PROPUESTA_BACKEND.md
    ├── PLAN_DE_TRABAJO.md
    └── referencias-profesor/ # Los cuatro anexos originales, sin editar
```

`fase1/` y `fase 2/` conservan sus nombres y contenido para mantener las referencias y las entregas previas. `docs/` conserva el ERS y las pruebas de fase 2. Esta carpeta contiene la preparación de la tercera entrega.

La evaluación pide enlaces públicos y comprimidos separados de frontend y backend. Esta estructura local prepara el trabajo; no crea un repositorio remoto. El equipo deberá publicar el backend en su repositorio propio y registrar ambos enlaces al preparar la entrega.

## Lectura

1. [Propuesta y límites de los servicios](documentacion/PROPUESTA_BACKEND.md).
2. [Plan de trabajo y entregables](documentacion/PLAN_DE_TRABAJO.md).
3. [Anexos del profesor](documentacion/referencias-profesor/).

Los anexos Word y Excel son ejemplos con contenido de Pokémon y fechas de ejemplo. Se conservan como referencia; los documentos de entrega deberán describir Los Maestros y sus resultados reales.
