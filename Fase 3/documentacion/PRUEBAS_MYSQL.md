# Pruebas de Integración de los Backends con MySQL

La integración final de catálogo, pedidos, crédito y las correcciones de interfaz se documentan en [APIs e integración de fase 3](../../docs/APIs%20e%20Integracion/APIS_E_INTEGRACION.md). Este registro conserva los casos comprobados en la etapa indicada.

**Fecha de verificación** 5 de noviembre de 2026.

Se verificaron Usuarios y Ventas mediante sus APIs REST, con persistencia MySQL y JWT emitidos por Usuarios. El recorrido incluyó compra a crédito, reversión de transacciones, reinicios, anulación y solicitudes concurrentes.

## 1. Entorno y preparación

| Elemento | Configuración verificada |
| --- | --- |
| Base de datos | MySQL 8.4.13, imagen `mysql:8.4` |
| Aplicaciones | Spring Boot 3.5.16, ejecutado con Java 21 y compilación para Java 17 |
| Perfil | `mysql`, con `ddl-auto=validate` |
| Bases | `losmaestros_usuarios` y `losmaestros_ventas` |
| Credenciales | Una cuenta de aplicación por base, con SELECT, INSERT, UPDATE y DELETE |
| Autenticación | JWT RS256 y credencial interna compartida para verificar contratistas |
| Catálogo inicial | 7 categorías y 27 productos |

Los esquemas se prepararon con [usuarios-mysql.sql](../backend/usuarios-service/database/usuarios-mysql.sql), [jeremy-catalogo-mysql.sql](../backend/ventas-service/database/jeremy-catalogo-mysql.sql) y [seba-mysql.sql](../backend/ventas-service/database/seba-mysql.sql). Ambos servicios completaron el arranque y la validación de tablas.

La prueba registrada utilizó una instancia aislada, con bases nuevas y puertos disponibles. Para reproducirla, seguir la [guía de preparación del backend](../backend/README.md). Esa configuración publica MySQL en `localhost:3307`, Usuarios en `localhost:8081` y Ventas en `localhost:8082`.

## 2. Resultados registrados

| Caso | Operación | Resultado |
| --- | --- | --- |
| Registro y login | Registrar un contratista e iniciar sesión. | Cuenta creada y login correcto. Contraseña almacenada con BCrypt. |
| Duplicados | Repetir el registro con el mismo RUN y correo. | 409. |
| Edición | Cambiar el apellido y consultar el perfil. | Se guardó el nuevo valor. |
| Habilitación | ADMIN asigna cupo de $100.000 al contratista. | Cuenta habilitada después de la consulta interna a Usuarios. |
| Compra correcta | Comprar 2 unidades del producto 1, a $5.990, con retiro y cuenta corriente. | Pedido por $11.980. Stock de 80 a 78. Deuda de $0 a $11.980. |
| Crédito insuficiente | Comprar otras 15 unidades del producto 1 con la misma cuenta. | 409. Stock en 78, deuda en $11.980 y un solo pedido en la base. |
| Persistencia | Reiniciar ambos backends y MySQL. Volver a consultar los datos. | Se conservaron el apellido editado, el pedido, el stock de 78 y la deuda de $11.980. |
| Anulación repetida | Solicitar dos veces la anulación del pedido confirmado. | Estado ANULADO. Stock en 80 y deuda en $0. |
| Concurrencia | Enviar dos compras de 2 unidades sobre el producto 26, con stock inicial 2. | Una respuesta 201 y otra 409. Stock final 0. |

El [registro del recorrido](evidencias/martin/resultados-mysql.txt) reúne las comprobaciones completadas. Los resultados de las pruebas automatizadas de ambos servicios están en [resultados-automaticos.txt](evidencias/martin/resultados-automaticos.txt).

## 3. Reproducción del recorrido

Repetir los casos en un entorno de prueba con datos iniciales. Los valores de stock y cupo de la tabla anterior describen el estado inicial usado en esta ejecución.

### Autenticación

Obtener una sesión administrativa con la contraseña definida al preparar el entorno:

```powershell
$usuarios = 'http://localhost:8081/api/v1'
$ventas = 'http://localhost:8082/api/v1'
$sesionAdmin = Invoke-RestMethod -Method Post -Uri "$usuarios/auth/login" -ContentType 'application/json' -Body (@{
    email = 'admin@duoc.cl'
    password = '<contraseña-administrativa-de-la-aplicación>'
} | ConvertTo-Json)
$headersAdmin = @{ Authorization = "Bearer $($sesionAdmin.token)" }
```

Registrar un contratista con el [cuerpo de ejemplo de la API](IMPLEMENTACION_MARTIN.md#entradas-y-respuestas). Usar un RUN y correo disponibles. Conservar `usuario.id` y `token` de la respuesta para las siguientes solicitudes.

### Cuenta y pedido

Enviar con el JWT de ADMIN un PUT a `/cuentas-corrientes/{usuarioId}` de Ventas:

```json
{
  "activa": true,
  "creditoMaximo": 100000
}
```

Con el JWT del contratista, enviar este cuerpo a POST `/pedidos`:

```json
{
  "items": [{"id": 1, "cantidad": 2}],
  "deliveryType": "RETIRO_TIENDA",
  "paymentMethod": "CUENTA_CORRIENTE",
  "customerName": "Ana Prueba",
  "customerEmail": "ana.prueba@gmail.com"
}
```

Registrar el ID del pedido creado. Consultar GET `/productos/1`, GET `/cuentas-corrientes/me` y GET `/pedidos/{id}` para comprobar stock, saldo y detalle. Repetir la compra con cantidad 15 para comprobar el rechazo por crédito insuficiente y volver a consultar esos datos.

### Persistencia y anulación

1. Detener los procesos Java de ambos servicios y ejecutar `docker compose restart mysql` desde `Fase 3/backend`.
2. Esperar el estado saludable mostrado por `docker compose ps` y arrancar los dos servicios con el perfil MySQL.
3. Iniciar sesión y consultar el perfil, el producto, el pedido y la cuenta.
4. Con JWT de ADMIN, enviar dos veces PATCH `/pedidos/{id}/estado` con `{"estado":"ANULADO"}`.
5. Confirmar que stock y saldo se restituyan una sola vez.

### Compras concurrentes

Utilizar el producto 26 con stock 2. Desde dos clientes HTTP, enviar simultáneamente POST `/pedidos` con cantidad 2, retiro y `WEBPAY_SIMULADO`. Cada solicitud debe llevar un JWT válido. Comprobar una compra aceptada, un rechazo por stock insuficiente y existencias finales iguales a cero.

## 4. Comprobación en la base

Además de las respuestas HTTP, un cliente SQL conectado a la base correspondiente permite revisar la persistencia:

```sql
-- losmaestros_usuarios
SELECT id, run, email, rol, activo FROM usuarios;

-- losmaestros_ventas
SELECT id, stock FROM productos WHERE id IN (1, 26);
SELECT id, usuario_id, estado, total_monto FROM pedidos;
SELECT usuario_id, credito_maximo, saldo_pendiente FROM cuentas_corrientes;
```

Cada cuenta de aplicación puede consultar su propia base. La preparación también verificó la denegación de acceso a la base del otro servicio.

## 5. Alcance de la verificación

Las pruebas automatizadas de Maven usan H2. El recorrido descrito en este informe se ejecutó contra MySQL real mediante HTTP. El caso de concurrencia cubre dos solicitudes sobre el mismo producto.

La verificación de la interfaz se documenta en [Pruebas de React con Usuarios y MySQL](PRUEBAS_REACT_USUARIOS_MYSQL.md).
