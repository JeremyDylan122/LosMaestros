# Despliegue de Los Maestros en AWS

Esta configuración prepara la demostración de fase 3 en una sola instancia EC2, tanto en una cuenta AWS personal como en AWS Academy / Learner Lab. Docker Compose levanta React compilado con Nginx, Usuarios, Ventas y dos instancias MySQL independientes. Los datos y las claves de este entorno se generan aparte de los utilizados durante el desarrollo local.

Los archivos permiten preparar el despliegue; su existencia no acredita que la aplicación ya esté publicada en AWS. La comprobación final debe hacerse en la instancia del equipo antes de la presentación.

Los [resultados de la verificación Docker local](VERIFICACION_DOCKER.md) registran las comprobaciones realizadas y sus límites.

La [verificación en EC2](VERIFICACION_EC2.md) registra el despliegue y el ensayo de detención y encendido realizados en AWS, incluido el cambio automático del origen público y la persistencia de los datos.

## 1. Arquitectura

| Contenedor | Función | Acceso |
| --- | --- | --- |
| frontend | Archivos estáticos React y proxy Nginx | Único puerto HTTP publicado. |
| usuarios | Spring Boot, registro, JWT y perfiles | Red Docker, puerto 8081. |
| ventas | Spring Boot, catálogo, pedidos y crédito | Red Docker, puerto 8082. |
| mysql-usuarios | Base losmaestros_usuarios | Red privada usuarios_db, volumen propio. |
| mysql-ventas | Base losmaestros_ventas | Red privada ventas_db, volumen propio. |

El navegador utiliza `/usuarios/api/v1` y `/ventas/api/v1` sobre la misma dirección que la tienda. Nginx dirige cada ruta a su microservicio; `localhost` en el navegador no se utiliza para buscar servicios en EC2. Ventas consulta Usuarios por `http://usuarios:8081` dentro de Docker. La ruta de consulta interna se bloquea en Nginx.

Las dos bases no publican puertos en EC2. Cada microservicio utiliza el usuario de su base, no root. Los SQL existentes se montan como inicialización; las claves RSA se montan como archivos de solo lectura. Usuarios conserva la clave privada y Ventas recibe únicamente la pública.

Una instalación nueva carga el catálogo inicial y crea el administrador configurado. No migra automáticamente las cuentas, pedidos ni cambios de inventario del entorno local. Preparar en EC2 las cuentas ficticias necesarias para la demostración o realizar una migración explícita mediante respaldos.

Los SQL de inicialización declaran `SET NAMES utf8mb4` antes de cargar datos. Esto evita que el cliente interprete las tildes del archivo UTF-8 como caracteres de otra codificación, aunque las tablas ya sean `utf8mb4`. En un volumen existente estos SQL no se vuelven a ejecutar: corregir los registros afectados con respaldo previo, sin borrar la base para reinicializarla.

## 2. Cuenta y recursos

En una cuenta personal, comprobar el plan, el saldo de créditos, la región y las tarifas antes de crear recursos. Que una instancia sea elegible para Free Tier no significa que su ejecución no consuma créditos. No es necesario cambiar al plan de pago para este despliegue si los recursos están habilitados en el plan gratuito.

