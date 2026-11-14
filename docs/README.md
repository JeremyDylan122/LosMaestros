# Documentación de Ferretería Los Maestros

Documentos de DSY1104 Desarrollo FullStack II, Duoc UC. La revisión documental 3.1 del 13 de noviembre de 2026 actualiza la implementación integrada en `Fase 3` y conserva las mediciones históricas del 5 de noviembre. Integrantes: Sebastián Diaz, Jeremy Hanglin y Martín Caviedes.

## Tercera entrega

| Documento | Archivo formal | Lectura en GitHub |
| --- | --- | --- |
| ERS actualizado | [Word](<ERS actualizado (v3)/ERS_Ferreteria_Los_Maestros_v3.docx>) | [Markdown](<ERS actualizado (v3)/ERS_actualizado_v3.md>) |
| Manual de usuario con capturas | [Word](<Manual de usuario/Manual_Usuario_Los_Maestros_v3.docx>) | [Markdown](<Manual de usuario/MANUAL_USUARIO.md>) |
| APIs e integración | [Word](<APIs e Integracion/APIs_e_Integracion_Los_Maestros_v3.docx>) | [Markdown](<APIs e Integracion/APIS_E_INTEGRACION.md>) |
| Documentación de endpoints | [Excel](<APIs e Integracion/Documentacion_APIs_Los_Maestros_v3.xlsx>) | 26 operaciones con entrada, respuestas, autenticación, roles y observaciones. |
| Informe de pruebas y cobertura v3 | [Word](<Pruebas unitarias (v3)/Informe_Pruebas_Unitarias_y_Cobertura_v3.docx>) | [Markdown](<Pruebas unitarias (v3)/PRUEBAS_UNITARIAS_V3.md>) |

El ERS conserva el formato y los 57 identificadores de fase 2 y agrega RF-047 y RF-048. Registra 59 requisitos: 49 implementados en V3, nueve parciales y uno pendiente. El manual utiliza la estructura del anexo 4 y contiene 13 figuras con título y nota, con la navegación actual en las figuras 12 y 13. El informe sigue el anexo 2 y explica modelo de datos, seguridad, contratos, comunicación y pruebas. El Excel completa las columnas del anexo 3 en dos hojas, una por servicio.

Las capturas forman parte de los documentos y se conservan en [Manual de usuario/imagenes](<Manual de usuario/imagenes/>). La ejecución actual del 13/11 aprobó **tres pruebas React en tres archivos** y midió **2,02 % de cobertura de líneas** (27 de 1335). Estas reglas unitarias no verifican por sí solas el flujo completo. Consultar los [resultados de la revisión 3.1](<Pruebas unitarias (v3)/evidencias/resultados-v3-1.json>).

El informe reúne 28 pruebas aprobadas: tres de React, seis de Usuarios y diecinueve de Ventas. Los 25 casos Java se reejecutaron el 13/11 con H2 y finalizaron sin fallos, errores ni omitidos. La cobertura V8 de 2,02 % corresponde exclusivamente a React; no se midió cobertura Java. Los [resultados de Spring Boot](<Pruebas unitarias (v3)/evidencias/resultados-backend-v3-1.json>) identifican las clases y los casos. Las mediciones anteriores se conservan en sus archivos de evidencia y en el historial del repositorio. Las comprobaciones manuales de navegación móvil y login se distinguen de las pruebas automáticas y de la integración con MySQL. El Excel de endpoints conserva su fecha y contenido porque no cambiaron los contratos REST.

- [Resultados automáticos de fase 3](<APIs e Integracion/evidencias/resultados-automaticos-v3.txt>).
- [Resultados de integración y revisión manual](<APIs e Integracion/evidencias/resultados-integracion-v3.txt>).
- [Instalación y ejecución del backend](<../Fase 3/backend/README.md>).
- [Instalación y ejecución de React](<../Fase 3/frontend/README.md>).
- [Plantillas docentes conservadas](<../Fase 3/documentacion/referencias-profesor/>).
- [Preparación del despliegue completo en AWS Academy / EC2](<../Fase 3/despliegue/README.md>).

El frontend de EC2 se actualizó el 14/11/2026 con respaldo previo. Se verificaron los cinco contenedores saludables, el login, el catálogo y la conservación de datos y claves. Las acciones móviles de contratistas se confirmaron en iPhone 15 Pro, Zen y Chrome. Para instalación y operación, utilizar las guías enlazadas arriba. Los pagos siguen siendo simulados; no se implementan reportes por período, geocodificación exacta ni video del negocio.

## Antecedentes de fase 2

| Documento histórico | Word | Markdown |
| --- | --- | --- |
| ERS revisión 2.2 del 16/10/2026 | [ERS](<ERS actualizado (v2)/ERS_Ferreteria_Los_Maestros_v2.docx>) | [ERS](<ERS actualizado (v2)/ERS_actualizado_v2.md>) |
| Informe de pruebas unitarias y cobertura | [Informe](<PRUEBAS UNITARIAS/Informe_Pruebas_Unitarias_y_Cobertura.docx>) | [Informe](<PRUEBAS UNITARIAS/PRUEBAS_UNITARIAS.md>) |

Estos archivos se mantienen sin modificaciones. El informe histórico registra 92 pruebas y su medición de cobertura. La pauta de fase 3 solicita ERS, manual, documentación de APIs y documento APIs e integración; no solicita explícitamente reemplazar ese informe de cobertura. El informe v3 se agrega como complemento, con una ejecución y medición propias de la etapa integrada.
