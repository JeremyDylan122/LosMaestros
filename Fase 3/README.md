# Aplicación integrada — Fase 3

Versión actual de Los Maestros: React consume los servicios de Usuarios y Ventas, con autenticación JWT y persistencia MySQL. El equipo confirma su despliegue en AWS; las evidencias locales conservadas describen únicamente las verificaciones que registran.

## Guías de trabajo

| Necesidad | Documento |
| --- | --- |
| Preparar bases y ejecutar servicios | [Backend](backend/README.md) |
| Ejecutar o compilar la interfaz | [Frontend](frontend/README.md) |
| Ejecutar el conjunto en Docker / AWS EC2 | [Despliegue](despliegue/README.md) |
| Registro, login, perfiles y roles | [API Usuarios](backend/usuarios-service/README.md) |
| Catálogo, inventario, pedidos y crédito | [API Ventas](backend/ventas-service/README.md) |
| Requisitos, manual y resultados | [Documentación académica](../docs/README.md) |

## Organización y autoría

Martín desarrolló Usuarios y seguridad; Jeremy, catálogo e inventario; Sebastián, pedidos y cuenta corriente. Cada frente incluye su integración con React. Catálogo, pedidos y cuentas forman parte del mismo servicio Ventas para compartir la transacción de compra y anulación.

`backend/` contiene ambos servicios y el MySQL de desarrollo; `frontend/`, la interfaz; `despliegue/`, la configuración del conjunto en contenedores; `documentacion/`, contratos técnicos y evidencias. Las fases anteriores son antecedentes históricos.
