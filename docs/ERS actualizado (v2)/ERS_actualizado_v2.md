# ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (ERS)
## VERSIÓN 2.0 — EVALUACIÓN PARCIAL 2 (DSY1104 FULL STACK II)

---

### DATOS DEL PROYECTO
- **Nombre del Proyecto:** Portal Web Ferretería Los Maestros (Plataforma E-Commerce y Gestión Operativa)
- **Organización / Cliente:** Ferretería Los Maestros Ltda. (La Serena / Coquimbo)
- **Institución:** Duoc UC — Escuela de Informática y Telecomunicaciones
- **Asignatura:** DSY1104 - Desarrollo Full Stack II (Foco Frontend)
- **Docente:** Profesor Evaluador
- **Estudiante / Desarrollador:** Sebastián Miranda (y equipo de desarrollo)
- **Fecha:** Octubre 2026
- **Versión del Documento:** 2.0 (Migración React + Vite + Vitest)
- **Estándar de Referencia:** IEEE Std 830-1998 (*IEEE Recommended Practice for Software Requirements Specifications*)

---

## ÍNDICE GENERAL

1. [INTRODUCCIÓN](#1-introducción)
   - 1.1. Propósito
   - 1.2. Ámbito del Sistema
   - 1.3. Definiciones, Acrónimos y Abreviaturas
   - 1.4. Referencias
   - 1.5. Visión General del Documento
2. [DESCRIPCIÓN GENERAL](#2-descripción-general)
   - 2.1. Perspectiva del Producto
   - 2.2. Funciones del Producto
   - 2.3. Características de los Usuarios y Roles (RBAC)
   - 2.4. Restricciones de Diseño e Implementación
   - 2.5. Suposiciones y Dependencias
   - 2.6. Requisitos Futuros
3. [REQUISITOS ESPECÍFICOS](#3-requisitos-específicos)
   - 3.1. Requisitos Comunes de las Interfaces
     - 3.1.1. Interfaces de Usuario (Framework CSS Propio: Bento Grid + Brutalismo Táctil)
     - 3.1.2. Interfaces de Hardware
     - 3.1.3. Interfaces de Software
     - 3.1.4. Interfaces de Comunicación
   - 3.2. Requisitos Funcionales (RF-01 al RF-15)
   - 3.3. Requisitos No Funcionales (RNF-01 al RNF-08)
   - 3.4. Matriz de Trazabilidad de Requisitos

---

## 1. INTRODUCCIÓN

### 1.1. Propósito
El presente documento constituye la **Especificación de Requisitos de Software (ERS) Versión 2.0** para el sistema web de **Ferretería Los Maestros**, desarrollado en el marco de la **Evaluación Parcial 2 (30%)** de la asignatura **DSY1104 Desarrollo Full Stack II** en Duoc UC.

El propósito fundamental de esta versión es documentar de manera formal, no ambigua y verificable los requisitos derivados de la migración tecnológica integral desde la Fase 1 (sitio web estático basado en HTML5, CSS3 y JavaScript nativo) hacia la **Fase 2**: una aplicación de página única (**SPA - Single Page Application**) de alto rendimiento construida con **Vite + React**, gobernada por un sistema de diseño propio basado en **Bento Grid y Brutalismo Táctil**, persistencia reactiva del lado del cliente vía **Web Storage API**, control de roles (**RBAC**), gestión de crédito para contratistas de la construcción y una batería automatizada de pruebas unitarias con **Vitest**.

### 1.2. Ámbito del Sistema
El sistema denominado **"Portal Web Ferretería Los Maestros v2"** abarca la digitalización de la experiencia comercial, logística y administrativa de la ferretería líder de la Cuarta Región de Coquimbo.

El sistema comprende:
1. **Catálogo Unificado de Productos:** Más de 26 artículos industriales y hogareños clasificados en 7 familias (Cementos y Hormigones, Pinturas y Adhesivos, Herramientas Manuales, Herramientas Eléctricas Makita/Bosch, Gasfitería Tigre/Madeco, Electricidad y Seguridad Industrial Norseg/3M), con control de existencias, cálculo de descuentos y alerta visual de stock crítico.
2. **Sistema de Carrito de Compras Dinámico:** Gestión en tiempo real de ítems seleccionados, validación automática contra inventario disponible y persistencia continua en el navegador.
3. **Flujo Integral de Checkout:** Despacho regional por zonas (La Serena, Coquimbo, Ovalle, Vicuña), selección de medios de pago con simulación de pasarela Webpay y modalidad exclusiva de **Cuenta Corriente / Línea de Crédito a 30 días para Contratistas Calificados** (cupo asignado de $3.500.000).
4. **Módulo de Autenticación y Registro:** Autenticación con credenciales seguras, asignación de roles (Administrador, Vendedor, Contratista, Cliente) y validación matemática estricta del **RUN / RUT chileno mediante el algoritmo Módulo 11**, además de restricción de dominios de correo institucionales (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`).
5. **Panel de Administración (Backoffice):** Módulos de mantención (CRUD) para catálogo de productos, gestión de usuarios/roles y monitoreo de estados de pedidos.
6. **Centro de Información y Servicios:** Mapa interactivo vectorial SVG de zonas de reparto, visor de artículos y guías técnicas de construcción (curado de hormigón, mantención de taladros, tuberías PPR/PVC) y formulario de contacto/cotizaciones.

### 1.3. Definiciones, Acrónimos y Abreviaturas
- **SPA (Single Page Application):** Aplicación web que carga una sola página HTML y actualiza dinámicamente el contenido mediante JavaScript según la interacción del usuario.
- **Vite:** Herramienta de compilación frontend de última generación basada en ES Modules nativos y Rollup.
- **React:** Biblioteca declarativa de componentes para interfaces de usuario reactivas.
- **Vitest:** Framework de pruebas unitarias ultrarrápido con soporte nativo para Vite y emulación de navegador mediante JSDOM.
- **RBAC (Role-Based Access Control):** Mecanismo de control de acceso fundamentado en roles asignados a los usuarios.
- **Bento Grid:** Paradigma de diseño contemporáneo que organiza módulos de contenido e información en bloques asimétricos ordenados inspirados en las tradicionales cajas bento japonesas.
- **Brutalismo Táctil (Tactile Brutalism):** Estilo visual caracterizado por bordes sólidos de alto contraste (2.5px a 3.5px), sombras proyectadas rígidas sin desenfoque (`offset-x: 4px`, `offset-y: 4px`, `blur: 0`), paleta industrial de alta seguridad y microinteracciones que emulan la pulsación física de interruptores o botones mecánicos (`translate(2px, 2px)`).
- **RUN / RUT:** Rol Único Nacional / Rol Único Tributario chileno, compuesto por cuerpo numérico y dígito verificador calculado por Módulo 11.
- **DTE:** Documento Tributario Electrónico.
- **LocalStorage:** Almacenamiento local persistente por origen del navegador web (HTML5 Web Storage API).

### 1.4. Referencias
- *IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.*
- Guía de Asignatura Duoc UC: *DSY1104 Desarrollo Full Stack II — Guía de Evaluación Parcial 2 (30%).*
- Material de Cátedra Duoc UC: *2.3.4 MC_Informes de cobertura de código (Lines, Statements, Branches, Functions).*
- Documento de Especificación Fase 1: *DSY1104 - Forma E - Ferretería Los Maestros.*
- Catálogo de Productos Oficial: *DSY1104 - Forma E - Catálogo Ferretería Los Maestros.xlsx.*

### 1.5. Visión General del Documento
El documento se estructura en tres secciones cardinales: la Sección 1 contextualiza los objetivos y ámbito; la Sección 2 expone las características operacionales, usuarios, restricciones de estilo y dependencias; y la Sección 3 detalla exhaustivamente cada requisito funcional (RF-01 a RF-15), no funcional (RNF-01 a RNF-08) y la matriz de trazabilidad con la suite de pruebas.

---

## 2. DESCRIPCIÓN GENERAL

### 2.1. Perspectiva del Producto
El sistema constituye la plataforma central de atención al cliente y gestión operativa de Ferretería Los Maestros. En la Fase 2, la aplicación opera como una SPA autónoma desacoplada en el cliente, estructurada en una arquitectura de cuatro capas:
```
┌────────────────────────────────────────────────────────┐
│             CAPA 1: INTERFAZ Y PRESENTACIÓN            │
│  (Vistas, Componentes React, Bento Grid & Brutalismo)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│         CAPA 2: ESTADO GLOBAL (REACT CONTEXT)          │
│  (AuthContext [Sesión/RBAC], CartContext [Carro/Stock])│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│      CAPA 3: SERVICIOS Y LÓGICA DE NEGOCIO PURA        │
│  (productService, userService [Módulo 11], orderService)│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│       CAPA 4: PERSISTENCIA Y ALMACENAMIENTO            │
│     (storageService -> LocalStorage JSON Normalizado)  │
└────────────────────────────────────────────────────────┘
```

### 2.2. Funciones del Producto
Las capacidades operacionales del sistema se sintetizan en:
- Navegación instantánea y enrutamiento declarativo sin recarga de página (`react-router-dom`).
- Búsqueda en tiempo real por nombre, código SKU y filtrado por familias de productos ferreteros.
- Semáforo y radar de **Stock Crítico** para advertir oportunamente sobre quiebres de inventario.
- Carro de compras persistente con validación instantánea de límites de existencias.
- Proceso de compra con selector de método de despacho (Retiro en tienda La Serena / Despacho a obra) y opciones de pago (Webpay Crédito/Débito simulado o Cargo a Cuenta Corriente de Contratista).
- Generación de comprobante con código único de pedido (`LM-2026-XXXX`).
- Autenticación con perfiles diferenciados y control de sesión persistente.
- Registro con validación matemática de RUN chileno (Módulo 11) y selectores jerárquicos de Región y Comuna.
- Módulos CRUD protegidos para administradores y vendedores (creación, edición y eliminación de productos, usuarios y actualización de estados de pedidos).
- Mapa vectorial interactivo SVG de cobertura regional de despachos.
- Portal de capacitación y divulgación técnica con artículos de construcción.
- Formulario de contacto con cálculo estimado de cotizaciones en tiempo real.

### 2.3. Características de los Usuarios y Roles (RBAC)

| Rol | Identificador | Descripción de Perfil y Privilegios |
|---|---|---|
| **Público / Invitado** | `guest` | Usuario anónimo. Puede explorar catálogo, buscar productos, leer fichas técnicas y blogs, usar el mapa de cobertura, agregar ítems al carro y contactar a la tienda. |
| **Cliente Regular** | `cliente` | Usuario particular registrado. Cuenta con credenciales, historial de compras, autocompletado en checkout y acceso a promociones del mes. |
| **Contratista Certificado** | `contratista` | Constructor o maestro profesional con línea de crédito aprobada ($3.500.000). Acceso exclusivo a pago diferido a 30 días sin cargo inmediato. |
| **Vendedor de Mesón** | `vendedor` | Personal de ventas de sucursal. Posee permisos para consultar stock crítico en tiempo real, visualizar inventario y operar el mantenedor de productos. |
| **Administrador General** | `admin` | Jefatura de operaciones y sistemas. Acceso irrestricto al Backoffice: creación/edición de catálogo, gestión de usuarios, asignación de roles y control logístico de despachos. |

### 2.4. Restricciones de Diseño e Implementación
1. **Cero Dependencias CSS Externas (No Bootstrap, No Tailwind):** La arquitectura visual debe ser 100% nativa utilizando CSS Moderno con variables CSS (`:root`), flexbox, grid y media queries.
2. **Estilo Bento Grid + Brutalismo Táctil:**
   - Bordes duros de `2.5px` a `3.5px solid var(--tactile-border)`.
   - Sombras proyectadas sólidas sin difuminado (`box-shadow: 4px 4px 0 var(--tactile-shadow)` y `6px 6px 0`).
   - Microinteracciones físicas en botones y tarjetas que simulen respuesta mecánica táctil (`:active { transform: translate(2px, 2px); }`).
   - Paleta cromática industrial: Amarillo Seguridad (`#F59E0B`), Naranja Advertencia (`#EA580C`), Azul Contratista (`#2563EB`), Pizarra Oscura (`#0F172A`) y Fondo Cemento Claro (`#F8FAFC`).
3. **Persistencia Autónoma en Navegador:** Los datos de catálogo, clientes, credenciales y transacciones residen en `localStorage`, garantizando persistencia reactiva durante recargas y cierres de sesión.
4. **Validación Estricta de RUN Chileno:** El algoritmo de verificación de cédula nacional debe implementar matemáticamente la regla de ponderadores 2 a 7 con residuo 11 (Módulo 11), rechazando cualquier RUT matemáticamente inconsistente.
5. **Cobertura Automatizada con Vitest:** El proyecto debe contar con una suite de pruebas unitarias que cubra lógica de negocio, validaciones y renderizado de componentes, superando los requerimientos de la pauta de evaluación.

### 2.5. Suposiciones y Dependencias
- El usuario final cuenta con un navegador moderno compatible con ECMAScript 2022+ (Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+).
- El entorno de ejecución y compilación de desarrollo requiere Node.js v18.0.0 o superior con npm v9.0.0 o superior.
- La cuota de almacenamiento LocalStorage del navegador se encuentra disponible con un límite mínimo de 5 MB por origen.

### 2.6. Requisitos Futuros
- Integración con pasarela de pago real **Transbank Webpay Plus** mediante REST API y tokens de transacción.
- Conexión a servicio de Facturación Electrónica del SII para emisión directa de Boletas y Facturas Electrónicas (DTE).
- Integración bidireccional con software ERP de bodega (SAP Business One / Defontana).

---

## 3. REQUISITOS ESPECÍFICOS

### 3.1. Requisitos Comunes de las Interfaces

#### 3.1.1. Interfaces de Usuario
- **Estructura Bento Grid:** Distribución modular y asimétrica de componentes en rejilla responsive, optimizando el uso del espacio según el tamaño del monitor o pantalla táctil.
- **Brutalismo Táctil:** Tipografía industrial sans-serif de alto impacto, contrastes AAA, bordes gruesos de tinta negra/pizarra, sombras sin desenfoque y etiquetas pulsantes para inventario crítico.
- **Navegación Intuitiva:** Barra de navegación superior fija con accesos rápidos a Catálogo, Categorías, Ofertas, Blogs, Mapa, Carrito (con insignia táctil de contador) e indicador visual de usuario autenticado con botón de desconexión. En pantallas móviles, se despliega un panel lateral tipo Drawer táctil.

#### 3.1.2. Interfaces de Hardware
- Compatibilidad nativa con pantallas táctiles capacitivas (smartphones y tablets con área táctil mínima de 44x44 px para botones interactivos) y monitores de alta resolución (Full HD, 2K y 4K).

#### 3.1.3. Interfaces de Software
- **Entorno de Ejecución:** React 18+ sobre Vite 5+.
- **Enrutamiento:** `react-router-dom` v6+.
- **Iconografía:** `lucide-react` para iconografía SVG vectorial de alta fidelidad.
- **Entorno de Pruebas:** Vitest v4+, JSDOM, `@testing-library/react`, `@testing-library/jest-dom` y motor de cobertura `@vitest/coverage-v8`.

#### 3.1.4. Interfaces de Comunicación
- Uso de Web APIs nativas del estándar W3C (`localStorage`, `JSON`, `window.location`). Protocolo seguro HTTPS para despliegue en entornos de producción.

---

### 3.2. Requisitos Funcionales

#### RF-01: Catálogo y Búsqueda en Tiempo Real
- **Código:** RF-01
- **Nombre:** Visualización y Búsqueda en Catálogo de Productos
- **Actores:** Invitado, Cliente, Contratista, Vendedor, Administrador
- **Precondiciones:** La aplicación debe encontrarse inicializada con el catálogo de productos base en almacenamiento local.
- **Descripción:** El usuario debe poder visualizar el catálogo completo de productos con imágenes optimizadas, categoría técnica, marca del fabricante, precio unitario en pesos chilenos ($ CLP), descuento promocional si aplica y disponibilidad de inventario. El sistema debe permitir filtrar dinámicamente mediante una barra de búsqueda por nombre o código SKU.
- **Postcondiciones:** La vista de catálogo actualiza de manera instantánea las tarjetas de producto que coinciden con los términos ingresados.

#### RF-02: Filtrado Avanzado y Detección de Stock Crítico
- **Código:** RF-02
- **Nombre:** Filtrado Multicriterio y Alerta de Stock Crítico
- **Actores:** Todos los usuarios (Detección de stock crítico ampliada para Vendedores y Administradores)
- **Precondiciones:** Acceso a la vista de productos o panel de administración.
- **Descripción:** El sistema debe proveer filtros por familia de productos (Cementos, Pinturas, Herramientas Eléctricas, Herramientas Manuales, Gasfitería, Electricidad, Seguridad), ordenamiento por precio (menor a mayor, mayor a menor, alfabético) y filtro exclusivo para productos en oferta. Para el personal operativo (Vendedores y Administradores), el sistema debe permitir filtrar productos cuyo inventario sea igual o inferior a su `stockMinimo`, marcándolos con una insignia pulsante "STOCK CRÍTICO".
- **Postcondiciones:** La interfaz presenta únicamente los productos que satisfacen la combinación de criterios seleccionados.

#### RF-03: Ficha Detallada de Producto y Especificaciones
- **Código:** RF-03
- **Nombre:** Visualización de Ficha de Producto y Especificaciones Técnicas
- **Actores:** Todos los usuarios
- **Precondiciones:** El producto debe existir en el catálogo persistido.
- **Descripción:** Al hacer clic en una tarjeta de producto, el usuario debe navegar a la vista `/productos/:id`, donde se despliega la imagen ampliada, código SKU, marca, categoría, descripción detallada, características técnicas (garantía, dimensiones, procedencia, materialidad), precio final con descuento calculado y botón para añadir al carro con selector de cantidad respetando el límite de stock.
- **Postcondiciones:** El usuario visualiza la información técnica exhaustiva del artículo.

#### RF-04: Carrito de Compras Dinámico y Restricciones de Inventario
- **Código:** RF-04
- **Nombre:** Gestión Reactiva del Carrito de Compras
- **Actores:** Todos los usuarios
- **Precondiciones:** Existencia de productos con stock disponible en el catálogo.
- **Descripción:** El usuario puede agregar productos al carrito desde las tarjetas del catálogo o la ficha técnica. El carrito debe permitir incrementar, decrementar o eliminar ítems. Si el usuario intenta agregar más unidades de las disponibles en inventario físico, el sistema debe bloquear la acción y desplegar una alerta táctil informando el tope de existencias. El subtotal, descuento acumulado, costo estimado de despacho y total general deben recalcularse en tiempo real.
- **Postcondiciones:** El estado global del carrito y el almacenamiento `carrito_v2` en LocalStorage quedan sincronizados.

#### RF-05: Proceso de Checkout y Despacho Regional
- **Código:** RF-05
- **Nombre:** Configuración de Despacho y Datos de Entrega
- **Actores:** Cliente, Contratista, Administrador (o Invitado con datos de contacto)
- **Precondiciones:** El carrito de compras debe contener al menos un producto.
- **Descripción:** En la vista `/checkout`, el usuario debe ingresar o autocompletar su información de contacto (Nombre completo, RUN, Teléfono, Correo electrónico) y seleccionar el método de entrega:
  1. *Retiro en Tienda Central:* Sucursal Balmaceda 1420, La Serena (Costo: $0).
  2. *Despacho a Domicilio / Obra:* Selección de comuna (La Serena: $4.990, Coquimbo: $5.990, Ovalle: $12.990, Vicuña / Valle de Elqui: $14.990, etc.), dirección exacta y observaciones de acceso a faena.
- **Postcondiciones:** El total de la orden se actualiza incorporando el recargo del flete logístico según la zona elegida.

#### RF-06: Procesamiento de Pagos y Línea de Crédito Contratista
- **Código:** RF-06
- **Nombre:** Liquidación de Pago y Cargo a Cuenta Corriente
- **Actores:** Cliente Regular, Contratista
- **Precondiciones:** Carrito válido y datos de despacho completados.
- **Descripción:** El sistema debe ofrecer dos alternativas de pago:
  1. *Transbank Webpay Plus (Crédito / Débito):* Simulación de pasarela electrónica bancaria con posibilidad de prueba de éxito o simulación deliberada de rechazo financiero para validación de contingencias.
  2. *Cuenta Corriente Contratista (Crédito 30 días):* Exclusivo para usuarios autenticados con rol `contratista`. El sistema valida que el monto total de la compra no supere la línea de crédito disponible ($3.500.000). Si el saldo es suficiente, autoriza la compra inmediatamente generando un comprobante diferido a 30 días y deduciendo el saldo disponible.
- **Postcondiciones:** Se debita el stock físico de los productos comprados y se emite la orden definitiva.

#### RF-07: Comprobante y Resumen de Orden de Compra
- **Código:** RF-07
- **Nombre:** Emisión de Comprobante de Compra y Código de Seguimiento
- **Actores:** Usuario Comprador
- **Precondiciones:** Pago autorizado o aprobado por crédito contratista.
- **Descripción:** El sistema redirige a la vista `/checkout/exito`, presentando el código único de seguimiento (formato `LM-2026-XXXX`), desglose de productos adquiridos, método de despacho, dirección de entrega, medio de pago utilizado, total cancelado y botón táctil para imprimir o exportar la nota de venta. El carrito de compras se vacía automáticamente tras el éxito.
- **Postcondiciones:** La orden queda almacenada en el registro global de pedidos en `pedidos_v2`.

#### RF-08: Autenticación de Usuarios y Control de Acceso RBAC
- **Código:** RF-08
- **Nombre:** Inicio de Sesión y Protección de Rutas por Perfil
- **Actores:** Todos los usuarios registrados
- **Precondiciones:** Usuario previamente registrado o preconfigurado en el sistema.
- **Descripción:** Permite autenticar usuarios mediante correo electrónico y contraseña. Al validar las credenciales, el sistema guarda la sesión activa en `usuario_actual_v2` con su respectivo rol. Si un usuario sin privilegios intenta acceder a rutas administrativas (`/admin`), el componente `ProtectedRoute` bloquea el acceso y redirige a la página de inicio o login con mensaje de advertencia. La vista de inicio de sesión provee botones de "Acceso Rápido Demo" para facilitar pruebas con cuentas de Administrador, Vendedor, Contratista y Cliente.
- **Postcondiciones:** Se habilitan los menús y acciones correspondientes al rol en toda la navegación de la SPA.

#### RF-09: Registro de Usuarios y Validación de RUN Módulo 11
- **Código:** RF-09
- **Nombre:** Registro de Nuevas Cuentas con Algoritmo Módulo 11
- **Actores:** Invitado
- **Precondiciones:** Formulario de registro en `/registro`.
- **Descripción:** El usuario completa su registro ingresando Nombre, RUN, Teléfono, Correo Electrónico, Región, Comuna y Contraseña con confirmación. El sistema ejecuta las siguientes validaciones en tiempo real:
  - Formato y validez matemática del RUN mediante el algoritmo Módulo 11 (cálculo de ponderadores 2 al 7, resta contra 11 y comprobación del dígito verificador 0-9 o K).
  - Dominios de correo autorizados según política institucional (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`).
  - Coincidencia estricta y longitud mínima de contraseñas.
  - Cascadas dinámicas de Comuna según la Región seleccionada.
- **Postcondiciones:** El nuevo usuario se almacena en `usuarios_v2` con rol `cliente` y queda facultado para iniciar sesión.

#### RF-10: Mantenedor CRUD de Productos (Backoffice)
- **Código:** RF-10
- **Nombre:** Administración Integral del Catálogo de Productos
- **Actores:** Administrador, Vendedor
- **Precondiciones:** Usuario autenticado con rol `admin` o `vendedor`.
- **Descripción:** Interfaz administrativa en `/admin/productos` para:
  - Listar el catálogo completo con indicadores de stock crítico.
  - Crear nuevos productos (código SKU, nombre, descripción, precio, categoría, stock, stock mínimo, descuento, URL de imagen, especificaciones).
  - Modificar datos comerciales, precios o reabastecer inventario de productos existentes.
  - Eliminar artículos descontinuados previa confirmación táctil.
- **Postcondiciones:** Los cambios se persisten inmediatamente en el repositorio de productos y se reflejan en el catálogo público sin recargar la página.

#### RF-11: Mantenedor CRUD de Usuarios y Asignación de Roles
- **Código:** RF-11
- **Nombre:** Gestión de Usuarios y Permisos de Sistema
- **Actores:** Administrador
- **Precondiciones:** Usuario autenticado exclusivamente con rol `admin`.
- **Descripción:** Interfaz protegida en `/admin/usuarios` que permite:
  - Listar todos los usuarios registrados con su RUN, correo y rol asignado.
  - Modificar roles operativos (ascender clientes a `contratista`, asignar rol de `vendedor` o `admin`).
  - Asignar o ajustar cupos de crédito para contratistas autorizados.
  - Bloquear o eliminar cuentas de usuario.
- **Postcondiciones:** Los permisos de acceso se actualizan en tiempo real en la base de usuarios persistida.

#### RF-12: Gestión Logística de Pedidos
- **Código:** RF-12
- **Nombre:** Monitoreo y Cambio de Estado de Órdenes de Compra
- **Actores:** Administrador, Vendedor
- **Precondiciones:** Existencia de órdenes registradas en el sistema.
- **Descripción:** En la vista `/admin/pedidos`, el personal autorizado puede revisar el historial de transacciones, ver el detalle de ítems y actualizar el estado logístico de cada pedido mediante una máquina de estados: *Pendiente* -> *En Preparación / Bodega* -> *En Ruta de Despacho* -> *Entregado en Faena* o *Listo para Retiro*.
- **Postcondiciones:** El estado de la orden se actualiza de manera permanente en el registro general de pedidos.

#### RF-13: Consulta de Cobertura Geográfica de Despacho
- **Código:** RF-13
- **Nombre:** Visualización de Cobertura y Zonas de Entrega
- **Actores:** Todos los usuarios
- **Precondiciones:** Acceso a la sección de cobertura o mapa.
- **Descripción:** El sistema dispone de un componente vectorial interactivo SVG con las comunas de la Cuarta Región (La Serena, Coquimbo, Ovalle, Vicuña / Elqui, Andacollo), indicando tarifas vigentes de transporte pesado/liviano, tiempos promedio de entrega (24 hrs urbano / 48 hrs rural) y condiciones para flete gratuito por compras sobre $200.000.
- **Postcondiciones:** El usuario identifica con certeza si su obra o faena cuenta con cobertura de despacho directo.

#### RF-14: Artículos Técnicos y Guías de Construcción (Blog Ferretero)
- **Código:** RF-14
- **Nombre:** Consulta de Guías Técnicas y Recomendaciones de Obra
- **Actores:** Todos los usuarios
- **Precondiciones:** Navegación a `/blogs`.
- **Descripción:** Módulo de contenidos técnicos especializados en construcción y ferretería industrial (p. ej., "Guía paso a paso para el curado óptimo de hormigón en climas costeros", "Mantención preventiva de herramientas eléctricas en faenas de alta exigencia", "Diferencias técnicas entre tuberías de polipropileno PPR y PVC hidráulico"). Permite leer el artículo completo, conocer herramientas sugeridas y acceder directamente a los productos recomendados.
- **Postcondiciones:** El usuario accede a material educativo y de soporte técnico profesional.

#### RF-15: Formulario de Contacto y Solicitud de Cotizaciones Técnicas
- **Código:** RF-15
- **Nombre:** Recepción de Consultas y Cotizaciones en Línea
- **Actores:** Todos los usuarios
- **Precondiciones:** Navegación a la vista `/contacto`.
- **Descripción:** Formulario interactivo que recopila Nombre, Correo, Teléfono, Tipo de Consulta (Cotización Mayorista, Asesoría Técnica, Estado de Despacho, Servicio Postventa), Comuna y Mensaje. Incluye una calculadora estimativa rápida para cubicación aproximada de sacos de cemento y metros lineales de perfilería.
- **Postcondiciones:** El sistema valida los campos requeridos, simula el despacho de la cotización y entrega una retroalimentación positiva al usuario.

---

### 3.3. Requisitos No Funcionales

#### RNF-01: Rendimiento y Tiempos de Respuesta
- **Métrica:** El tiempo de primer renderizado con contenido (FCP - *First Contentful Paint*) no debe exceder los 1.0 segundos en conexiones de banda ancha estándar. El tiempo para interactividad completa (TTI - *Time to Interactive*) debe ser inferior a 1.5 segundos. La compilación de producción con Vite debe completarse en menos de 1000 ms.

#### RNF-02: Seguridad e Integridad
- **Métrica:** Las contraseñas de usuario no deben exponerse en texto plano en logs ni en componentes no autenticados. El acceso a rutas privilegiadas (`/admin/*`) debe verificarse estrictamente en cada transición de ruta mediante el componente `ProtectedRoute`. El cálculo de RUN chileno debe ser inviolable frente a inyecciones de datos no numéricos o formatos alterados.

#### RNF-03: Fiabilidad y Tolerancia a Fallos
- **Métrica:** Ante cualquier corrupción eventual de datos en `localStorage` o claves faltantes, el sistema debe autocurarse mediante el servicio de almacenamiento inicializando nuevamente las semillas de datos sin arrojar excepciones fatales de pantalla en blanco (*White Screen of Death*).

#### RNF-04: Disponibilidad
- **Métrica:** Al ser una Single Page Application del lado del cliente servida desde bundle estático optimizado, el sistema exhibirá una disponibilidad operacional superior al 99.9%, sin dependencia de servidores de aplicación dinámicos para la renderización de vistas.

#### RNF-05: Mantenibilidad y Calidad de Código
- **Métrica:** Arquitectura desacoplada en componentes reutilizables, modularización de estilos en CSS moderno por dominios (`variables.css`, `reset.css`, `bento.css`, `components.css`) y código JavaScript limpio y libre de librerías CSS externas. El código debe superar satisfactoriamente la ejecución de pruebas unitarias automatizadas con cero fallos (`0 errors, 100% tests passing`).

#### RNF-06: Portabilidad y Compatibilidad Cross-Browser
- **Métrica:** Compatibilidad garantizada en los motores de navegación modernos Chromium (Google Chrome, Microsoft Edge, Brave, Opera), Gecko (Mozilla Firefox) y WebKit (Apple Safari), tanto en sistemas operativos de escritorio (Linux, Windows, macOS) como móviles (Android, iOS).

#### RNF-07: Usabilidad, Accesibilidad y Diseño Táctil
- **Métrica:** Cumplimiento de estándares de usabilidad táctil: áreas clicables mínimas de 44x44 píxeles para botones, contraste cromático superior a 4.5:1 para cumplimiento WCAG 2.1 nivel AA/AAA, respuesta física visible al presionar elementos interactivos mediante el efecto de pulsación mecánica de Brutalismo Táctil (`transform: translate(2px, 2px)`).

#### RNF-08: Cobertura de Pruebas Unitarias
- **Métrica:** Cobertura de pruebas unitarias superior al 75% en líneas y sentencias en los módulos críticos de lógica de negocio (`userService.js`, `productService.js`, `orderService.js`, `storageService.js`) y verificación completa de renderizado de componentes y flujos de usuario mediante Vitest.

---

### 3.4. Matriz de Trazabilidad de Requisitos y Verificación

| Código RF | Nombre del Requisito Funcional | Módulo / Archivo Implementador | Prueba Unitaria Vitest Asociada | Estado de Cumplimiento |
|---|---|---|---|---|
| **RF-01** | Catálogo y Búsqueda de Productos | `Products.jsx`, `productService.js` | `productService.test.js` (Búsqueda por texto y SKU) | **Implementado y Verificado (100%)** |
| **RF-02** | Filtrado Avanzado y Stock Crítico | `ProductFilter.jsx`, `productService.js` | `productService.test.js` (Filtro por categoría, ofertas y stock crítico) | **Implementado y Verificado (100%)** |
| **RF-03** | Ficha Detallada de Producto | `ProductDetail.jsx`, `ProductCard.jsx` | `ProductCard.test.jsx` (Render de precio, imagen y botón) | **Implementado y Verificado (100%)** |
| **RF-04** | Carrito y Control de Stock | `Cart.jsx`, `CartContext.jsx` | `Cart.test.jsx` (Render de carro vacío, incremento y recálculo) | **Implementado y Verificado (100%)** |
| **RF-05** | Checkout y Despacho Regional | `Checkout.jsx`, `chileLocations.js` | `orderService.test.js` (Creación de orden con flete y comunas) | **Implementado y Verificado (100%)** |
| **RF-06** | Procesamiento de Pago y Contratistas | `Checkout.jsx`, `orderService.js` | `orderService.test.js` (Validación de saldo en cuenta corriente) | **Implementado y Verificado (100%)** |
| **RF-07** | Comprobante de Compra y Seguimiento | `CheckoutSuccess.jsx`, `orderService.js`| `orderService.test.js` (Estructura de comprobante y código LM-2026) | **Implementado y Verificado (100%)** |
| **RF-08** | Autenticación y RBAC | `Login.jsx`, `AuthContext.jsx`, `userService.js`| `Login.test.jsx`, `userService.test.js` (Autenticación y perfiles) | **Implementado y Verificado (100%)** |
| **RF-09** | Registro de Usuarios y Módulo 11 | `Register.jsx`, `userService.js` | `userService.test.js` (Validación algorítmica de RUT Módulo 11) | **Implementado y Verificado (100%)** |
| **RF-10** | Mantenedor CRUD de Productos | `ProductManager.jsx`, `productService.js` | `productService.test.js` (Crear, editar, eliminar y deducir stock) | **Implementado y Verificado (100%)** |
| **RF-11** | Mantenedor CRUD de Usuarios | `UserManager.jsx`, `userService.js` | `userService.test.js` (Alta, actualización y borrado de usuarios) | **Implementado y Verificado (100%)** |
| **RF-12** | Gestión y Monitoreo de Pedidos | `OrderManager.jsx`, `orderService.js` | `orderService.test.js` (Transición de estados de pedidos) | **Implementado y Verificado (100%)** |
| **RF-13** | Mapa de Cobertura y Despachos | `CoverageMap.jsx` | Inspección visual e interactiva SVG en navegador | **Implementado y Verificado (100%)** |
| **RF-14** | Blogs y Guías de Construcción | `Blogs.jsx`, `BlogDetail.jsx` | Inspección de contenido y enrutamiento SPA | **Implementado y Verificado (100%)** |
| **RF-15** | Contacto y Cotizaciones | `Contact.jsx` | `Contact.test.jsx` (Validación de campos obligatorios y envío) | **Implementado y Verificado (100%)** |

---

### APROBACIÓN Y FIRMAS DE CONFORMIDAD

| Rol de Evaluación | Nombre Completo | Firma / Estado | Fecha |
|---|---|---|---|
| **Líder de Desarrollo / Estudiante** | Sebastián Miranda | *Aprobado y Entregado* | Octubre 2026 |
| **Docente Evaluador Cátedra** | Docente DSY1104 Duoc UC | *Pendiente de Calificación* | Octubre 2026 |
