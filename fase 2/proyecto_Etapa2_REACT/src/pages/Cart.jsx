import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  CreditCard 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, totalCount, isEmpty } = useCart();
  const { isAuthenticated, isContractor, user } = useAuth();
  const navigate = useNavigate();

  if (isEmpty) {
    return (
      <div className="container page-container">
        <div className="bento-card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '650px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--bg-surface-alt)',
            border: 'var(--border-tactile)',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem'
          }}>
            <ShoppingBag size={32} color="var(--color-secondary)" />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>
            Tu Carrito de Compras está Vacío
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '1rem', lineHeight: 1.5 }}>
            Aún no has agregado materiales ni herramientas a tu pedido. Explora nuestro catálogo con existencias en mesón.
          </p>

          <Link to="/productos" className="btn-tactile btn-tactile-primary">
            <Package size={18} /> Explorar Catálogo de Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header">
        <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
          RESUMEN DE PEDIDO &bull; {totalCount} UNIDADES
        </span>
        <h1 className="section-title">
          <ShoppingBag size={30} /> Carrito de Compras
        </h1>
        <p className="section-subtitle">
          Revisa los materiales y cantidades antes de coordinar despacho a obra o retiro en tienda.
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* TABLA DE PRODUCTOS TÁCTIL */}
        <div>
          <div className="table-container-tactile">
            <table className="table-tactile" data-testid="cart-table">
              <thead>
                <tr>
                  <th>Material / Herramienta</th>
                  <th style={{ textAlign: 'right' }}>Precio Unitario</th>
                  <th style={{ textAlign: 'center' }}>Cantidad</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                  <th style={{ textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const unitPrice = item.enOferta && item.descuento > 0
                    ? Math.round(item.precio * (1 - item.descuento / 100))
                    : item.precio;
                  const subtotal = unitPrice * item.cantidad;

                  return (
                    <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={item.imagen || '/assets/img/productos/cemento.jpg'} 
                            alt={item.nombre}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1.5px solid #000', borderRadius: '4px' }}
                          />
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{item.nombre}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              CÓD: {item.codigo} &bull; {item.unidad}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                        ${unitPrice.toLocaleString('es-CL')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="btn-tactile btn-tactile-sm"
                            style={{ padding: '0.2rem 0.5rem', minWidth: '28px' }}
                            aria-label={`Disminuir cantidad de ${item.nombre}`}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="btn-tactile btn-tactile-sm"
                            style={{ padding: '0.2rem 0.5rem', minWidth: '28px' }}
                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--color-secondary)' }}>
                        ${subtotal.toLocaleString('es-CL')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="btn-tactile btn-tactile-sm btn-tactile-danger"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Eliminar del Carrito"
                          aria-label={`Eliminar ${item.nombre}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
            <Link to="/productos" className="btn-tactile btn-tactile-sm">
              <ArrowLeft size={16} /> Seguir Comprando
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="btn-tactile btn-tactile-sm btn-tactile-danger"
            >
              <Trash2 size={15} /> Vaciar Todo el Carrito
            </button>
          </div>
        </div>

        {/* RESUMEN TÁCTIL Y CHECKOUT */}
        <div className="bento-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: 'var(--border-sm)' }}>
            Resumen de Compra
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal ({totalCount} productos):</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>${totalPrice.toLocaleString('es-CL')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Despacho estimado:</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>
                {totalPrice >= 100000 ? '¡Gratis en La Serena!' : 'Calculado en Checkout'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Impuestos:</span>
              <span>19% IVA incluido</span>
            </div>
          </div>

          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-surface-alt)',
            border: 'var(--border-tactile)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
          }}>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>Total:</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>
              ${totalPrice.toLocaleString('es-CL')}
            </span>
          </div>

          {/* BENEFICIO CONTRATISTA */}
          {isAuthenticated && isContractor && (
            <div className="alert-tactile alert-tactile-info" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <CreditCard size={18} />
              <div>
                <strong>Línea de Crédito Activa:</strong> Puedes cargar este pedido a tu cuenta corriente mensual al pagar.
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn-tactile btn-tactile-primary btn-tactile-block"
            style={{ padding: '0.9rem', fontSize: '1.05rem' }}
            data-testid="proceed-checkout-btn"
          >
            Proceder al Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
