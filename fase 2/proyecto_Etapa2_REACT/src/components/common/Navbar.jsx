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
  FileText,
  Lock,
  Mail,
  Key,
  AlertCircle,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isVendor, isAdmin, isContractor, login, logout } = useAuth();
  const { totalCount, notification, clearNotification } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openAdminModal = () => {
    setAdminLoginError('');
    setAdminEmail('admin@duoc.cl');
    setAdminPassword('admin123');
    setAdminModalOpen(true);
    setMobileMenuOpen(false);
  };

  const closeAdminModal = () => {
    setAdminModalOpen(false);
    setAdminLoginError('');
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setAdminLoginError('');

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminLoginError('Por favor ingresa correo y contraseña.');
      return;
    }

    const res = login(adminEmail, adminPassword);
    if (res.success) {
      if (res.user.rol === 'ADMIN' || res.user.rol === 'VENDEDOR') {
        setAdminModalOpen(false);
        navigate('/admin');
      } else {
        setAdminLoginError('Esta cuenta no tiene permisos de Administrador o Vendedor.');
      }
    } else {
      setAdminLoginError(res.error || 'Credenciales incorrectas.');
    }
  };

  const handleQuickDemoLogin = (email, pass) => {
    setAdminLoginError('');
    const res = login(email, pass);
    if (res.success) {
      setAdminModalOpen(false);
      navigate('/admin');
    } else {
      setAdminLoginError(res.error || 'Error al iniciar sesión.');
    }
  };

  return (
    <>
      <header className="navbar-tactile">
        <div className="navbar-container">
          {/* LOGO CORPORATIVO BRUTALISTA */}
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

            {/* Acceso a panel administrativo si es VENDEDOR o ADMIN (cumple Navbar.test.jsx) */}
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
            {/* BOTÓN APARTADO EN EL HEADER PARA ACCEDER A ADMINISTRACIÓN CON LOGIN */}
            {!isAdmin && !isVendor && (
              <button 
                type="button"
                onClick={openAdminModal}
                className="header-admin-pill"
                title="Acceso al Panel de Administración"
                aria-label="Acceder a Administración"
              >
                <ShieldCheck size={16} />
                <span>Administración</span>
                <span className="header-admin-tag">LOGIN</span>
              </button>
            )}

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

            {/* Acceso a Panel Admin en Móvil */}
            {(isVendor || isAdmin) ? (
              <NavLink 
                to="/admin" 
                onClick={closeMobileMenu} 
                className="btn-tactile btn-tactile-primary"
                style={{ marginTop: '0.5rem' }}
              >
                <ShieldCheck size={18} />
                Panel Administrativo ({user?.rol})
              </NavLink>
            ) : (
              <button 
                type="button" 
                onClick={openAdminModal} 
                className="btn-tactile btn-tactile-secondary"
                style={{ marginTop: '0.5rem', justifyContent: 'center' }}
              >
                <ShieldCheck size={18} />
                Acceso Administración (Login)
              </button>
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

      {/* MODAL TÁCTIL DE ACCESO ADMINISTRATIVO CON LOGIN INTEGRADO */}
      {adminModalOpen && (
        <div className="admin-login-modal-overlay" onClick={closeAdminModal}>
          <div className="admin-login-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className="admin-login-modal-close" 
              onClick={closeAdminModal}
              aria-label="Cerrar modal"
            >
              <X size={22} />
            </button>

            <div className="admin-login-modal-header">
              <span className="admin-login-badge">
                <ShieldCheck size={14} /> Ferretería Los Maestros
              </span>
              <h2 className="admin-login-title">Acceso Administración</h2>
              <p className="admin-login-desc">
                Ingresa tus credenciales de operador para acceder al panel de control, inventario y órdenes.
              </p>
            </div>

            {adminLoginError && (
              <div className="alert-tactile alert-tactile-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{adminLoginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="label-tactile" style={{ fontSize: '0.85rem' }}>
                  Correo Operativo
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email"
                    className="input-tactile"
                    placeholder="admin@duoc.cl"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    style={{ paddingLeft: '2.4rem', fontSize: '0.9rem' }}
                    required
                  />
                  <Mail 
                    size={16} 
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="label-tactile" style={{ fontSize: '0.85rem' }}>
                  Contraseña de Seguridad
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password"
                    className="input-tactile"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{ paddingLeft: '2.4rem', fontSize: '0.9rem' }}
                    required
                  />
                  <Key 
                    size={16} 
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-tactile btn-tactile-secondary btn-tactile-block"
                style={{ padding: '0.75rem', fontWeight: 900 }}
              >
                <Lock size={16} /> Ingresar al Panel de Operaciones
              </button>
            </form>

            {/* ACCESOS RÁPIDOS 1-CLIC PARA EVALUACIÓN DOCENTE */}
            <div className="admin-demo-grid">
              <button 
                type="button" 
                onClick={() => handleQuickDemoLogin('admin@duoc.cl', 'admin123')}
                className="btn-demo-quick btn-demo-quick-admin"
                title="Acceder como Administrador Don Carlos Vega"
              >
                <ShieldCheck size={18} />
                <span>Don Carlos Vega</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>Rol: Administrador</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleQuickDemoLogin('vendedor@duoc.cl', 'vend123')}
                className="btn-demo-quick"
                title="Acceder como Vendedor Ricardo Valdés"
              >
                <UserCheck size={18} />
                <span>Ricardo Valdés</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>Rol: Vendedor Mesón</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
