import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { chileLocations } from '../data/chileLocations';

export const Checkout = () => {
  const { cartItems, totalPrice, totalCount, clearCart, isEmpty } = useCart();
  const { user, isAuthenticated, isContractor, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Redirigir al carrito si está vacío
  useEffect(() => {
    if (isEmpty) {
      navigate('/carrito');
    }
  }, [isEmpty, navigate]);

  // Datos del formulario de Checkout (con autofill si está autenticado)
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [deliveryType, setDeliveryType] = useState('DESPACHO_OBRA'); // DESPACHO_OBRA o RETIRO_TIENDA
  const [region, setRegion] = useState('Región de Coquimbo');
  const [commune, setCommune] = useState('La Serena');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(isContractor ? 'CUENTA_CORRIENTE' : 'WEBPAY_SIMULADO');
  const [simulateError, setSimulateError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-llenado si el usuario ha iniciado sesión
  useEffect(() => {
    if (user) {
      setCustomerName(`${user.nombre} ${user.apellidos}`.trim());
      setCustomerEmail(user.email || '');
      setAddress(user.direccion || '');
      if (user.region) setRegion(user.region);
      if (user.comuna) setCommune(user.comuna);
      if (user.empresa) setEmpresa(user.empresa);
      if (user.rol === 'CONTRATISTA') {
        setPaymentMethod('CUENTA_CORRIENTE');
      }
    }
  }, [user]);

  // Costo de despacho
  const shippingFee = deliveryType === 'RETIRO_TIENDA' 
    ? 0 
    : (totalPrice >= 100000 ? 0 : 4990);

  const grandTotal = totalPrice + shippingFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validaciones básicas
    if (!customerName.trim()) {
      setErrorMsg('El nombre completo es obligatorio.');
      return;
    }

    if (!customerEmail.trim() || !userService.validateEmail(customerEmail)) {
      setErrorMsg('Debes ingresar un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).');
      return;
    }

    if (deliveryType === 'DESPACHO_OBRA' && !address.trim()) {
      setErrorMsg('La dirección de despacho o faena es obligatoria.');
      return;
    }

    // Si el usuario marcó simular fallo de pago (requerimiento EV2 para probar compra fallida)
    if (simulateError) {
      navigate('/compra-fallida', {
        state: {
          motivo: 'Rechazo simulado por entidad bancaria o límite excedido en línea de crédito.',
          total: grandTotal
        }
      });
      return;
    }

    setLoading(true);

    try {
      const order = orderService.createOrder({
        userId: user?.id || null,
        customerName,
        customerEmail,
        customerRole: user?.rol || 'CLIENTE',
        items: cartItems,
        deliveryType,
        address,
        commune,
        paymentMethod,
        notes
      });

      // Limpiar carrito y refrescar usuario
      clearCart();
      refreshUser();

      // Navegar a vista de compra exitosa
      navigate(`/compra-exitosa/${order.id}`, { state: { order } });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableComunas = chileLocations[region] || [];

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header">
        <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
          PASO FINAL DE COMPRA
        </span>
        <h1 className="section-title">
          <CreditCard size={30} /> Checkout y Coordinación de Entrega
        </h1>
        <p className="section-subtitle">
          {isAuthenticated 
            ? `Datos autocompletados con tu cuenta (${user.nombre} &bull; ${user.rol})`
            : 'Completa tus datos de entrega y selecciona tu método de pago.'}
        </p>
      </div>

      {errorMsg && (
        <div className="alert-tactile alert-tactile-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="checkout-form">
        <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* COLUMNA IZQUIERDA: FORMULARIOS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. DATOS DEL CLIENTE / CONTRATISTA */}
            <div className="bento-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div className="bento-icon-badge">
                  <Building2 size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                  1. Información del Cliente / Empresa
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="chk-name" className="label-tactile">Nombre Completo *</label>
                  <input
                    id="chk-name"
                    type="text"
                    className="input-tactile"
                    placeholder="Ej. Juan Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="chk-email" className="label-tactile">Correo Electrónico *</label>
                  <input
                    id="chk-email"
                    type="email"
                    className="input-tactile"
                    placeholder="usuario@duoc.cl"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="chk-phone" className="label-tactile">Teléfono de Coordinación</label>
                  <input
                    id="chk-phone"
                    type="tel"
                    className="input-tactile"
                    placeholder="+56 9 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="chk-empresa" className="label-tactile">Constructora / Faena (Opcional)</label>
                  <input
                    id="chk-empresa"
                    type="text"
                    className="input-tactile"
                    placeholder="Ej. Constructora Elqui"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 2. OPCIÓN DE ENTREGA */}
            <div className="bento-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div className="bento-icon-badge">
                  <Truck size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                  2. Opciones de Entrega y Ubicación de Obra
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '1rem',
                  border: 'var(--border-tactile)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: deliveryType === 'DESPACHO_OBRA' ? 'var(--color-primary)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  fontWeight: 800
                }}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="DESPACHO_OBRA"
                    checked={deliveryType === 'DESPACHO_OBRA'}
                    onChange={() => setDeliveryType('DESPACHO_OBRA')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div>Despacho a Faena / Domicilio</div>
                    <small style={{ fontWeight: 600, color: '#334155' }}>
                      {totalPrice >= 100000 ? '¡Gratis sobre $100.000!' : '$4.990 en La Serena / Coquimbo'}
                    </small>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '1rem',
                  border: 'var(--border-tactile)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: deliveryType === 'RETIRO_TIENDA' ? 'var(--color-primary)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  fontWeight: 800
                }}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="RETIRO_TIENDA"
                    checked={deliveryType === 'RETIRO_TIENDA'}
                    onChange={() => setDeliveryType('RETIRO_TIENDA')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div>Retiro en Mesón Central</div>
                    <small style={{ fontWeight: 600, color: '#334155' }}>
                      Gratis - Av. Balmaceda 1420
                    </small>
                  </div>
                </label>
              </div>

              {deliveryType === 'DESPACHO_OBRA' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="chk-region" className="label-tactile">Región *</label>
                      <select
                        id="chk-region"
                        className="select-tactile"
                        value={region}
                        onChange={(e) => {
                          setRegion(e.target.value);
                          const comms = chileLocations[e.target.value] || [];
                          setCommune(comms[0] || '');
                        }}
                      >
                        {Object.keys(chileLocations).map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="chk-commune" className="label-tactile">Comuna *</label>
                      <select
                        id="chk-commune"
                        className="select-tactile"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                      >
                        {availableComunas.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="chk-address" className="label-tactile">Dirección de Entrega / Faena *</label>
                    <input
                      id="chk-address"
                      type="text"
                      className="input-tactile"
                      placeholder="Calle, Número, Lote de faena o referencia viales"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="chk-notes" className="label-tactile">Indicaciones de Descarga / Camión Pluma (Opcional)</label>
                <textarea
                  id="chk-notes"
                  className="textarea-tactile"
                  rows={2}
                  placeholder="Ej. Entrada por portón metálico, descarga sobre radier, horario de recepción faena..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* 3. FORMA DE PAGO */}
            <div className="bento-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div className="bento-icon-badge">
                  <CreditCard size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                  3. Selección de Medio de Pago
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* OPCIÓN CUENTA CORRIENTE CONTRATISTA */}
                {isAuthenticated && isContractor && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1.25rem',
                    border: 'var(--border-tactile)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: paymentMethod === 'CUENTA_CORRIENTE' ? 'var(--color-contractor)' : 'var(--bg-surface)',
                    color: paymentMethod === 'CUENTA_CORRIENTE' ? '#ffffff' : 'inherit',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CUENTA_CORRIENTE"
                      checked={paymentMethod === 'CUENTA_CORRIENTE'}
                      onChange={() => setPaymentMethod('CUENTA_CORRIENTE')}
                      style={{ width: '20px', height: '20px', marginTop: '3px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>
                        💳 Cuenta Corriente para Contratistas (Pago a Fin de Mes)
                      </div>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', opacity: 0.95 }}>
                        Cargar este pedido a tu línea de crédito. Línea máxima: ${user.creditoMaximo?.toLocaleString('es-CL')} &bull; Saldo pendiente actual: ${user.saldoPendiente?.toLocaleString('es-CL')}.
                      </p>
                    </div>
                  </label>
                )}

                {/* WEBPAY SIMULADO */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  border: 'var(--border-tactile)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: paymentMethod === 'WEBPAY_SIMULADO' ? 'var(--color-primary)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  fontWeight: 800
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="WEBPAY_SIMULADO"
                    checked={paymentMethod === 'WEBPAY_SIMULADO'}
                    onChange={() => setPaymentMethod('WEBPAY_SIMULADO')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Webpay Plus / Débito / Crédito (Simulación inmediata)</span>
                </label>

                {/* TRANSFERENCIA BANCARIA */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  border: 'var(--border-tactile)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: paymentMethod === 'TRANSFERENCIA' ? 'var(--color-primary)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  fontWeight: 800
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="TRANSFERENCIA"
                    checked={paymentMethod === 'TRANSFERENCIA'}
                    onChange={() => setPaymentMethod('TRANSFERENCIA')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Transferencia Electrónica Directa</span>
                </label>
              </div>

              {/* SIMULACIÓN DE ERROR PARA CASOS DE PRUEBA EVALUACIÓN 2 */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: 'var(--border-sm)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                  <input
                    type="checkbox"
                    checked={simulateError}
                    onChange={(e) => setSimulateError(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-danger)' }}
                  />
                  <span>[Evaluación 2] Simular fallo en el pago para verificar pantalla "Compra Fallida"</span>
                </label>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE LA ORDEN */}
          <div className="bento-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: 'var(--border-sm)' }}>
              Detalle del Pedido
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', gap: '0.5rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem' }}>
                  <div>
                    <strong>{item.cantidad}x</strong> {item.nombre}
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.unidad} &bull; Cód: {item.codigo}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, whiteSpace: 'nowrap' }}>
                    ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>${totalPrice.toLocaleString('es-CL')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Flete / Despacho:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: shippingFee === 0 ? '#059669' : 'inherit' }}>
                  {shippingFee === 0 ? 'GRATIS' : `$${shippingFee.toLocaleString('es-CL')}`}
                </span>
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
              <span style={{ fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase' }}>Total a Pagar:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>
                ${grandTotal.toLocaleString('es-CL')}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-tactile btn-tactile-primary btn-tactile-block"
              style={{ padding: '0.9rem', fontSize: '1.05rem' }}
              data-testid="confirm-order-btn"
            >
              {loading ? 'Procesando Pedido...' : (
                paymentMethod === 'CUENTA_CORRIENTE' 
                  ? 'Confirmar Pedido a Cuenta Corriente' 
                  : 'Confirmar y Pagar Pedido'
              )}
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/carrito" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>
                &larr; Volver a modificar carrito
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
