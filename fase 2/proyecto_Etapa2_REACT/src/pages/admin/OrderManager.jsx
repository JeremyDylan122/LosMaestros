import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  ArrowLeft 
} from 'lucide-react';
import { orderService } from '../../services/orderService';

export const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const reloadOrders = () => {
    setOrders(orderService.getOrders());
  };

  useEffect(() => {
    reloadOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    try {
      orderService.updateOrderStatus(orderId, newStatus);
      reloadOrders();
      if (selectedOrder && Number(selectedOrder.id) === Number(orderId)) {
        setSelectedOrder(prev => ({ ...prev, estado: newStatus }));
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === 'ALL' || o.estado === filterStatus;
    const matchSearch = o.codigoOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ marginBottom: '0.35rem' }}>
            <Link to="/admin" style={{ fontSize: '0.85rem', fontWeight: 800, textDecoration: 'underline' }}>
              &larr; Volver al Dashboard Administrativo
            </Link>
          </div>
          <h1 className="section-title">
            <ShoppingBag size={28} /> Control de Órdenes y Despacho a Faena
          </h1>
          <p className="section-subtitle">
            Seguimiento de pedidos, coordinación de entrega y estados de cuenta corriente.
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bento-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="input-tactile"
              placeholder="Buscar por N° Orden, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'CONFIRMADO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`btn-tactile btn-tactile-sm ${filterStatus === st ? 'btn-tactile-primary' : ''}`}
              >
                {st === 'ALL' ? 'Todos' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLA DE ÓRDENES */}
      <div className="table-container-tactile">
        <table className="table-tactile">
          <thead>
            <tr>
              <th>Código Orden</th>
              <th>Fecha</th>
              <th>Cliente / Obra</th>
              <th>Modalidad</th>
              <th>Pago</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th style={{ textAlign: 'center' }}>Estado Pedido</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{o.codigoOrden}</td>
                <td style={{ fontSize: '0.85rem' }}>{o.fechaLegible}</td>
                <td>
                  <strong>{o.customerName}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem' }}>
                    {o.deliveryType === 'DESPACHO_OBRA' ? 'Despacho a Faena' : 'Retiro en Tienda'}
                  </span>
                </td>
                <td>
                  <span className="badge-tactile" style={{
                    backgroundColor: o.paymentMethod === 'CUENTA_CORRIENTE' ? 'var(--color-contractor)' : '#f1f5f9',
                    color: o.paymentMethod === 'CUENTA_CORRIENTE' ? '#ffffff' : 'inherit'
                  }}>
                    {o.paymentMethod === 'CUENTA_CORRIENTE' ? 'Cta. Corriente' : 'Inmediato'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
                  ${o.totalMonto.toLocaleString('es-CL')}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <select
                    className="select-tactile"
                    value={o.estado}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 800 }}
                  >
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                    <option value="DESPACHADO">DESPACHADO</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="ANULADO">ANULADO</option>
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(o)}
                    className="btn-tactile btn-tactile-sm"
                    title="Ver Detalle de Ítems"
                  >
                    <Eye size={14} /> Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLE DE ORDEN */}
      {selectedOrder && (
        <div className="modal-overlay-tactile" role="dialog" aria-modal="true">
          <div className="modal-box-tactile">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: 'var(--border-sm)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900 }}>
                Detalle de Orden: {selectedOrder.codigoOrden}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="btn-tactile btn-tactile-sm">
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Cliente:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</div>
              <div><strong>Destino:</strong> {selectedOrder.address}</div>
              <div><strong>Medio de Pago:</strong> {selectedOrder.paymentMethod}</div>
              {selectedOrder.notes && <div><strong>Notas de descarga:</strong> {selectedOrder.notes}</div>}
            </div>

            <h4 className="label-tactile" style={{ marginBottom: '0.5rem' }}>Materiales Incluidos:</h4>
            <div className="table-container-tactile" style={{ marginBottom: '1.25rem', boxShadow: 'none' }}>
              <table className="table-tactile">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ textAlign: 'center' }}>Cant.</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.nombre} <small style={{ color: 'var(--text-muted)' }}>({it.codigo})</small></td>
                      <td style={{ textAlign: 'center', fontWeight: 800 }}>{it.cantidad}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>${it.subtotal.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-sm)', paddingTop: '1rem' }}>
              <span style={{ fontWeight: 800 }}>Total Orden:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                ${selectedOrder.totalMonto.toLocaleString('es-CL')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
