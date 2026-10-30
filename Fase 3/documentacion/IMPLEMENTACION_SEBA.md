# Implementación de pedidos y cuenta corriente de Seba

Se implementaron las entidades, repositorios, servicios transaccionales, DTO y controladores de pedidos y cuenta corriente en `backend/ventas-service`. No se modificaron las entregas anteriores ni se implementó catálogo o Usuarios.

## API

Base local: `http://localhost:8082`. Swagger: `/swagger-ui/index.html`. La API usa JWT Bearer; Swagger permite explorar el contrato generado, pero para llamar endpoints protegidos se debe enviar el token (por ejemplo con curl).

| Método y ruta | Quién | Resultado |
| --- | --- | --- |
| POST `/api/v1/pedidos` | CLIENTE, CONTRATISTA, ADMIN | 201, pedido creado y Location |
| GET `/api/v1/pedidos?page=0&size=20` | Roles del sistema | 200, página con `content`; máximo 100 resultados por página |
| GET `/api/v1/pedidos/{id}` | Dueño del pedido, ADMIN o VENDEDOR | 200; 404 si no existe o pertenece a otro cliente |
| PATCH `/api/v1/pedidos/{id}/estado` | ADMIN | 200, avance o anulación |
| GET `/api/v1/cuentas-corrientes/me` | CONTRATISTA | 200, cupo, saldo y disponible; 404 si no tiene cuenta |
| PUT `/api/v1/cuentas-corrientes/{usuarioId}` | ADMIN | 200, configuración del cupo y habilitación |

Sin autenticación: 401. Sin permiso de rol: 403. JSON inválido o validaciones de entrada: 400. Stock/cupo insuficiente o transición inválida: 409. Dependencia sin implementar: 503. Los errores propios incluyen `mensaje`.

Compra de ejemplo:

```json
{
  "items": [{"id": 1, "cantidad": 2}],
  "deliveryType": "RETIRO_TIENDA",
  "paymentMethod": "WEBPAY_SIMULADO",
  "customerName": "Cliente de prueba",
  "customerEmail": "cliente@gmail.com"
}
```

Para despacho usar `DESPACHO_OBRA`, `address`, `region` y `commune`. Se conservan las tarifas de demostración de fase 2: La Serena/Coquimbo $4.990, gratis desde $100.000; Vicuña $14.990; otras ubicaciones requieren cotización. La región debe ser `Región de Coquimbo`. Los pagos `WEBPAY_SIMULADO` y `TRANSFERENCIA` no realizan cobros reales. La transferencia queda pendiente y la compra a crédito pendiente de fin de mes.

El cuerpo de compra no define usuario, rol, precio ni totales. Aunque se envíen campos extra con esos nombres, no se usan. El dueño proviene de `sub` del token y el precio efectivo de catálogo. Nombre, correo y dirección son datos de contacto declarados, no una prueba de identidad.

Cambiar estado: `{"estado":"ANULADO"}`. Estados disponibles: CONFIRMADO, EN_PREPARACION, DESPACHADO, ENTREGADO y ANULADO. Se permiten avances, sin retrocesos; ENTREGADO y ANULADO son finales. Repetir el estado actual devuelve el mismo pedido sin cambios. Anular revierte stock y cargo de crédito dentro de una transacción.

Configurar cuenta: `{"activa":true,"creditoMaximo":100000}`. No permite editar la deuda. El cupo no puede ser menor al saldo. El identificador del usuario es único; no hay eliminación de cuentas ni registro de abonos en este alcance.

## Contrato con Jeremy

Implementar un bean de `pedidos.service.CatalogoPedidos`:

