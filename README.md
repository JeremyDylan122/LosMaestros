# Ferretería Los Maestros

Proyecto de DSY1104 Desarrollo FullStack II, Duoc UC. La segunda versión implementa una tienda y un panel de gestión con React, Vite, CSS propio y almacenamiento en el navegador.

**Integrantes:** Sebastián Diaz, Jeremy Hanglin y Martín Caviedes.

El caso corresponde a una ferretería familiar de La Serena, Región de Coquimbo. La aplicación permite consultar productos, preparar una compra, registrar pedidos simulados y gestionar datos locales según el perfil. El negocio contempla más de 800 referencias; esta entrega utiliza una selección inicial de **27 productos en siete categorías**.

## Alcance de la segunda versión

La tienda incluye catálogo con búsqueda, categorías, ofertas y orden por precio efectivo; fichas con imágenes referenciales; carrito persistente; registro e inicio de sesión; compra con retiro o despacho e historial personal. Búsqueda, categoría y ofertas se sincronizan con la URL y el historial del navegador.

El administrador y el vendedor gestionan productos, existencias y pedidos. La gestión de usuarios se reserva al administrador. El contratista puede consultar su saldo y utilizar crédito de demostración cuando dispone de cupo suficiente.

Las operaciones se guardan en el mismo navegador mediante `localStorage`. Esta etapa no integra backend, base de datos compartida, cobros, correo saliente ni servicios reales de despacho. El esquema de cobertura es un SVG local que representa localidades y zonas; no valida direcciones ni calcula distancias.

El [ERS](<docs/ERS actualizado (v2)/ERS_actualizado_v2.md>) distingue las funciones implementadas, parciales y pendientes. Contiene 57 requisitos: 46 funcionales, ocho no funcionales y tres restricciones técnicas.

## Organización del repositorio

```text
LosMaestros/
├── fase1/
│   └── proyecto_etapa1_html/            # Primera versión con HTML, CSS y JavaScript
│       ├── assets/
│       ├── Styles/global.css
│       ├── index.html
│       └── main.js
├── fase 2/
│   └── proyecto_Etapa2_REACT/           # Aplicación de la segunda entrega
│       ├── public/assets/img/productos/ # Imágenes locales y créditos
│       ├── src/
│       │   ├── assets/
│       │   ├── components/             # Componentes compartidos y de productos
│       │   ├── context/                # Sesión y carrito
│       │   ├── data/                   # Catálogo, cuentas y datos iniciales
│       │   ├── pages/                  # Tienda, formularios y panel
│       │   ├── services/               # Productos, usuarios, pedidos y persistencia
│       │   ├── styles/                 # Variables y estilos propios
│       │   └── test/                   # 92 pruebas en 13 archivos
│       ├── package.json
│       ├── package-lock.json
│       └── vite.config.js
└── docs/
    ├── README.md
    ├── ERS actualizado (v2)/            # ERS vigente en Word y Markdown
    └── PRUEBAS UNITARIAS/               # Informe vigente en Word y Markdown
```

La primera etapa se conserva como antecedente. El desarrollo y las pruebas de la entrega actual corresponden a la carpeta React.

## Tecnologías y presentación

| Área | Herramientas de la versión documentada |
| --- | --- |
| Interfaz | React 19.3.0, React DOM y JavaScript |
| Desarrollo y compilación | Vite 8.3.4 |
| Navegación | React Router 7.18.4 |
| Iconos | Lucide React |
| Presentación | CSS propio con variables, rejillas y componentes reutilizables |
| Persistencia | `localStorage`; comprobante de invitado asociado a la pestaña mediante `sessionStorage` |
| Pruebas | Vitest 5.0.3, cobertura V8, jsdom y Testing Library |
| Análisis estático | Oxlint |

