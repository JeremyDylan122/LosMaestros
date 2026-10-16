# Documentación de Ferretería Los Maestros

Documentación vigente de la segunda entrega de DSY1104 Desarrollo FullStack II, Duoc UC. Ambos informes corresponden a la **revisión 2.2 del 16 de octubre de 2026**.

Integrantes: Sebastián Diaz, Jeremy Hanglin y Martín Caviedes.

## Documentos de entrega

| Documento | Word | Markdown | Contenido |
| --- | --- | --- | --- |
| Especificación de Requisitos de Software | [ERS](<ERS actualizado (v2)/ERS_Ferreteria_Los_Maestros_v2.docx>) | [ERS](<ERS actualizado (v2)/ERS_actualizado_v2.md>) | Reglas del negocio y 57 requisitos, con estado, criterio de aceptación y aplicación actual. |
| Informe de pruebas unitarias y cobertura | [Informe](<PRUEBAS UNITARIAS/Informe_Pruebas_Unitarias_y_Cobertura.docx>) | [Informe](<PRUEBAS UNITARIAS/PRUEBAS_UNITARIAS.md>) | Procedimiento, 92 pruebas en 13 archivos, cobertura, trazabilidad y límites de la revisión. |

Los Word son los documentos formales de entrega. Las versiones Markdown reproducen su cuerpo y añaden enlaces de navegación para consultarlos desde el repositorio. Cada documento se conserva una sola vez, en su carpeta correspondiente.

## Alcance documentado

La V2 utiliza React, Vite, CSS propio y almacenamiento en el navegador. El ERS distingue 38 requisitos implementados en este alcance local, 15 parciales y cuatro pendientes. Del total de 57 requisitos, 46 son funcionales, ocho no funcionales y tres restricciones técnicas.

El crédito automático de contratistas, los montos precargados y las tarifas corresponden a la demostración. La integración con servidor, base de datos, pagos reales y verificación geográfica exacta pertenece a etapas posteriores. La [guía principal](../README.md) explica la ejecución, los perfiles y las reglas observables.

## Resultados documentados

La medición final registra 92 pruebas aprobadas, sin fallos ni casos omitidos. La cobertura es 59,83 % de sentencias, 53,34 % de ramas, 49,57 % de funciones y 60,85 % de líneas. La compilación se completó y Oxlint informó cero errores y seis advertencias.

El informe de pruebas contiene las métricas finales, las comprobaciones en navegador y los comandos necesarios para reproducir la medición.

```text
docs/
├── README.md
├── ERS actualizado (v2)/
│   ├── ERS_Ferreteria_Los_Maestros_v2.docx
│   └── ERS_actualizado_v2.md
└── PRUEBAS UNITARIAS/
    ├── Informe_Pruebas_Unitarias_y_Cobertura.docx
    └── PRUEBAS_UNITARIAS.md
```
