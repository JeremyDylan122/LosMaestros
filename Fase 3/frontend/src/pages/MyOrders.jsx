import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';

export const MyOrders = () => {
  const { user } = useAuth();
  const current = userService.getUserById(user.id);
  const orders = orderService.getOrdersByUserId(user.id);
  return <div className="container page-container">
    <h1 className="section-title">Mis pedidos</h1>
    <p>Historial de compras de tu cuenta en este navegador. Los pagos y el crédito son de demostración.</p>
    {current?.rol === 'CONTRATISTA' && <div className="bento-card">
      <h2>Cuenta corriente</h2>
      <p>Saldo pendiente: ${current.saldoPendiente.toLocaleString('es-CL')}</p>
      <p>Crédito disponible: ${Math.max(0, current.creditoMaximo - current.saldoPendiente).toLocaleString('es-CL')}</p>
    </div>}
    {orders.length === 0 ? <p>Aún no tienes pedidos registrados.</p> : orders.map(order => <article className="bento-card" key={order.id} style={{ marginTop: '1rem' }}>
      <h2>{order.codigoOrden}</h2>
      <p>{order.fechaLegible} · {order.estado}</p>
      <p>Total: ${order.totalMonto.toLocaleString('es-CL')} · {order.estadoPago}</p>
      <Link to={`/compra-exitosa/${order.id}`}>Ver detalle del pedido</Link>
    </article>)}
  </div>;
};