Los estilos se organizan en `src/styles/`. `variables.css` concentra los colores y valores comunes; `bento.css` define la distribución de tarjetas; `components.css` reúne controles y componentes. La identidad visual utiliza amarillo, naranja, azul y pizarra, con bordes y sombras sólidas. La adaptación a distintos anchos se implementa mediante CSS del proyecto, sin Bootstrap ni Tailwind.

Las imágenes del catálogo se sirven desde archivos del proyecto. Son referencias del tipo de artículo; la marca, medidas y características comerciales se describen en cada ficha. Los [créditos de imágenes](<fase 2/proyecto_Etapa2_REACT/public/assets/img/productos/CREDITOS.md>) identifican fuentes, autores, licencias y descripciones de las imágenes generadas.

## Ejecución local

Se recomienda **Node.js 24**, versión utilizada para la verificación, y npm. Node.js 18 no es compatible con las dependencias de esta entrega. La configuración instalada de Vitest admite Node `^22.12.0`, `^24.0.0` o `>=26.0.0`; se debe respetar también la compatibilidad del resto del archivo de bloqueo.

```powershell
git clone https://github.com/MartinCaviedes/LosMaestros.git
cd LosMaestros
cd "fase 2/proyecto_Etapa2_REACT"
npm ci
npm run dev
```

Si el repositorio ya está clonado, se comienza desde su carpeta React. La terminal indica la dirección del servidor; por defecto es `http://localhost:5173`. Debe abrirse mediante el servidor de Vite, no directamente como un archivo HTML. Web Crypto requiere `localhost` o un contexto seguro HTTPS.

Para comprobar la compilación de producción:

```powershell
npm run build
npm run preview
```

Vite genera los archivos en `dist/`. La vista previa utiliza la dirección indicada en la terminal, normalmente `http://localhost:4173`. Un alojamiento estático debe servir `index.html` como alternativa para las rutas de React.

## Perfiles y cuentas de demostración

La vista `/login` ofrece botones para completar estas credenciales ficticias. Son las cuentas iniciales; una edición o eliminación guardada en el navegador puede cambiar su acceso.

| Perfil | Correo | Contraseña | Funciones principales |
| --- | --- | --- | --- |
| Administrador | `admin@duoc.cl` | `admin123` | Gestiona usuarios, productos, inventario y pedidos. |
| Vendedor | `vendedor@duoc.cl` | `vend123` | Gestiona productos, inventario y pedidos; no administra usuarios. |
| Contratista | `contratista@duoc.cl` | `contra123` | Compra con crédito de demostración y consulta sus pedidos y saldo. |
| Cliente | `cliente@gmail.com` | `clie123` | Compra y consulta sus pedidos. |

Un visitante puede consultar la tienda y realizar una compra simulada. El registro permite crear cuentas locales de cliente o contratista. Un nuevo contratista recibe automáticamente $2.500.000 de cupo de demostración; la cuenta precargada tiene un cupo de $3.500.000 y un saldo inicial de $450.000. Estos montos y la habilitación automática son decisiones de la demo.

Los permisos y la titularidad se comprueban en la aplicación local. Las contraseñas se derivan con PBKDF2 SHA-256, sal y 100.000 iteraciones, pero el propietario del navegador sigue controlando sus datos y roles. La autorización mediante servidor corresponde a una etapa posterior.

Se conservan los dominios admitidos `duoc.cl`, `profesor.duoc.cl` y `gmail.com`, y el rango de contraseña de 4 a 10 caracteres. Son restricciones del prototipo y no una política de seguridad de producción. El registro comprueba el RUN con Módulo 11; esto no acredita la identidad de una persona.

## Reglas comerciales observables