- `bloquear(id)` carga el producto con bloqueo de escritura y devuelve identificador, código, nombre, **precio efectivo**, stock y bandera `activo`. Un producto dado de baja sigue disponible para restituir el stock de pedidos anteriores; Pedidos rechaza compras nuevas cuando `activo=false`.
- `ajustarStock(id, delta)` modifica las existencias del producto bloqueado: negativo descuenta, positivo restituye. Debe impedir existencias negativas.
- Ambas operaciones usan la misma base, conexión administrada y transacción de Ventas. No usar HTTP, persistencia en memoria ni `REQUIRES_NEW`: impedirían revertir conjuntamente pedido, stock y crédito.
- No lanzar excepciones comprobadas sin configurar rollback; usar `NegocioException` para producto inexistente, inactivo o stock insuficiente.
- La compra bloquea productos por ID ascendente, luego la cuenta. La anulación bloquea primero el pedido, después los productos ordenados y la cuenta. Mantener ese orden al ampliar el sistema.

Mientras no exista ese bean, comprar o anular devuelve 503. El catálogo de prueba solo existe en `src/test`, no se usa como implementación de Jeremy.

## Contrato con Martín

El JWT firmado con RS256 debe incluir `sub` como ID numérico positivo, `roles` como arreglo (por ejemplo `["CONTRATISTA"]`), `exp` y `iss`. Configurar en Ventas:

```bash
export VENTAS_JWT_PUBLIC_KEY_LOCATION=file:/ruta/a/publica.pem
export VENTAS_JWT_ISSUER=losmaestros-usuarios
```

Se valida firma, emisor y vigencia; no se emiten tokens aquí. Sin clave pública configurada la aplicación arranca, pero rechaza los tokens. No hay usuarios, contraseñas ni tokens de prueba incorporados en ejecución normal.

Implementar un bean de `cuentacorriente.service.UsuariosContratistas` que consulte por canal autenticado si el usuario existe, está activo y es CONTRATISTA. Si Usuarios falla, propagar un error de dependencia sin habilitar la cuenta. Mientras falte ese bean, configurar cuentas devuelve 503. La compra a crédito exige tanto el rol del JWT como una cuenta activa con cupo suficiente.

La cadena de seguridad de Seba cubre pedidos y cuentas. Una cadena de cierre deniega las otras rutas excepto Swagger. Jeremy puede añadir una cadena de catálogo con orden entre 2 y 99, acordando permisos con Martín. CORS y la integración de emisión de tokens siguen pendientes de coordinación; no se abrió acceso global a la API.

## Datos y ejecución

Desde `Fase 3/backend/ventas-service`:

```bash
./mvnw test
./mvnw spring-boot:run
```

El perfil local usa H2 temporal. Para MySQL crear la base, ejecutar `database/seba-mysql.sql`, definir `DB_USERNAME` y `DB_PASSWORD` y usar `./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql`. El script solo crea las tablas de Seba; no crea cuentas MySQL ni datos de catálogo. La conexión real a MySQL sigue pendiente de comprobar.

## Pruebas y límites

`PedidosSebaTests` automatiza los cinco escenarios acordados: compra correcta, stock insuficiente, crédito insuficiente incluido flete, anulación repetida y permisos. Se ejecutan peticiones HTTP simuladas contra controladores, servicios y JPA/H2, sin transacción envolvente del test. El catálogo de prueba modifica una tabla mediante la misma transacción; así se comprueba la reversión real del stock si falla el crédito.

El contexto autenticado se simula mediante Spring Security Test. Estos cinco casos no prueban firma criptográfica de tokens, concurrencia real de varias compras ni MySQL. Resultado verificado: los cinco casos aprobados, sin fallos, errores ni omisiones. La prueba de arranque de la plantilla también aprobó y se conserva aparte. No hay meta de cobertura.

El frontend de fase 2 permanece intacto: sigue siendo una demostración local. La conexión de sus pantallas necesita el catálogo y el login del equipo; no se presenta como integración terminada.

Referencias técnicas: [JWT Resource Server de Spring Security](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html), [transacciones JPA](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html) y [bloqueos JPA](https://docs.spring.io/spring-data/jpa/reference/3.5/jpa/locking.html).
