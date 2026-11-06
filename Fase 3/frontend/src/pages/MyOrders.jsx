import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useApiData } from '../hooks/useApiData';
import { ApiStatus } from '../components/common/ApiStatus';

export const MyOrders = () => {
  const { isContractor } = useAuth();
  const loadOrders = useCallback(() => orderService.getOrders(), []);
  const loadAccount = useCallback(() => isContractor ? orderService.getMyAccount() : Promise.resolve(null), [isContractor]);
  const orders = useApiData(loadOrders, []);
  const account = useApiData(loadAccount);
  return <div className="container page-container">
    <h1 className="section-title">Mis pedidos</h1>
    <p>Historial de compras de tu cuenta.</p>
    {isContractor && <div className="bento-card">
      <h2>Cuenta corriente</h2>
      <ApiStatus loading={account.loading} error={account.error} onRetry={account.reload} />
      {!account.loading && !account.error && (account.data ? <>
        <p>Estado: {account.data.activa ? 'Activa' : 'Inactiva'}</p>
        <p>Saldo pendiente: ${account.data.saldoPendiente.toLocaleString('es-CL')}</p>
        <p>Crédito disponible: ${account.data.creditoDisponible.toLocaleString('es-CL')}</p>
      </> : <p>Cuenta corriente pendiente de habilitación.</p>)}
    </div>}
    <ApiStatus loading={orders.loading} error={orders.error} onRetry={orders.reload} />
    {!orders.loading && !orders.error && (orders.data.length === 0 ? <p>Aún no tienes pedidos registrados.</p> : orders.data.map(order => <article className="bento-card" key={order.id} style={{ marginTop: '1rem' }}>
      <h2>{order.codigoOrden}</h2>
      <p>{order.fechaLegible} · {order.estado}</p>
      <p>Total: ${order.totalMonto.toLocaleString('es-CL')} · {order.estadoPago}</p>
      <Link to={`/compra-exitosa/${order.id}`}>Ver detalle del pedido</Link>
    </article>))}
  </div>;
};
