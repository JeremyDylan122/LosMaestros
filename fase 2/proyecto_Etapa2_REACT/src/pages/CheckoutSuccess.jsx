import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Printer, ArrowRight, Package, Truck, CreditCard, Building2 } from 'lucide-react';
import { orderService } from '../services/orderService';

export const CheckoutSuccess = () => {
  const { id } = useParams();
  const location = useLocation();

  const order = location.state?.order || orderService.getOrderById(id);

  if (!order) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="bento-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2>Orden no encontrada</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            No se pudo recuperar la información de la orden solicitada.
          </p>
          <Link to="/" className="btn-tactile btn-tactile-primary">
            Volver a la Página Principal
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container page-container" style={{ maxWidth: '850px' }}>
      <div className="bento-card" style={{ padding: '2.5rem 2rem' }}>
        {/* ICONO Y CONFIRMACIÓN */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '68px',
            height: '68px',
            backgroundColor: '#d1fae5',
            border: 'var(--border-tactile)',
            boxShadow: 'var(--shadow-tactile)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem'
          }}>
            <CheckCircle2 size={38} color="#059669" />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>
            ¡Compra Finalizada con Éxito!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Tu orden ha sido registrada en el sistema de bodega de Ferretería Los Maestros.
          </p>

          <div style={{ marginTop: '1rem' }}>
            <span className="badge-tactile" style={{
              backgroundColor: 'var(--color-primary)',
              fontSize: '1.05rem',
              padding: '0.45rem 1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              N° DE ORDEN: {order.codigoOrden}
            </span>
          </div>
        </div>

        {/* NOTIFICACIÓN ESPECIAL PARA CONTRATISTAS */}
        {order.paymentMethod === 'CUENTA_CORRIENTE' && (
          <div className="alert-tactile alert-tactile-info" style={{ marginBottom: '1.75rem' }}>
            <CreditCard size={22} />
            <div>
              <strong>Pedido cargado a Cuenta Corriente Contratista:</strong> Este monto quedará consolidado en tu estado de cuenta a fin de mes. Te contactaremos cuando el camión de faena vaya en camino.
            </div>
          </div>
        )}

        {/* RESUMEN DE LA ORDEN EN BENTO */}
        <div style={{
          backgroundColor: 'var(--bg-surface-alt)',
          border: 'var(--border-tactile)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1rem', borderBottom: 'var(--border-sm)', paddingBottom: '0.5rem' }}>
            Detalles de Facturación y Entrega
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Cliente:</span>
              <strong>{order.customerName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Correo de Contacto:</span>
              <span>{order.customerEmail}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Fecha y Hora:</span>
              <span>{order.fechaLegible}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Modalidad de Entrega:</span>
              <strong style={{ color: 'var(--color-secondary)' }}>
                {order.deliveryType === 'DESPACHO_OBRA' ? 'Despacho a Obra' : 'Retiro en Tienda'}
              </strong>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Dirección / Destino:</span>
              <span>{order.address} ({order.commune})</span>
            </div>
          </div>

          {/* TABLA DE PRODUCTOS COMPRADOS */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Materiales Comprados
          </h4>
          <div className="table-container-tactile" style={{ marginBottom: '1rem', boxShadow: 'none' }}>
            <table className="table-tactile">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ textAlign: 'center' }}>Cantidad</th>
                  <th style={{ textAlign: 'right' }}>P. Unitario</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{it.nombre}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cód: {it.codigo}</div>
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {it.cantidad}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      ${it.precioUnitario.toLocaleString('es-CL')}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
                      ${it.subtotal.toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '1rem', paddingTop: '0.75rem', borderTop: 'var(--border-sm)' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>Monto Total Facturado:</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>
              ${order.totalMonto.toLocaleString('es-CL')}
            </span>
          </div>
        </div>

        {/* ACCIONES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-tactile"
          >
            <Printer size={18} /> Imprimir Comprobante de Compra
          </button>

          <Link to="/" className="btn-tactile btn-tactile-primary">
            Volver a la Tienda <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
