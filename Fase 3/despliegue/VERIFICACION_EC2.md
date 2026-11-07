# Verificación del despliegue en EC2

## Entorno comprobado

El 7 de noviembre de 2026 se desplegó la fase 3 en una instancia EC2 de Ohio (`us-east-2`), con Ubuntu Server 24.04, arquitectura x86_64, tipo `m7i-flex.large` (2 vCPU y 8 GiB de RAM) y un disco EBS gp3 cifrado de 30 GiB.

Se utilizó el código publicado de la fase 3, más los archivos de arranque automático incluidos en esta carpeta. Docker 29.1.3 y Compose 2.40.3 ejecutaron los cinco contenedores. El acceso público se limitó a HTTP; SSH se restringió a la IP del equipo administrador y las bases y microservicios quedaron dentro de Docker.

## Resultados

| Comprobación | Resultado |
| --- | --- |
| Construcción | Las imágenes de Usuarios, Ventas y frontend se construyeron por separado en EC2. |
| Estado | Los cinco contenedores alcanzaron estado `healthy`. |
| Acceso externo | Desde un equipo fuera de EC2, `/salud` y `/catalogo` respondieron 200; el catálogo REST informó 27 productos. |
| Autenticación | Login del administrador y registro de un contratista ficticio; JWT aceptado por Usuarios y Ventas. |
| Origen permitido | El origen público configurado fue aceptado y un origen distinto recibió 403. |
| Canal interno | El endpoint interno de Usuarios no fue accesible mediante Nginx: respuesta 404. |
| Compra | Un pedido ficticio por $4.990 consumió stock y saldo de cuenta corriente. |
| Anulación | Se restituyeron stock y saldo. Repetir la anulación no duplicó la devolución. |
| Detención | EC2 alcanzó el estado `stopped` y conservó el mismo disco EBS. |
| Encendido | AWS asignó otra IPv4; systemd actualizó el origen e inició los contenedores sin editar manualmente `.env`. |
| Persistencia | Después del encendido se conservaron usuario, login, pedido, stock, crédito y clave pública JWT. |
| Respaldo | Se exportaron ambas bases y se conservó una copia privada fuera de EC2 junto con las claves y configuración. |

El presupuesto de seguimiento se configuró con avisos mensuales a USD 5, 8 y 10, excluyendo créditos y reembolsos para observar el consumo antes de su compensación. Los avisos no detienen recursos y no representan un límite automático de gasto.

## Alcance y operación

Después del recorrido visual se corrigieron 73 campos con codificación dañada en categorías, productos y detalles históricos de pedidos. Se conservó un respaldo previo y se añadió `SET NAMES utf8mb4` a los SQL de inicialización para evitar el problema en instalaciones nuevas. La comprobación posterior no detectó campos pendientes de corrección y confirmó nombres con tildes, eñe y superíndices en la API pública.

Se prepararon cuentas ficticias para cliente, vendedor y dos contratistas (cuenta corriente habilitada con crédito de $300.000 y pendiente de habilitación con crédito cero). Se verificaron login, datos personales con tildes y restricciones de acceso. El administrador principal se conservó. Las contraseñas aleatorias se guardan únicamente en el archivo privado de accesos del equipo, fuera del repositorio.

Los 27 productos coincidían con el stock del catálogo inicial después de anular los pedidos del ensayo. Se conservó ese inventario, sin borrar usuarios ni historial.

Las comprobaciones HTTP e integración fueron automatizadas y el integrante responsable recorrió la tienda y el panel administrativo desde su navegador. No constituyen una prueba de carga ni una restauración completa del respaldo. Antes de exponer se debe repetir una comprobación breve desde el equipo de presentación.

La instancia se mantiene detenida fuera de las pruebas. Su IPv4 pública puede cambiar al encender; consultar la dirección actual en EC2. El disco conserva las imágenes, los volúmenes MySQL y la configuración. No ejecutar `preparar.sh` nuevamente, no eliminar volúmenes ni utilizar `docker compose down -v`.

Las claves, contraseñas, identificadores de acceso y respaldos pertenecen a la administración privada del entorno y no se incluyen en el repositorio. Para reproducirlo, seguir la [guía de despliegue](README.md), incluida la sección de arranque automático.