| Operación | Comportamiento de la V2 |
| --- | --- |
| Disponibilidad | No se agregan productos sin existencias ni cantidades superiores al stock. La confirmación vuelve a validar la disponibilidad. |
| Precio y total | Se utiliza el precio vigente con descuento. El pedido conserva subtotal, despacho y total en pesos chilenos. |
| Compra confirmada | Guarda el pedido, descuenta existencias y vacía el carrito, manteniendo visible la confirmación. |
| Compra fallida | Conserva el carrito y no registra el pedido ni descuenta stock o crédito. |
| Crédito | Exige contratista habilitado y cupo suficiente; carga el total, incluido el despacho. |
| Anulación | Restituye existencias y saldo una sola vez. Los pedidos cerrados no se reabren. |
| Historial | La interfaz muestra al cliente sus pedidos; el invitado consulta su último comprobante en la pestaña de compra. |
| Reposición | La interfaz destaca stock menor o igual al mínimo; no envía avisos externos. |

Las tarifas de despacho son de demostración y se reutilizan en la consulta de cobertura y en la compra:

| Destino o modalidad | Tarifa |
| --- | --- |
| Retiro en tienda | Gratuito |
| La Serena y Coquimbo, Región de Coquimbo | $4.990 bajo $100.000 de subtotal; gratuito desde $100.000 |
| Vicuña, Región de Coquimbo | $14.990 |
| Otras ubicaciones | Requieren cotización; se ofrece retiro en tienda |

El catálogo, las cuentas y los pedidos persisten en el origen del navegador. Otra dirección, puerto o dispositivo mantiene un almacenamiento distinto. Para una revisión con datos iniciales puede utilizarse un perfil de navegador aislado.

## Pruebas y resultados documentados

Desde la carpeta React:

```powershell
npm run test:run
npm run test:coverage
npm run lint
```

`npm test` inicia Vitest en modo interactivo. `npm run test:run` ejecuta la suite una vez y `npm run test:coverage` genera la cobertura. El informe navegable se encuentra en `coverage/index.html` y los contadores en `coverage/coverage-final.json`.

La revisión documental **2.2 del 16 de octubre de 2026** registra **92 pruebas aprobadas en 13 archivos**, sin fallos ni casos omitidos. Incluye servicios, componentes y flujos integrados de compra, acceso y navegación.

| Métrica global | Cubierto / total | Porcentaje |
| --- | --- | --- |
| Sentencias | 785 / 1312 | 59,83 % |
| Ramas | 598 / 1121 | 53,34 % |
| Funciones | 177 / 357 | 49,57 % |
| Líneas | 701 / 1152 | 60,85 % |

Los servicios alcanzan 90,96 % de cobertura de líneas. La compilación de producción se completó y Oxlint registró cero errores y seis advertencias. El porcentaje de aprobación de pruebas no equivale al porcentaje de cobertura.

Las comprobaciones complementarias en navegador abarcan cinco perfiles en ocho anchos, 69 comprobaciones de vistas y la carga de las 27 imágenes del catálogo. Estas comprobaciones se documentan por separado y no incrementan la cobertura de Vitest. El [informe de pruebas](<docs/PRUEBAS UNITARIAS/PRUEBAS_UNITARIAS.md>) explica el procedimiento, la trazabilidad y las áreas pendientes.

## Documentación de entrega

La carpeta [docs](docs/README.md) contiene una única versión vigente de cada documento, revisión 2.2:

- [ERS en Word](<docs/ERS actualizado (v2)/ERS_Ferreteria_Los_Maestros_v2.docx>) y [versión Markdown](<docs/ERS actualizado (v2)/ERS_actualizado_v2.md>).
- [Informe de pruebas y cobertura en Word](<docs/PRUEBAS UNITARIAS/Informe_Pruebas_Unitarias_y_Cobertura.docx>) y [versión Markdown](<docs/PRUEBAS UNITARIAS/PRUEBAS_UNITARIAS.md>).

El ERS conserva las reglas del caso y delimita el alcance actual frente al resultado final esperado. La integración con servicios centrales, base de datos, pagos reales, reportes comerciales completos y verificación geográfica precisa permanece identificada como desarrollo posterior.