Iniciar el Learner Lab desde AWS Academy y consultar el saldo y las restricciones de la sesión. Los recursos consumen créditos del laboratorio; no se promete uso ilimitado ni disponibilidad permanente. El acceso al laboratorio depende de la institución y del plazo del curso. [AWS Academy](https://aws.amazon.com/training/awsacademy/) describe este entorno para proyectos educativos.

Propuesta para esta demostración:

- Una EC2 con Ubuntu Server 24.04 LTS de 64 bits x86_64.
- Al menos 4 GiB de RAM; 8 GiB dan mayor margen para compilar y operar. Elegir un tipo permitido por la cuenta o el laboratorio. No asumir que una micro de 1 GiB puede sostener dos JVM y dos MySQL.
- Un disco EBS gp3 cifrado de aproximadamente 30 GiB, sujeto al saldo y límites de la cuenta.
- Una IPv4 pública y salida a Internet para descargar imágenes y dependencias.
- Sin RDS, balanceador, NAT Gateway, EKS ni registro ECR para esta configuración. No se necesita comprar un dominio para la demostración HTTP.

La selección de recursos debe confirmarse antes de crear la instancia. Detener EC2 fuera de las pruebas interrumpe el consumo de cómputo; el disco EBS sigue generando consumo mientras exista. Cerrar el navegador o detener únicamente los contenedores no detiene EC2. Utilizar una IPv4 pública automática evita reservar una Elastic IP durante los días de espera; la dirección puede cambiar al encender. Consultar los [estados y la facturación de EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html).

## 3. Instancia y acceso

1. Iniciar sesión en la consola AWS de la cuenta personal o del Learner Lab.
2. Crear la instancia Ubuntu con los recursos anteriores y un par de claves SSH que el equipo pueda custodiar. La clave SSH de AWS es distinta del par RSA de JWT que generará la aplicación.
3. En el grupo de seguridad permitir TCP 22 desde la IP del integrante que administrará el servidor. Permitir TCP 80 desde las IP de la demostración, o desde Internet si se requiere una URL pública. No abrir 3306, 8081 ni 8082.
4. Consultar el DNS público o la IPv4 pública asignada. Conectarse como `ubuntu` mediante SSH o el método habilitado en su laboratorio.

Las reglas de HTTP, HTTPS y SSH se describen en la [documentación de grupos de seguridad de EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html).

## 4. Instalar Docker en Ubuntu

Seguir el [repositorio oficial de Docker para Ubuntu](https://docs.docker.com/engine/install/ubuntu/). En una Ubuntu 24.04 nueva:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git openssl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Crear la fuente de paquetes:

```bash
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

Cerrar la conexión SSH y volver a entrar para aplicar el grupo. Comprobar `docker version` y `docker compose version`. El grupo docker permite administrar contenedores y debe reservarse a los integrantes que gestionan la instancia.

## 5. Llevar el proyecto a EC2

Clonar el repositorio y seleccionar la rama que ya contenga estos archivos. Antes de integrar el PR, `main` del repositorio principal puede no incluirlos. También se puede transferir una copia del código desde el equipo, excluyendo `.env`, claves, `node_modules`, `target` y `dist`.

```bash
git clone URL_DEL_REPOSITORIO LosMaestros
cd LosMaestros
git checkout RAMA_CON_EL_DESPLIEGUE
cd "Fase 3/despliegue"
```

Reemplazar los dos nombres en mayúscula por el repositorio y rama publicados. Las instrucciones siguientes se ejecutan desde `Fase 3/despliegue`.

## 6. Configurar y levantar

Generar las contraseñas y el par JWT en EC2. Reemplazar `DNS_PUBLICO` por el DNS real de la instancia o su IPv4. La dirección debe ser la misma que abrirán en el navegador, sin ruta ni barra final:

```bash
sh preparar.sh http://DNS_PUBLICO 80
docker compose config --quiet
docker compose build usuarios
docker compose build ventas
docker compose build frontend
docker compose up -d --wait --wait-timeout 300
docker compose ps
sh verificar.sh http://DNS_PUBLICO
```

La compilación serial reduce el consumo simultáneo de memoria. Los Dockerfile usan etapas de construcción y no incluyen Maven, Node, fuentes ni `.env` en las imágenes finales. Las pruebas se ejecutan antes de preparar la entrega; la construcción de imágenes Java empaqueta con `-DskipTests`.

`preparar.sh` crea `.env` con una contraseña inicial aleatoria de diez caracteres y `secrets/` con el par RSA. No sobrescribe una configuración existente. Consultar `USUARIOS_ADMIN_PASSWORD` dentro de `.env` para entrar como `admin@duoc.cl`; no publicar ese archivo ni capturar su contenido. Las contraseñas de las bases y la credencial interna son distintas y aleatorias.

El arranque espera a que los SQL estén cargados y las APIs respondan antes de iniciar el frontend, mediante [healthchecks y dependencias de Compose](https://docs.docker.com/compose/how-tos/startup-order/). Las sondas Java comprueban que Spring sirve OpenAPI; no sustituyen una comprobación continua de conectividad SQL. `docker compose ps` permite ver cada estado.

La inicialización SQL de la [imagen MySQL](https://hub.docker.com/_/mysql) ocurre solamente al crear un volumen vacío. Cambiar una contraseña en `.env` después no cambia la cuenta existente en MySQL. Las actualizaciones de esquema y contraseñas deben aplicarse explícitamente; no borrar volúmenes para actualizar la aplicación.

Para una prueba Docker en un computador Linux antes de AWS:

```bash
sh preparar.sh http://localhost:8080 8080
docker compose build usuarios
docker compose build ventas
docker compose build frontend
docker compose up -d --wait --wait-timeout 300
sh verificar.sh http://localhost:8080
```

## 7. Comprobar la demostración

Abrir `http://DNS_PUBLICO` y revisar:

1. Catálogo con imágenes, ofertas y stock; navegación directa y recarga de una ruta React.
2. Registro e inicio de sesión de una cuenta ficticia. Restauración de sesión al volver a la ventana.
3. Administración de productos y usuarios; vendedor solo consulta.
4. Como administrador, habilitar cuenta corriente de un contratista ficticio.
5. Confirmar compra, verificar vaciado del carrito, pedido y cargo de crédito.
6. Anular como administrador y verificar devolución de stock y crédito una sola vez.
7. Reiniciar los contenedores y comprobar que usuarios, pedidos e inventario se conservan.

Este entorno HTTP está destinado a datos y credenciales ficticios de la presentación, sin pagos reales. Para utilizarlo con datos reales se necesita HTTPS. Si el equipo dispone de un dominio, la sección siguiente permite añadirlo sin cambiar React ni abrir los puertos de los microservicios.

Swagger no se publica por Nginx. Para revisar la documentación ejecutable, consultar su JSON desde Docker en una sesión SSH administrativa:

```bash
docker compose exec usuarios curl -fsS http://localhost:8081/v3/api-docs
docker compose exec ventas curl -fsS http://localhost:8082/v3/api-docs
```

## 8. HTTPS opcional con dominio

Si existe un dominio propio o un subdominio delegado, apuntar su registro DNS a la IP pública y habilitar TCP 80 y 443 en el grupo de seguridad. Completar `APP_DOMAIN=tienda.ejemplo.cl` y cambiar `PUBLIC_ORIGIN=https://tienda.ejemplo.cl` en `.env`.

```bash
docker compose -f compose.yaml -f compose.https.yaml up -d --wait --wait-timeout 300
sh verificar.sh https://tienda.ejemplo.cl
```

La variante HTTPS agrega Caddy, retira el puerto publicado del frontend y conserva los certificados en un volumen. Requiere Compose 2.24.4 o posterior por `!reset`. [Caddy](https://caddyserver.com/docs/automatic-https) gestiona certificados públicos para dominios que resuelven al servidor y cuyos puertos sean accesibles. No se requiere crear esta variante para una demostración HTTP con el DNS de EC2. En adelante utilizar siempre ambos `-f` para operar la variante HTTPS.

## 9. Reinicios, cambios y respaldo

### Arranque automático en EC2 con HTTP por IP

Para que baste encender la instancia, instalar el proyecto en `/opt/losmaestros`, construir las imágenes y generar `.env` una sola vez con el puerto 80. Luego instalar la unidad incluida:

```bash
cd "/opt/losmaestros/Fase 3/despliegue"
sudo install -m 644 losmaestros.service /etc/systemd/system/losmaestros.service
sudo systemd-analyze verify /etc/systemd/system/losmaestros.service
sudo systemctl daemon-reload
sudo systemctl enable --now losmaestros.service
sudo systemctl status losmaestros.service --no-pager
```

`arrancar-ec2.sh` consulta la IPv4 pública mediante IMDSv2 y actualiza únicamente `PUBLIC_ORIGIN`. Después inicia las imágenes ya construidas, espera los healthchecks y comprueba las rutas HTTP. Conserva contraseñas, claves JWT y volúmenes; no ejecuta nuevamente `preparar.sh`. La unidad espera Docker y la red, y detiene ordenadamente los contenedores cuando se apaga el servidor.

Este arranque es para HTTP por IPv4 y puerto 80, con `HTTP_BIND=0.0.0.0`. La unidad tiene una ruta de instalación fija; adaptarla si el repositorio está en otra carpeta. No utilizarla sin adaptar en la variante HTTPS con dominio. La consulta a los metadatos requiere que IMDS esté habilitado en EC2; se recomienda exigir tokens IMDSv2.

Después de encender, consultar la nueva IPv4 en la consola y abrir `http://IP_ACTUAL`. No hay que reconstruir React ni regenerar credenciales. Si cambió la IP del equipo administrador, actualizar la regla SSH a su nueva IP `/32`. Para diagnosticar el arranque: `sudo journalctl -u losmaestros.service -n 80 --no-pager`.

Ensayar una detención y un encendido completos antes de la presentación, comprobando que los cinco contenedores estén saludables y que usuarios, pedidos, stock y crédito se conserven. Detener EC2 al finalizar el ensayo; encender con anticipación el día de la exposición.

### Operación manual y respaldos

- Después de reiniciar EC2, Docker y los contenedores tienen reinicio automático. Si el laboratorio detuvo o eliminó recursos, revisar su estado en la consola.
- Si no se instaló la unidad anterior y cambia la IP o el DNS público, editar únicamente `PUBLIC_ORIGIN` en `.env` y ejecutar `docker compose up -d --wait --wait-timeout 300`. Abrir la nueva dirección. No regenerar claves ni credenciales. Las URLs relativas del frontend no requieren recompilar por ese cambio.
- Antes de la presentación, iniciar el laboratorio con anticipación y comprobar acceso desde otro equipo del grupo. Una sesión de laboratorio tiene restricciones de duración y disponibilidad que deben verificarse en su portal.
- Para actualizar código: obtener la versión acordada con Git, construir `usuarios`, `ventas` y `frontend` por separado como en el primer arranque y ejecutar `docker compose up -d --wait --wait-timeout 300`.
- Para detener la aplicación sin borrar datos: `docker compose stop`. `docker compose down` también conserva los volúmenes; no usar la opción `-v` sobre datos que quieran conservar.
- Para exportar datos: `sh respaldar.sh`. Copiar la carpeta `respaldos/` fuera de EC2 junto con `.env` y `secrets/` por un medio privado. Los respaldos SQL contienen datos y no deben subirse a GitHub. Ejecutarlos sin compras simultáneas si se necesita un punto consistente entre las dos bases.
- El volumen persiste al recrear contenedores, pero no es una copia fuera de la instancia ni protege de la eliminación de su disco EBS.

Para restaurar un respaldo de Usuarios sobre un esquema preparado, por ejemplo:

```bash
docker compose exec -T mysql-usuarios sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" exec mysql -u"$MYSQL_USER" "$MYSQL_DATABASE"' < respaldos/usuarios-FECHA.sql
```

Hacer la restauración durante una ventana sin escrituras y repetir con `mysql-ventas` y su archivo correspondiente. El SQL restaura el contenido del respaldo y puede reemplazar tablas existentes; no ejecutarlo sobre datos posteriores que deban conservarse.

## 10. Diagnóstico

| Situación | Revisar |
| --- | --- |
| La web no abre | Estado de EC2, IP actual, grupo de seguridad, puerto y `docker compose ps`. |
| Respuesta 403 al iniciar sesión | `PUBLIC_ORIGIN` debe coincidir exactamente con protocolo, host y puerto de la dirección del navegador. |
| Error 502 de Nginx | Estado de usuarios/ventas y `docker compose logs --tail=80 usuarios ventas`. |
| MySQL no saludable | Logs del servicio, espacio en disco y si se alteraron contraseñas de un volumen existente. |
| Spring no inicia | Claves JWT montadas, credenciales SQL y tablas inicializadas. No usar claves de otro par. |
| Contenedor termina con 137 | Posible falta de memoria; revisar memoria real y `docker stats --no-stream`. |
| La dirección cambió tras detener EC2 | Actualizar URL, origen permitido y, si corresponde, DNS. |

No incluir la salida completa de `docker compose config` o inspecciones de variables en capturas compartidas: pueden contener secretos. `config --quiet` valida sin imprimirlos.
