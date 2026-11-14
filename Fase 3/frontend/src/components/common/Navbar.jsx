import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Wrench, 
  ShieldCheck, 
  LogOut, 
  Tag
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isVendor, isAdmin, logout } = useAuth();
  const { totalCount, notification, clearNotification } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar-tactile">
        <div className="navbar-container">
          {/* LOGO CORPORATIVO BRUTALISTA */}
          <Link to="/" className="navbar-brand-tactile" onClick={closeMobileMenu}>
            <div className="navbar-brand-icon">
              <Wrench size={22} strokeWidth={2.5} />
            </div>
            <div className="navbar-brand-copy">
              <span className="navbar-brand-name">
                LOS MAESTROS
              </span>
              <span className="navbar-brand-location">
                FERRETERÍA &bull; LA SERENA
              </span>
            </div>
          </Link>

          {/* ENLACES ESCRITORIO */}
          <nav className="navbar-links-tactile" aria-label="Navegación principal">
            <NavLink to="/" className={({ isActive }) => `nav-link-tactile ${isActive ? 'active' : ''}`} end>
              Inicio
            </NavLink>
            <NavLink to="/productos" className={({ isActive }) => `nav-link-tactile ${isActive ? 'active' : ''}`}>
              Catálogo
            </NavLink>
            <NavLink to="/categorias" className={({ isActive }) => `nav-link-tactile ${isActive ? 'active' : ''}`}>
              Categorías
            </NavLink>
            <NavLink to="/ofertas" className={({ isActive }) => `nav-link-tactile ${isActive ? 'active' : ''}`}>
              <Tag size={15} />
              Ofertas
            </NavLink>
            <NavLink to="/nosotros" className={({ isActive }) => `nav-link-tactile ${isActive ? 'active' : ''}`}>
              Nosotros
            </NavLink>
            <NavLink to="/blogs" className={({ isActive }) => `nav-link-tactile ${isActive ? 'active' : ''}`}>
              Blogs
            </NavLink>
            <NavLink to="/contacto" className={({ isActive }) => `nav-link-tactile ${isActive ? 'active' : ''}`}>
              Contacto
            </NavLink>

          </nav>

          {/* ACCIONES Y CARRITO */}
          <div className="navbar-actions">
            {/* El acceso operativo acompaña a las acciones de la cuenta. */}
            {(isVendor || isAdmin) && (
              <NavLink to="/admin" className="btn-tactile btn-tactile-sm btn-tactile-primary navbar-admin-access">
                <ShieldCheck size={16} /> Panel Admin
              </NavLink>
            )}
            {isAuthenticated && <Link to="/mis-pedidos" className="btn-tactile btn-tactile-sm navbar-orders-link">Mis pedidos</Link>}
            {/* Botón Carrito */}
            <Link 
              to="/carrito" 
              className="btn-tactile btn-tactile-sm navbar-cart-link"
              aria-label={`Ver carrito de compras, ${totalCount} unidades`}
              title="Ver Carrito de Compras"
            >
              <ShoppingBag size={18} />
              <span className="cart-counter-badge" id="cart-counter-badge">
                {totalCount}
              </span>
            </Link>

            {/* Usuario autenticado o enlaces de login */}
            {isAuthenticated ? (
              <div className="user-desktop-box">
                <div className="navbar-user-meta">
                  <span className="navbar-user-name" title={user.nombre}>
                    {user.nombre}
                  </span>
                  <span className={`badge-tactile badge-role-${user.rol.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                    {user.rol}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn-tactile btn-tactile-sm btn-tactile-danger navbar-logout"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="user-desktop-box">
                <Link to="/login" className="btn-tactile btn-tactile-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn-tactile btn-tactile-sm btn-tactile-primary">
                  Registro
                </Link>
              </div>
            )}

            {/* Botón hamburguesa móvil */}
            <button 
              className="menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú móvil' : 'Abrir menú móvil'}
              aria-expanded={mobileMenuOpen}
              aria-controls="store-mobile-menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* DRAWER MÓVIL */}
        {mobileMenuOpen && (
          <nav id="store-mobile-menu" className="mobile-menu-drawer" aria-label="Navegación móvil">
            <NavLink to="/" onClick={closeMobileMenu} className="nav-link-tactile">
              Inicio
            </NavLink>
            <NavLink to="/productos" onClick={closeMobileMenu} className="nav-link-tactile">
              Catálogo de Productos
            </NavLink>
            <NavLink to="/categorias" onClick={closeMobileMenu} className="nav-link-tactile">
              Categorías
            </NavLink>
            <NavLink to="/ofertas" onClick={closeMobileMenu} className="nav-link-tactile">
              Ofertas y Descuentos
            </NavLink>
            <NavLink to="/nosotros" onClick={closeMobileMenu} className="nav-link-tactile">
              Sobre Nosotros
            </NavLink>
            <NavLink to="/blogs" onClick={closeMobileMenu} className="nav-link-tactile">
              Consejos de Obra
            </NavLink>
            <NavLink to="/contacto" onClick={closeMobileMenu} className="nav-link-tactile">
              Contacto y Cotizaciones
            </NavLink>

            {isAuthenticated && <NavLink to="/mis-pedidos" onClick={closeMobileMenu} className="nav-link-tactile">Mis pedidos</NavLink>}
            {/* Acceso a Panel Admin en Móvil */}
            {(isVendor || isAdmin) && (
              <NavLink 
                to="/admin" 
                onClick={closeMobileMenu} 
                className="btn-tactile btn-tactile-primary"
                style={{ marginTop: '0.5rem' }}
              >
                <ShieldCheck size={18} />
                Panel Administrativo ({user?.rol})
              </NavLink>
            )}

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: 'var(--border-sm)' }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{user.nombre} {user.apellidos}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email} &bull; {user.rol}</div>
                  </div>
                  <button onClick={handleLogout} className="btn-tactile btn-tactile-sm btn-tactile-danger">
                    Salir
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Link to="/login" onClick={closeMobileMenu} className="btn-tactile btn-tactile-block">
                    Ingresar
                  </Link>
                  <Link to="/registro" onClick={closeMobileMenu} className="btn-tactile btn-tactile-primary btn-tactile-block">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* NOTIFICACIÓN TÁCTIL FLOTANTE */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1100,
          maxWidth: '400px'
        }}>
          <div className={`alert-tactile alert-tactile-${notification.type}`} style={{ margin: 0 }}>
            <span style={{ flex: 1 }}>{notification.message}</span>
            <button 
              onClick={clearNotification}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900 }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

    </>
  );
};
