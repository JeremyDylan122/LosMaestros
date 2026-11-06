# Documentación de Ferretería Los Maestros

Documentos de DSY1104 Desarrollo FullStack II, Duoc UC. La revisión 3.0 del 5 de noviembre de 2026 describe la implementación integrada en `Fase 3`. Integrantes: Sebastián Diaz, Jeremy Hanglin y Martín Caviedes.

## Tercera entrega

| Documento | Archivo formal | Lectura en GitHub |
| --- | --- | --- |
| ERS actualizado | [Word](<ERS actualizado (v3)/ERS_Ferreteria_Los_Maestros_v3.docx>) | [Markdown](<ERS actualizado (v3)/ERS_actualizado_v3.md>) |
| Manual de usuario con capturas | [Word](<Manual de usuario/Manual_Usuario_Los_Maestros_v3.docx>) | [Markdown](<Manual de usuario/MANUAL_USUARIO.md>) |
| APIs e integración | [Word](<APIs e Integracion/APIs_e_Integracion_Los_Maestros_v3.docx>) | [Markdown](<APIs e Integracion/APIS_E_INTEGRACION.md>) |
| Documentación de endpoints | [Excel](<APIs e Integracion/Documentacion_APIs_Los_Maestros_v3.xlsx>) | 26 operaciones con entrada, respuestas, autenticación, roles y observaciones. |
| Informe de pruebas y cobertura v3 | [Word](<Pruebas unitarias (v3)/Informe_Pruebas_Unitarias_y_Cobertura_v3.docx>) | [Markdown](<Pruebas unitarias (v3)/PRUEBAS_UNITARIAS_V3.md>) |

El ERS conserva el formato y los 57 identificadores de fase 2 y agrega RF-047 y RF-048. Registra 59 requisitos: 48 implementados en V3, 10 parciales y uno pendiente. El manual utiliza la estructura del anexo 4 y contiene 11 figuras con título y nota. El informe sigue el anexo 2 y explica modelo de datos, seguridad, contratos, comunicación y pruebas. El Excel completa las columnas del anexo 3 en dos hojas, una por servicio.

Las capturas forman parte de los documentos y se conservan en [Manual de usuario/imagenes](<Manual de usuario/imagenes/>). Las pruebas registran 118 casos de React y 25 del backend. La compilación fue correcta y lint informó cero errores y nueve advertencias. Las pruebas de Java utilizan H2; los recorridos de integración con MySQL se documentan por separado. El informe de pruebas v3 incorpora una nueva medición de cobertura React: 70,39 % de líneas, con [resultados y contadores por archivo](<Pruebas unitarias (v3)/evidencias/resultados-v3.json>). No se midió cobertura Java. Los resultados anteriores del informe de integración se conservan como registro previo a esta medición.

- [Resultados automáticos de fase 3](<APIs e Integracion/evidencias/resultados-automaticos-v3.txt>).
- [Resultados de integración y revisión manual](<APIs e Integracion/evidencias/resultados-integracion-v3.txt>).
- [Instalación y ejecución del backend](<../Fase 3/backend/README.md>).
- [Instalación y ejecución de React](<../Fase 3/frontend/README.md>).
- [Plantillas docentes conservadas](<../Fase 3/documentacion/referencias-profesor/>).
- [Preparación del despliegue completo en AWS Academy / EC2](<../Fase 3/despliegue/README.md>).

El alcance es un entorno local con pagos simulados. Los reportes por período, geocodificación exacta, video y despliegue completo en AWS siguen pendientes. Las instrucciones de entrega solicitan enlaces y comprimidos separados de frontend y backend; preparar, publicar y enviar esos artefactos al docente es una tarea posterior a la revisión de estos documentos.

## Antecedentes de fase 2

| Documento histórico | Word | Markdown |
| --- | --- | --- |
| ERS revisión 2.2 del 16/10/2026 | [ERS](<ERS actualizado (v2)/ERS_Ferreteria_Los_Maestros_v2.docx>) | [ERS](<ERS actualizado (v2)/ERS_actualizado_v2.md>) |
| Informe de pruebas unitarias y cobertura | [Informe](<PRUEBAS UNITARIAS/Informe_Pruebas_Unitarias_y_Cobertura.docx>) | [Informe](<PRUEBAS UNITARIAS/PRUEBAS_UNITARIAS.md>) |

Estos archivos se mantienen sin modificaciones. El informe histórico registra 92 pruebas y su medición de cobertura. La pauta de fase 3 solicita ERS, manual, documentación de APIs y documento APIs e integración; no solicita explícitamente reemplazar ese informe de cobertura. El informe v3 se agrega como complemento, con una ejecución y medición propias de la etapa integrada.
