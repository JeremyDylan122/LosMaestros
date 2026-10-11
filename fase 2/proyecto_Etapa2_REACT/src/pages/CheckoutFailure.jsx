import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { XCircle, RotateCcw, ShoppingBag, PhoneCall, ArrowLeft } from 'lucide-react';

export const CheckoutFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const motivo = location.state?.motivo || 'La entidad bancaria o la pasarela de pagos rechazó la transacción.';
  const total = location.state?.total || null;

  return (
    <div className="container page-container" style={{ maxWidth: '680px' }}>
      <div className="bento-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        {/* ICONO DE ERROR */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          backgroundColor: '#fee2e2',
          border: 'var(--border-tactile)',
          boxShadow: 'var(--shadow-tactile)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem'
        }}>
          <XCircle size={42} color="#dc2626" />
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--color-secondary)' }}>
          No se pudo realizar el pago
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          {motivo} Tu orden no ha sido procesada y no se han descontado fondos ni existencias de inventario.
        </p>

        {total && (
          <div style={{
            display: 'inline-block',
            backgroundColor: 'var(--bg-surface-alt)',
            border: 'var(--border-tactile)',
            padding: '0.5rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            marginBottom: '1.75rem'
          }}>
            Monto de la transacción: ${total.toLocaleString('es-CL')}
          </div>
        )}

        {/* SUGERENCIAS DE RESOLUCIÓN */}
        <div style={{
          textAlign: 'left',
          backgroundColor: '#fef2f2',
          border: 'var(--border-sm)',
          borderColor: '#ef4444',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#991b1b' }}>
            Posibles soluciones:
          </strong>
          <ul style={{ paddingLeft: '1.25rem', color: '#7f1d1d', lineHeight: 1.6 }}>
            <li>Verifica si cuentas con saldo suficiente en tu tarjeta o línea de crédito contratista.</li>
            <li>Revisa que los datos de facturación coincidan con tu banco emisor.</li>
            <li>Prueba seleccionando otro método de pago (Transferencia o Pago al Retiro).</li>
          </ul>
        </div>

        {/* ACCIONES TÁCTILES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn-tactile btn-tactile-primary"
          >
            <RotateCcw size={16} /> Reintentar Pago
          </button>

          <Link to="/carrito" className="btn-tactile">
            <ShoppingBag size={16} /> Modificar Carrito
          </Link>

          <Link to="/contacto" className="btn-tactile btn-tactile-sm">
            <PhoneCall size={16} /> Contactar a Mesón
          </Link>
        </div>
      </div>
    </div>
  );
};
