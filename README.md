# Ferretería Los Maestros — Portal Web E-Commerce y Gestión Operativa
## Evaluación Parcial 2 (30%) — DSY1104 Desarrollo Full Stack II (Foco Frontend)
**Duoc UC — Escuela de Informática y Telecomunicaciones**

---

## 🏗️ Descripción del Proyecto
Este repositorio contiene la evolución tecnológica integral del portal web de **Ferretería Los Maestros** (La Serena / Coquimbo). El proyecto ha sido migrado desde un sitio web estático desarrollado en la Fase 1 (HTML, CSS y JS nativo) a una moderna **Single Page Application (SPA)** de alto rendimiento en la Fase 2, utilizando **Vite + React**, pruebas unitarias automatizadas con **Vitest**, persistencia reactiva en LocalStorage y un sistema de diseño propio basado en **Bento Grid + Brutalismo Táctil** (sin dependencias de Bootstrap ni Tailwind).

---

## 📁 Estructura del Repositorio

El proyecto se encuentra estructurado de acuerdo a las directrices de entrega:

```text
LosMaestros/
├── fase1/
│   └── proyecto_etapa1_html/          # Entrega Evaluación 1 (Sitio estático HTML5/CSS3/JS)
│       ├── css/
│       ├── js/
│       ├── images/
│       └── *.html
├── fase 2/
│   └── proyecto_Etapa2_REACT/         # Entrega Evaluación 2 (SPA Vite + React + Vitest)
│       ├── public/assets/img/         # Catálogo de imágenes de productos
│       ├── src/
│       │   ├── components/            # Navbar, Footer, ProductCard, Filter, Map, etc.
│       │   ├── context/               # AuthContext (RBAC) y CartContext (Stock en vivo)
│       │   ├── data/                  # Semillas iniciales (26 productos Excel, usuarios)
│       │   ├── pages/                 # Home, Products, Detail, Cart, Checkout, Auth, Admin
│       │   ├── services/              # productService, userService, orderService, storage
│       │   ├── styles/                # Framework CSS propio Bento Grid + Brutalismo Táctil
│       │   └── test/                  # Suite de 49 pruebas unitarias con Vitest
│       ├── package.json
│       └── vite.config.js
└── docs/                              # Documentación formal de la Evaluación 2
    ├── ERS actualizado (v2)/
    │   ├── ERS_actualizado_v2.md      # Especificación de Requisitos IEEE 830 v2
    │   └── ERS_Ferreteria_Los_Maestros_v2.docx
    ├── PRUEBAS UNITARIAS/
    │   ├── PRUEBAS_UNITARIAS.md       # Informe de pruebas y cobertura según guía 2.3.4
    │   └── Informe_Pruebas_Unitarias_y_Cobertura.docx
    ├── ERS_actualizado_v2.md
    ├── ERS_actualizado_v2.docx
    ├── PRUEBAS_UNITARIAS.md
    └── PRUEBAS_UNITARIAS.docx
```

---

## 🎨 Sistema de Estilo Propio: Bento Grid + Brutalismo Táctil
El proyecto prescinde intencionalmente de frameworks CSS pesados externos como Tailwind CSS o Bootstrap. Implementa una arquitectura modular propia en CSS Moderno:
- **Variables CSS (`variables.css`):** Paleta industrial de alta seguridad (Amarillo `#F59E0B`, Naranja `#EA580C`, Azul Contratista `#2563EB`, Pizarra `#0F172A`).
- **Bento Grid (`bento.css`):** Rejilla responsiva asimétrica de 1 a 4 columnas con tarjetas de diferente envergadura (`span-2`, `featured-wide`).
- **Brutalismo Táctil (`components.css`):** Bordes duros de 2.5px a 3.5px, sombras proyectadas sólidas sin difuminado (`4px 4px 0 #0F172A`), insignias pulsantes para stock crítico y respuesta de pulsación física mecánica en botones `:active` (`transform: translate(2px, 2px)`).

---

## 🧪 Pruebas Unitarias y Cobertura (Vitest + V8)
La suite cuenta con **49 pruebas unitarias automatizadas** con **100% de aprobación (49/49 PASS)**:
- **Validación matemática de RUN chileno (Módulo 11):** Verificación de RUTs reales con dígito numérico o K, y rechazo de RUTs inválidos.
- **Lógica comercial y stock:** Búsqueda por SKU/nombre, cálculo de ofertas, detección de stock crítico (`stock <= stockMinimo`), bloqueo por sobregiro de inventario.
- **Flujo de pedidos:** Generación de código correlativo `LM-2026-XXXX`, descuento automático de bodega y validación de línea de crédito contratista ($3.500.000).
- **Componentes y páginas:** Renderizado condicional en `ProductCard`, navegación en `Navbar`, recálculo dinámico en `Cart`, formulario con feedback en `Contact` e inicio de sesión en `Login`.

### Ejecución de Pruebas:
```bash
# Navegar al directorio de React
cd "fase 2/proyecto_Etapa2_REACT"

# Ejecutar la suite completa de pruebas
npm run test:run

# Generar reporte de cobertura de código
npm run test:coverage
```

---

## 🚀 Puesta en Marcha (Desarrollo Local)

### Requisitos Previos:
- Node.js v18+ o v24+
- npm v9+

### Pasos:
```bash
# 1. Clonar el repositorio
git clone git@github.com:Sebastianidm/LosMaestros.git
cd LosMaestros

# 2. Entrar al proyecto de React
cd "fase 2/proyecto_Etapa2_REACT"

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo con Hot Module Replacement (HMR)
npm run dev

# 5. Abrir en el navegador: http://localhost:5173
```

---

## 👥 Cuentas de Acceso Rápido (Demo RBAC)
La vista de Login (`/login`) cuenta con botones de autocompletado para probar los distintos perfiles:

| Perfil / Rol | Correo Electrónico | Contraseña | Privilegios / Características |
|---|---|---|---|
| **Administrador** | `admin@ferreterialosmaestros.cl` | `Admin2026!` | Acceso completo a Backoffice (Productos, Usuarios, Pedidos). |
| **Vendedor** | `vendedor@ferreterialosmaestros.cl` | `Venta2026!` | Consulta de inventario, stock crítico y mantenedor de productos. |
| **Contratista** | `contratista@constructora.cl` | `Obra2026!` | Línea de crédito aprobada ($3.5M) con pago diferido a 30 días. |
| **Cliente Regular** | `cliente@duoc.cl` | `Cliente2026!` | Compra con Webpay, autocompletado de checkout e historial. |
