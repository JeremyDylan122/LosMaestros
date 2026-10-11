import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  AlertOctagon, 
  ShoppingBag, 
  Users, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user, isAdmin, isVendor } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [criticalProducts, setCriticalProducts] = useState([]);

  useEffect(() => {
    const prods = productService.getProducts();
    const ords = orderService.getOrders();
    const usrs = userService.getUsers();

    setProducts(prods);
    setOrders(ords);
    setUsers(usrs);
    setCriticalProducts(productService.getCriticalStockProducts());
  }, []);

  return (
    <div className="container page-container">
      {/* CABECERA PANEL ADMINISTRATIVO */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge-tactile badge-role-admin">
              <ShieldCheck size={14} /> PANEL DE CONTROL DE GESTIÓN
            </span>
            <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)' }}>
              ROL: {user?.rol}
            </span>
          </div>
          <h1 className="section-title">
            Panel de Operaciones &bull; Ferretería Los Maestros
          </h1>
          <p className="section-subtitle">
            Bienvenido, {user?.nombre} {user?.apellidos}. Control de inventario en tiempo real, usuarios y despachos a obra.
          </p>
        </div>

        {/* ACCESOS DIRECTOS */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/admin/productos" className="btn-tactile btn-tactile-primary btn-tactile-sm">
            <Package size={16} /> Mantenedor Productos
          </Link>
          <Link to="/admin/pedidos" className="btn-tactile btn-tactile-sm">
            <ShoppingBag size={16} /> Ver Órdenes ({orders.length})
          </Link>
          {isAdmin && (
            <Link to="/admin/usuarios" className="btn-tactile btn-tactile-secondary btn-tactile-sm">
              <Users size={16} /> Mantenedor Usuarios
            </Link>
          )}
        </div>
      </div>

      {/* METRICAS CLAVE EN BENTO GRID */}
      <div className="bento-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
        {/* Métrica 1: Total Productos */}
        <div className="bento-card bento-card-primary">
          <div className="bento-header">
            <span className="badge-tactile" style={{ backgroundColor: 'var(--color-secondary)', color: '#ffffff' }}>
              INVENTARIO
            </span>
            <div className="bento-icon-badge">
              <Package size={22} color="var(--color-secondary)" />
            </div>
          </div>
          <div className="bento-content">
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
              {products.length}
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Productos Activos en Catálogo
            </div>
          </div>
          <div className="bento-footer">
            <Link to="/admin/productos" style={{ fontSize: '0.85rem', fontWeight: 800, textDecoration: 'underline' }}>
              Administrar productos &rarr;
            </Link>
          </div>
        </div>

        {/* Métrica 2: Alertas de Stock Crítico */}
        <div className="bento-card" style={{ borderColor: criticalProducts.length > 0 ? '#ef4444' : 'var(--border-color)', backgroundColor: criticalProducts.length > 0 ? '#fef2f2' : 'var(--bg-surface)' }}>
          <div className="bento-header">
            <span className="badge-tactile badge-stock-critical">
              <AlertOctagon size={13} /> ALERTA REPOSICIÓN
            </span>
            <div className="bento-icon-badge" style={{ backgroundColor: '#fee2e2', borderColor: '#ef4444' }}>
              <AlertOctagon size={22} color="#dc2626" />
            </div>
          </div>
          <div className="bento-content">
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#dc2626' }}>
              {criticalProducts.length}
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#991b1b' }}>
              Artículos en Stock Crítico
            </div>
          </div>
          <div className="bento-footer">
            <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 700 }}>
              {criticalProducts.length > 0 ? 'Requiere orden de compra a proveedores' : 'Niveles de stock óptimos'}
            </span>
          </div>
        </div>

        {/* Métrica 3: Pedidos Registrados */}
        <div className="bento-card bento-card-contractor">
          <div className="bento-header">
            <span className="badge-tactile" style={{ backgroundColor: 'var(--color-contractor)', color: '#ffffff' }}>
              VENTAS &bull; FAENA
            </span>
            <div className="bento-icon-badge">
              <ShoppingBag size={22} color="var(--color-contractor)" />
            </div>
          </div>
          <div className="bento-content">
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>
              {orders.length}
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Órdenes de Compra Totales
            </div>
          </div>
          <div className="bento-footer">
            <Link to="/admin/pedidos" style={{ fontSize: '0.85rem', fontWeight: 800, textDecoration: 'underline' }}>
              Ver listado de pedidos &rarr;
            </Link>
          </div>
        </div>

        {/* Métrica 4: Usuarios del Sistema */}
        <div className="bento-card">
          <div className="bento-header">
            <span className="badge-tactile" style={{ backgroundColor: 'var(--color-secondary)', color: '#ffffff' }}>
              USUARIOS RBAC
            </span>
            <div className="bento-icon-badge">
              <Users size={22} color="var(--color-secondary)" />
            </div>
          </div>
          <div className="bento-content">
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
              {users.length}
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Cuentas Registradas
            </div>
          </div>
          <div className="bento-footer">
            {isAdmin ? (
              <Link to="/admin/usuarios" style={{ fontSize: '0.85rem', fontWeight: 800, textDecoration: 'underline' }}>
                Gestionar roles &rarr;
              </Link>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Solo lectura (Vendedor)</span>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN DE ALERTA: PRODUCTOS CON STOCK CRÍTICO */}
      {criticalProducts.length > 0 && (
        <section style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="bento-card" style={{ borderColor: '#ef4444', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertOctagon size={22} color="#dc2626" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#991b1b' }}>
                  Atención Inmediata: Productos que Alcanzaron el Umbral de Reposición
                </h3>
              </div>
              <Link to="/admin/productos" className="btn-tactile btn-tactile-sm btn-tactile-danger">
                Actualizar Stock en Mantenedor &rarr;
              </Link>
            </div>

            <div className="table-container-tactile" style={{ boxShadow: 'none' }}>
              <table className="table-tactile">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th style={{ textAlign: 'center' }}>Stock Actual</th>
                    <th style={{ textAlign: 'center' }}>Stock Mínimo</th>
                    <th style={{ textAlign: 'center' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalProducts.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{p.codigo}</td>
                      <td><strong>{p.nombre}</strong></td>
                      <td>{p.categoria}</td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#dc2626' }}>
                        {p.stock} {p.unidad}s
                      </td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {p.stockMinimo} {p.unidad}s
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge-tactile badge-stock-critical">
                          {p.stock === 0 ? 'AGOTADO' : 'STOCK CRÍTICO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ÚLTIMAS ÓRDENES EMITIDAS */}
      <section>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="section-title" style={{ fontSize: '1.4rem' }}>
            Últimos Pedidos Registrados
          </h3>
          <Link to="/admin/pedidos" className="btn-tactile btn-tactile-sm">
            Ver Todas las Órdenes &rarr;
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="table-container-tactile">
            <table className="table-tactile">
              <thead>
                <tr>
                  <th>N° Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Modalidad</th>
                  <th>Medio de Pago</th>
                  <th style={{ textAlign: 'right' }}>Monto Total</th>
                  <th style={{ textAlign: 'center' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{o.codigoOrden}</td>
                    <td style={{ fontSize: '0.85rem' }}>{o.fechaLegible}</td>
                    <td>
                      <strong>{o.customerName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                    </td>
                    <td>{o.deliveryType === 'DESPACHO_OBRA' ? 'Despacho Obra' : 'Retiro Tienda'}</td>
                    <td>
                      <span className="badge-tactile" style={{
                        backgroundColor: o.paymentMethod === 'CUENTA_CORRIENTE' ? 'var(--color-contractor)' : '#e2e8f0',
                        color: o.paymentMethod === 'CUENTA_CORRIENTE' ? '#ffffff' : 'inherit'
                      }}>
                        {o.paymentMethod === 'CUENTA_CORRIENTE' ? 'Cta. Corriente' : 'Webpay'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
                      ${o.totalMonto.toLocaleString('es-CL')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-tactile badge-stock-ok">
                        {o.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bento-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No hay órdenes registradas aún.</p>
          </div>
        )}
      </section>
    </div>
  );
};
