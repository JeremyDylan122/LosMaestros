# Ferretería Los Maestros

Aplicación académica de comercio y gestión para una ferretería de La Serena, desarrollada para **Full Stack 2 (DSY1104), Duoc UC**, con el profesor **Hernán Saavedra**.

**Equipo:** Martín Caviedes, Jeremy Hanglin y Sebastián Diaz.

La versión actual está en **Fase 3**: frontend React, dos API REST Spring Boot y persistencia MySQL. El equipo ha desplegado el proyecto en AWS. La configuración reproducible de EC2, Docker Compose y Nginx está incluida en el repositorio.

## Qué permite hacer

- Consultar catálogo, categorías, ofertas y fichas de productos; preparar el carrito.
- Registrarse, iniciar sesión y comprar con retiro o despacho dentro de la cobertura definida.
- Consultar pedidos y comprobantes; comprar con cuenta corriente cuando el contratista tiene cupo habilitado.
- Administrar usuarios, catálogo, inventario, pedidos y cupos desde el panel.

| Perfil | Acceso |
| --- | --- |
| Visitante | Consulta pública de catálogo; debe iniciar sesión para comprar. |
| Cliente | Compra y consulta sus pedidos. |
| Contratista | Funciones de cliente, consulta de cuenta y compra a crédito habilitado. |
| Vendedor | Consulta de gestión; sin permisos de escritura administrativa. |
| Administrador | Gestión de usuarios, productos, inventario, pedidos y cuentas. |

Los precios, el stock y el crédito se validan en el servidor. La compra y su anulación actualizan pedido, existencias y saldo en una transacción. Los pagos son simulados: no hay cobro bancario real ni emisión tributaria. Tampoco se implementan geocodificación exacta ni reportes comerciales por período.

## Arquitectura

| Componente | Responsabilidad | Tecnología |
| --- | --- | --- |
| Frontend | Tienda, sesión, carrito y panel | React, Vite, React Router, CSS propio |
| Usuarios | Registro, autenticación JWT, perfiles y roles | Java 17, Spring Boot, Spring Security, JPA |
| Ventas | Catálogo, inventario, pedidos y cuenta corriente | Java 17, Spring Boot, Spring Security, JPA |
| Persistencia | Bases independientes para Usuarios y Ventas | MySQL 8.4; H2 para pruebas locales |
| Despliegue | Proxy de APIs, aplicación y bases en contenedores | Nginx, Docker Compose, AWS EC2 |

Usuarios firma los JWT y Ventas los valida con la clave pública. Ventas consulta a Usuarios por un canal interno autenticado para habilitar cuentas de contratistas. El carrito y la caché de productos permanecen en el navegador; los datos comerciales se guardan en MySQL.

## Empezar

- **Ejecutar el conjunto con Docker o reproducir el despliegue:** [guía de despliegue](<Fase 3/despliegue/README.md>).
- **Desarrollar localmente:** preparar [backend y MySQL](<Fase 3/backend/README.md>) y luego iniciar [React](<Fase 3/frontend/README.md>).
- **Consultar la API:** [Usuarios](<Fase 3/backend/usuarios-service/README.md>) y [Ventas](<Fase 3/backend/ventas-service/README.md>), con métodos, rutas y permisos.
- **Usar la aplicación:** [manual de usuario](<docs/Manual de usuario/MANUAL_USUARIO.md>).
- **Revisar requisitos y evidencias:** [índice documental](docs/README.md).

## Organización

`Fase 3/` contiene la aplicación integrada y sus instrucciones vigentes. `fase1/` y `fase 2/` conservan las entregas anteriores. `docs/` reúne requisitos, manual, contratos y resultados académicos; las evidencias indican la versión y el momento de su ejecución.

El catálogo inicial contiene 27 productos en siete categorías. Las imágenes son referenciales y sus [créditos](<Fase 3/frontend/public/assets/img/productos/CREDITOS.md>) se conservan junto a los recursos.
