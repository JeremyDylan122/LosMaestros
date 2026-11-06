# Verificación del entorno Docker

Revisión del 5 de noviembre de 2026. La comprobación se realizó con Docker Desktop y contenedores Linux en un proyecto Compose aislado. El frontend se publicó únicamente en localhost:8088; el MySQL de desarrollo existente no se modificó.

## Resultados

| Comprobación | Resultado |
| --- | --- |
| Imágenes | Usuarios, Ventas y frontend construidos desde sus Dockerfile. |
| Compose | Variante HTTP válida; variante HTTPS combinada válida. |
| Arranque | Los cinco servicios alcanzaron estado healthy. |
| Esquemas | Dos MySQL nuevos cargaron los SQL de Usuarios, catálogo y pedidos. |
| Proxy y React | Ruta directa /catalogo y endpoint /salud accesibles; catálogo REST con 27 productos. |
| Autenticación | Login de administrador y registro de contratista ficticio; JWT firmado aceptado por ambos servicios. |
| CORS | El origen configurado fue admitido; otro origen fue rechazado. |
| Canal interno | Consulta de contratista por HTTP entre servicios operativa; ruta pública interna bloqueada con 404. |
| Compra y anulación | Pedido ficticio a crédito por $4.990; stock y saldo modificados y restituidos al anular. Repetir la anulación no duplicó la restitución. |
| Recreación | Microservicios y MySQL recreados manteniendo volúmenes y claves; usuario, pedido, stock y cuenta conservados. |
| Respaldos | Script generó exportaciones SQL de ambas bases sin imprimir contraseñas. No se ensayó una restauración sobre AWS. |
| Nginx | Configuración validada con nginx -t. Recuperó la comunicación después de recrear los microservicios. |
| Caddy | Configuración HTTPS opcional validada, sin solicitar certificados ni publicar el dominio de ejemplo. |
| Regresión Java | Usuarios: 6 pruebas aprobadas. Ventas: 19 aprobadas. Sin fallos, errores ni casos omitidos. |
| Exclusiones | .env, claves y respaldos excluidos de Git; contextos de construcción excluyen configuración privada y dependencias locales. |

## Alcance

Estas comprobaciones verifican el empaquetado y las conexiones en Docker local. No acreditan un despliegue AWS, disponibilidad del laboratorio, HTTPS real, rendimiento en EC2 ni una prueba de carga. La revisión en navegador sobre el servidor y el recorrido de presentación deben completarse al publicar en Learner Lab.

La implementación conserva los flujos y módulos existentes. El cambio Java de esta preparación permite configurar el origen CORS mediante APP_CORS_ALLOWED_ORIGINS; sus valores predeterminados mantienen el desarrollo local.

## Reproducción

Seguir la [guía de despliegue](README.md) para crear un entorno nuevo, ejecutar `docker compose build`, levantarlo con `docker compose up -d --wait` y comprobarlo con `sh verificar.sh URL`. Ejecutar las pruebas Java con `.\mvnw.cmd test` desde cada servicio. Los datos de compra utilizados en la verificación fueron ficticios y pertenecen exclusivamente al entorno de prueba.
