# Aplicación React de Ferretería Los Maestros

Segunda versión del proyecto DSY1104 Desarrollo FullStack II, Duoc UC. Implementa la tienda, el carrito, la compra simulada y la gestión local con React, Vite y CSS propio.

Integrantes: Sebastián Diaz, Jeremy Hanglin y Martín Caviedes.

El [README principal](../../README.md) describe el alcance, las reglas comerciales y las cuentas de demostración. La [documentación de entrega](../../docs/README.md) reúne el ERS y el informe de pruebas, revisión 2.2.

## Iniciar la aplicación

Desde esta carpeta, con Node.js 24 y npm:

```powershell
npm ci
npm run dev
```

La dirección de desarrollo aparece en la terminal; por defecto es `http://localhost:5173`. Las dependencias están fijadas en `package-lock.json`. Node.js 18 no es compatible con esta entrega.

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

## Organización

`src/pages/` contiene las vistas; `src/components/`, los componentes reutilizables; `src/context/`, la sesión y el carrito; `src/services/`, las reglas y la persistencia; `src/data/`, los datos iniciales; `src/styles/`, los estilos; y `src/test/`, las pruebas y su configuración de entorno.

El catálogo inicial incluye 27 productos en siete categorías. Las imágenes y sus [créditos](public/assets/img/productos/CREDITOS.md) se almacenan en `public/assets/img/productos/` y se sirven desde el proyecto.

## Alcance y verificación

La aplicación conserva datos en el navegador. Los pagos, el despacho, el contacto y el crédito son demostraciones; no existe integración con backend ni base de datos compartida. La cobertura se representa mediante SVG y tarifas locales, sin servicio de mapas externo. Web Crypto requiere `localhost` o HTTPS.

La medición final registra 92 pruebas aprobadas en 13 archivos y 60,85 % de cobertura global de líneas. La compilación se completó; Oxlint registró cero errores y seis advertencias. El [informe de pruebas y cobertura](<../../docs/PRUEBAS UNITARIAS/PRUEBAS_UNITARIAS.md>) detalla resultados, límites y reproducción.
