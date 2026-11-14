# Aplicación React de Ferretería Los Maestros

Frontend de fase 3 del proyecto DSY1104 Desarrollo FullStack II, Duoc UC. Reutiliza la tienda React y conecta registro, login, sesión y gestión de usuarios con el servicio Spring Boot de Usuarios. Catálogo, checkout, historial, pedidos y cuenta corriente se conectan con Ventas.

Integrantes: Sebastián Diaz, Jeremy Hanglin y Martín Caviedes.

La [implementación de Martín](../documentacion/IMPLEMENTACION_MARTIN.md) explica la configuración de Usuarios y su comunicación con Ventas. En [docs](../../docs/README.md) se encuentran los documentos de fase 3 y los antecedentes de fase 2.

## Iniciar la aplicación

Desde esta carpeta, con Node.js 24 y npm:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

La dirección de desarrollo aparece en la terminal; por defecto es `http://localhost:5173`. Las dependencias están fijadas en `package-lock.json`. Node.js 18 no es compatible con esta entrega.

Arrancar Usuarios en el puerto 8081 y Ventas en el 8082 según sus README. Las variables `VITE_API_USUARIOS_URL` y `VITE_API_VENTAS_URL` incluyen `/api/v1`. Si se modifica `.env`, reiniciar Vite. Las URLs predeterminadas coinciden con `.env.example`.

Para acceder al panel, iniciar sesión con el administrador creado al configurar `USUARIOS_ADMIN_PASSWORD` en Usuarios, o con una cuenta creada por ese administrador. El registro público crea clientes y contratistas. Las cuentas de demostración guardadas en el navegador durante fase 2 requieren registrarse o crearse en el servidor. Todos los perfiles utilizan Iniciar Sesión; ADMIN y VENDEDOR son dirigidos a /admin. Solo esos perfiles ven el enlace al panel, en escritorio y en el menú móvil; la navegación pública no incluye un login administrativo separado.

## Comandos disponibles

| Comando | Resultado |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Compila la aplicación en `dist/`. |
| `npm run preview` | Sirve la compilación de producción para revisión local. |
| `npm test` | Inicia Vitest en modo interactivo. |
| `npm run test:run` | Ejecuta la suite una vez. |
| `npm run test:coverage` | Ejecuta pruebas y genera `coverage/index.html` y los contadores JSON. |
| `npm run lint` | Ejecuta el análisis estático con Oxlint. |

## Suite reducida para la evaluación

Por la solicitud docente de la evaluación 2, la suite vigente del frontend conserva exactamente **3 casos unitarios**, uno por integrante. Se eliminaron los restantes casos de esta entrega; no se ocultan ni se marcan como omitidos. El historial de Git conserva la suite anterior. Las pruebas del backend no cambian.

| Integrante | Archivo en `src/test/services/` | Regla y resultado esperado |
| --- | --- | --- |
| Martín | `userService.test.js` | Correo: acepta `duoc.cl`, `profesor.duoc.cl` y `gmail.com`; rechaza `hotmail.com`. |
| Jeremy | `productService.test.js` | Precio de oferta: $10.000 con 20% de descuento da $8.000. |
| Sebastián | `shippingService.test.js` | Retiro: disponible y con costo $0 para una dirección de Santiago. |

Ejecutar `npm run test:run` desde esta carpeta: deben aparecer **3 archivos y 3 pruebas**, sin pruebas omitidas. Cada caso sigue preparar datos → ejecutar la función → comprobar el resultado. Son pruebas unitarias de reglas del frontend, sin navegador ni llamadas HTTP; no demuestran login, compra completa ni persistencia.

Las cifras de pruebas y cobertura de los informes enlazados más abajo corresponden a verificaciones históricas anteriores a esta reducción, no a la suite actual.

## Organización

`src/pages/` contiene las vistas; `src/components/`, los componentes reutilizables; `src/context/`, la sesión y el carrito; `src/services/`, las reglas y la persistencia; `src/data/`, los datos iniciales; `src/styles/`, los estilos; y `src/test/`, las pruebas y su configuración de entorno.

El catálogo inicial incluye 27 productos en siete categorías. Las imágenes y sus [créditos](public/assets/img/productos/CREDITOS.md) se almacenan en `public/assets/img/productos/` y se sirven desde el proyecto.

## Alcance y verificación

`userApiService.js` realiza las operaciones REST de sesión y usuarios. `AuthContext` guarda el token bajo `auth_token`, que también utiliza el cliente de catálogo de Jeremy, y consulta `/usuarios/me` al restaurar la sesión o volver a la pestaña. Las rutas protegidas esperan esa respuesta. Un 401 en Usuarios cierra la sesión. Una caída de red permite reintentar la validación conservando el token. Los errores de registro o gestión mantienen los datos del formulario y no registran éxito local.

El mantenedor permite crear, editar, asignar roles y desactivar usuarios. El listado y los controles distinguen cuentas activas e inactivas. La edición sin contraseña conserva la existente. El crédito se configura en Ventas, por lo que el registro y el mantenedor de Usuarios envían solo datos de perfil.

Checkout, historial, comprobantes, gestión de pedidos y cuenta corriente utilizan la API de Ventas. El catálogo público y su mantenedor también consultan Ventas y muestran los errores de conexión. El carrito permanece en el navegador y conserva referencias de productos en caché. Usuarios administra los datos de perfil y Ventas administra los datos financieros.

La verificación del 5 de noviembre de 2026 registra 118 pruebas aprobadas en 19 archivos, compilación de producción correcta y Oxlint con cero errores y nueve advertencias. Los [resultados automáticos de fase 3](../../docs/APIs%20e%20Integracion/evidencias/resultados-automaticos-v3.txt) reúnen los contadores. La conexión de ambos backends con MySQL se documenta en las [pruebas MySQL](../documentacion/PRUEBAS_MYSQL.md), incluyendo persistencia tras reinicio. El [informe de APIs e integración](../../docs/APIs%20e%20Integracion/APIS_E_INTEGRACION.md) registra el recorrido comercial desde React. La cobertura de fase 2 corresponde a aquella entrega; la medición posterior de fase 3 se enlaza al final de esta guía.

También se completó el [recorrido de React con Usuarios/MySQL](../documentacion/PRUEBAS_REACT_USUARIOS_MYSQL.md), incluyendo registro, edición, rol, permisos, reinicio, recuperación de conexión y desactivación con rechazo de login.

## Contenedor para AWS

El Dockerfile compila React y sirve `dist` mediante Nginx. Para usarlo con ambos servicios y MySQL, seguir la [guía de despliegue en EC2](../despliegue/README.md). En esa construcción las URLs de APIs son relativas: `/usuarios/api/v1` y `/ventas/api/v1`. Nginx resuelve los destinos dentro de Docker; el navegador utiliza la dirección pública de la tienda. Las variables de Vite se aplican al compilar, no al iniciar el contenedor final.

El [informe de pruebas v3, revisión 3.1](<../../docs/Pruebas unitarias (v3)/PRUEBAS_UNITARIAS_V3.md>) documenta tres casos aprobados y 2,02 % de cobertura de líneas. La medición corresponde a tres reglas unitarias, sin comprobar recorridos completos de la interfaz. Los contadores anteriores permanecen en sus archivos de evidencia fechados.
