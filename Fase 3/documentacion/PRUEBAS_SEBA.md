# Cinco pruebas prioritarias de Seba

Estos cinco casos están automatizados en `backend/ventas-service/src/test/java/cl/losmaestros/ventas/PedidosSebaTests.java`. Se ejecutan con `./mvnw test` desde Ventas, sin meta de cobertura.

Usan Spring Boot, MockMvc y persistencia H2 real. Catálogo y Usuarios se sustituyen por colaboradores exclusivos de prueba; el stock usa la misma transacción que los pedidos. El contexto autenticado se simula, por lo que estos casos no prueban la emisión ni la firma de JWT.

## 1. Compra correcta con cálculo del servidor

**Objetivo:** guardar un pedido coherente, usando precios confiables y descontando las cantidades correctas.

- Dado un cliente autenticado y un producto con precio vigente de $10.000 y stock de 5 unidades.
- Cuando compra 2 unidades con retiro en tienda y pago simulado. La petición intenta enviar un precio de $1 y la identidad de otro cliente.
- Entonces el precio enviado se ignora (o el contrato rechaza campos no admitidos). Un pedido aceptado tiene precio unitario $10.000, subtotal y total $20.000, flete $0 y stock final 3.
- El pedido pertenece al cliente autenticado, conserva sus detalles y puede consultarse después. Nunca se acepta el precio ni la identidad manipulados.

## 2. Stock insuficiente sin cambios parciales

**Objetivo:** impedir una compra imposible y evitar descuentos parciales en carritos de varios productos.

- Dado un carrito con dos productos: A tiene stock 5 y B tiene stock 1; ambos tienen precio vigente.
- Cuando el cliente solicita 2 unidades de A y 2 de B.
- Entonces se rechaza la operación por falta de stock, no se guarda pedido ni detalles y las existencias permanecen A=5 y B=1.
- Si se eligió cuenta corriente, tampoco cambia el saldo. La respuesta debe describir el rechazo y no informar compra exitosa.

## 3. Crédito insuficiente incluyendo despacho

**Objetivo:** comprobar el cupo real y que un rechazo no deje stock descontado ni una deuda parcial.

- Dado un contratista con cuenta activa, cupo de $100.000, saldo pendiente de $80.000 y crédito disponible de $20.000.
- Cuando compra productos por $18.000 con despacho urbano a La Serena, Región de Coquimbo, mediante cuenta corriente.
- Entonces el servidor calcula flete de $4.990 y total de $22.990; rechaza la compra porque supera el disponible.
- El saldo sigue en $80.000, el stock no cambia y no existen pedido ni detalles nuevos.

## 4. Anulación con devolución una sola vez

**Objetivo:** recuperar stock y crédito sin duplicar devoluciones al repetir la solicitud.

- Dado un pedido confirmado de 2 unidades, por $20.000 cargados a cuenta corriente; después de comprar, el stock es 3 y el saldo es $50.000.
- Cuando un administrador anula ese pedido y repite la misma solicitud.
- Entonces el pedido queda ANULADO, el stock termina en 5 y el saldo en $30.000.
- La segunda solicitud puede devolver el estado ya anulado o un conflicto documentado, pero no vuelve a modificar stock ni saldo. Pedido, stock y saldo se verifican juntos en la base de prueba.

## 5. Acceso a pedidos según identidad y rol

**Objetivo:** proteger pedidos ajenos y limitar al vendedor a consulta.

Con un pedido perteneciente al cliente A, verificar esta matriz como variantes del mismo caso de autorización:

| Actor | Acción | Resultado esperado |
| --- | --- | --- |
| Sin sesión | Consultar el pedido | 401 |
| Cliente A | Consultar su pedido | 200 con sus datos |
| Cliente B | Consultar el pedido de A o listar pedidos | El detalle se deniega con 403 o 404 según el contrato; su listado no contiene el pedido de A |
| Vendedor | Consultar pedidos | Permitido |
| Vendedor | Anular o cambiar estado | 403, sin cambios de pedido, stock ni saldo |
| Administrador | Consultar y realizar una transición válida | Permitido |

La identidad y los roles de cada variante deben proceder del contexto autenticado; no basta con ocultar botones en React.

## Cómo se usarán

Se implementaron como cinco métodos de prueba; el caso de permisos comprueba la matriz en un mismo escenario. La prueba de carga de contexto que trae la plantilla no cuenta entre estos cinco casos de negocio.

Estos casos priorizan consistencia comercial y permisos. No prueban por sí solos toda la aplicación ni sustituyen las pruebas del catálogo o del login, a cargo de sus respectivos responsables.
