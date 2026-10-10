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
  User, 
  LogOut, 
  Tag, 
  Layers, 
  PhoneCall, 
  FileText 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isVendor, isAdmin, isContractor, logout } = useAuth();
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
          {/* LOGO BRUTALISTA */}
          <Link to="/" className="navbar-brand-tactile" onClick={closeMobileMenu}>
            <div style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-secondary)',
              border: '2px solid var(--border-color)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Wrench size={22} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                LOS MAESTROS
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '0.08em' }}>
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
              <Tag size={15} style={{ display: 'inline', marginRight: '4px' }} />
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

            {/* Acceso a panel administrativo si es VENDEDOR o ADMIN */}
            {(isVendor || isAdmin) && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => `btn-tactile btn-tactile-sm ${isActive ? 'btn-tactile-secondary' : 'btn-tactile-primary'}`}
                style={{ marginLeft: '0.5rem' }}
              >
                <ShieldCheck size={16} />
                Panel Admin
              </NavLink>
            )}
          </nav>

          {/* ACCIONES Y CARRITO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Botón Carrito */}
            <Link 
              to="/carrito" 
              className="btn-tactile btn-tactile-sm" 
              style={{ backgroundColor: 'var(--bg-surface)' }}
              title="Ver Carrito de Compras"
            >
              <ShoppingBag size={18} />
              <span className="cart-counter-badge" id="cart-counter-badge">
                {totalCount}
              </span>
            </Link>

            {/* Usuario autenticado o enlaces de login */}
            {isAuthenticated ? (
              <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="user-desktop-box">
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  lineHeight: 1.1
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                    {user.nombre}
                  </span>
                  <span className={`badge-tactile badge-role-${user.rol.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                    {user.rol}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn-tactile btn-tactile-sm btn-tactile-danger"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="user-desktop-box">
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
              aria-label="Abrir menú móvil"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* DRAWER MÓVIL */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
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
          </div>
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

      {/* Media query complementaria para mostrar usuario en desktop */}
      <style>{`
        @media (min-width: 1024px) {
          .user-desktop-box {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
