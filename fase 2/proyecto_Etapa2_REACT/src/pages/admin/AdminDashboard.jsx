import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  AlertOctagon, 
  ShoppingBag, 
  Users, 
  Layers, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  Save, 
  AlertCircle, 
  Eye, 
  LogOut, 
  Home, 
  Menu, 
  ArrowLeft,
  DollarSign,
  FileText,
  CreditCard,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Tag,
  Wrench,
  Check
} from 'lucide-react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { chileLocations } from '../../data/chileLocations';

export const AdminDashboard = () => {
  const { user, isAdmin, isVendor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar la pestaña activa según la URL o estado interno
  const getTabFromPath = () => {
    if (location.pathname.includes('/productos')) return 'productos';
    if (location.pathname.includes('/pedidos')) return 'pedidos';
    if (location.pathname.includes('/usuarios')) return 'usuarios';
    if (location.pathname.includes('/categorias')) return 'categorias';
    return 'resumen';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estados de datos sincronizados con persistencia
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [criticalProducts, setCriticalProducts] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Estados de búsqueda y filtros
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productCriticalOnly, setProductCriticalOnly] = useState(false);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [userSearch, setUserSearch] = useState('');

  // Modales
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Formularios
  const initialProductForm = {
    codigo: '',
    nombre: '',
    categoria: 'Materiales de Construcción',
    subcategoria: '',
    marca: '',
    unidad: 'Unidad',
    precio: '',
    precioCompra: '',
    stock: '',
    stockMinimo: '',
    enOferta: false,
    descuento: 0,
    descripcion: '',
    imagen: '/assets/img/productos/cemento.jpg',
    especificaciones: ''
  };

  const initialUserForm = {
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    direccion: '',
    empresa: '',
    cuentaCorrienteActiva: false,
    creditoMaximo: 2000000,
    saldoPendiente: 0
  };

  const [productFormData, setProductFormData] = useState(initialProductForm);
  const [productFormErrors, setProductFormErrors] = useState({});

  const [userFormData, setUserFormData] = useState(initialUserForm);
  const [userFormErrors, setUserFormErrors] = useState({});

  // Cargar datos
  const reloadAllData = () => {
    const prods = productService.getProducts();
    const ords = orderService.getOrders();
    const usrs = userService.getUsers();

    setProducts(prods);
    setOrders(ords);
    setUsers(usrs);
    setCriticalProducts(productService.getCriticalStockProducts());
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  // Sincronizar activeTab cuando cambia la URL
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (tab === 'resumen') navigate('/admin');
    else navigate(`/admin/${tab}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- ACCIONES RÁPIDAS DE STOCK ---
  const handleQuickStockAdjust = (productId, delta) => {
    try {
      const prod = productService.getProductById(productId);
      if (!prod) return;
      const newStock = Math.max(0, prod.stock + delta);
      productService.updateProduct(productId, { stock: newStock });
      reloadAllData();
      showFeedback(`Stock de "${prod.nombre}" actualizado a ${newStock} unidades.`);
    } catch (e) {
      showFeedback(e.message, 'danger');
    }
  };

  // --- CRUD PRODUCTOS ---
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductFormData(initialProductForm);
    setProductFormErrors({});
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductFormData({
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      subcategoria: p.subcategoria || '',
      marca: p.marca || '',
      unidad: p.unidad || 'Unidad',
      precio: p.precio,
      precioCompra: p.precioCompra || '',
      stock: p.stock,
      stockMinimo: p.stockMinimo || 0,
      enOferta: Boolean(p.enOferta),
      descuento: p.descuento || 0,
      descripcion: p.descripcion || '',
      imagen: p.imagen || '/assets/img/productos/cemento.jpg',
      especificaciones: p.especificaciones || ''
    });
    setProductFormErrors({});
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${nombre}"?`)) {
      try {
        productService.deleteProduct(id);
        reloadAllData();
        showFeedback(`Producto "${nombre}" eliminado correctamente.`);
      } catch (e) {
        showFeedback(e.message, 'danger');
      }
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const errs = {};
    if (!productFormData.codigo.trim()) errs.codigo = 'El código SKU es obligatorio.';
    if (!productFormData.nombre.trim()) errs.nombre = 'El nombre del producto es obligatorio.';
    if (!productFormData.precio || Number(productFormData.precio) <= 0) errs.precio = 'El precio debe ser mayor a 0.';
    if (productFormData.stock === '' || Number(productFormData.stock) < 0) errs.stock = 'El stock no puede ser negativo.';

    if (Object.keys(errs).length > 0) {
      setProductFormErrors(errs);
      return;
    }

    try {
      if (editingProduct) {
        productService.updateProduct(editingProduct.id, productFormData);
        showFeedback(`Producto "${productFormData.nombre}" actualizado con éxito.`);
      } else {
        productService.createProduct(productFormData);
        showFeedback(`Producto "${productFormData.nombre}" creado exitosamente.`);
      }
      setProductModalOpen(false);
      reloadAllData();
    } catch (err) {
      showFeedback(err.message, 'danger');
    }
  };

  // --- GESTIÓN PEDIDOS ---
  const handleOrderStatusChange = (orderId, newStatus) => {
    try {
      orderService.updateOrderStatus(orderId, newStatus);
      reloadAllData();
      if (selectedOrder && Number(selectedOrder.id) === Number(orderId)) {
        setSelectedOrder(prev => ({ ...prev, estado: newStatus }));
      }
      showFeedback(`Estado del pedido actualizado a "${newStatus}".`);
    } catch (e) {
      showFeedback(e.message, 'danger');
    }
  };

  // --- CRUD USUARIOS ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData(initialUserForm);
    setUserFormErrors({});
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUserFormData({
      run: u.run,
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      password: u.password,
      rol: u.rol,
      region: u.region || 'Región de Coquimbo',
      comuna: u.comuna || 'La Serena',
      direccion: u.direccion || '',
      empresa: u.empresa || '',
      cuentaCorrienteActiva: Boolean(u.cuentaCorrienteActiva),
      creditoMaximo: u.creditoMaximo || 2000000,
      saldoPendiente: u.saldoPendiente || 0
    });
    setUserFormErrors({});
    setUserModalOpen(true);
  };

  const handleUserRoleChange = (userId, newRole) => {
    try {
      userService.updateUser(userId, { rol: newRole });
      reloadAllData();
      showFeedback(`Rol de usuario actualizado a "${newRole}".`);
    } catch (e) {
      showFeedback(e.message, 'danger');
    }
  };

  const handleDeleteUser = (id, nombre) => {
    if (Number(id) === Number(user?.id)) {
      alert('No puedes eliminar tu propia cuenta en sesión activa.');
      return;
    }
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"?`)) {
      try {
        userService.deleteUser(id);
        reloadAllData();
        showFeedback(`Usuario "${nombre}" eliminado correctamente.`);
      } catch (e) {
        showFeedback(e.message, 'danger');
      }
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const errs = {};
    if (!userFormData.run.trim()) errs.run = 'El RUN es obligatorio.';
    else if (!userService.validateRun(userFormData.run)) errs.run = 'El RUN ingresado no es válido según algoritmo Módulo 11.';

    if (!userFormData.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!userFormData.apellidos.trim()) errs.apellidos = 'Los apellidos son obligatorios.';
    if (!userFormData.email.trim()) errs.email = 'El correo es obligatorio.';
    else if (!userService.validateEmail(userFormData.email)) errs.email = 'El correo debe ser institucional (@duoc.cl, @profesor.duoc.cl o @gmail.com).';

    if (!editingUser && (!userFormData.password || userFormData.password.length < 4)) {
      errs.password = 'La contraseña debe tener al menos 4 caracteres.';
    }

    if (Object.keys(errs).length > 0) {
      setUserFormErrors(errs);
      return;
    }

    try {
      if (editingUser) {
        userService.updateUser(editingUser.id, userFormData);
        showFeedback(`Usuario "${userFormData.nombre}" actualizado con éxito.`);
      } else {
        userService.createUser(userFormData);
        showFeedback(`Usuario "${userFormData.nombre}" registrado exitosamente.`);
      }
      setUserModalOpen(false);
      reloadAllData();
    } catch (err) {
      showFeedback(err.message, 'danger');
    }
  };

  // Filtrado de Productos para Mantenedor
  const filteredProducts = products.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.codigo.toLowerCase().includes(productSearch.toLowerCase()) ||
                        (p.marca && p.marca.toLowerCase().includes(productSearch.toLowerCase()));
    const matchCategory = productCategoryFilter === 'ALL' || p.categoria === productCategoryFilter;
    const matchCritical = !productCriticalOnly || p.stock <= p.stockMinimo;
    return matchSearch && matchCategory && matchCritical;
  });

  // Filtrado de Pedidos
  const filteredOrders = orders.filter(o => {
    const matchStatus = orderStatusFilter === 'ALL' || o.estado === orderStatusFilter;
    const matchSearch = o.codigoOrden.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Filtrado de Usuarios
  const filteredUsers = users.filter(u => {
    const term = userSearch.toLowerCase();
    return u.nombre.toLowerCase().includes(term) ||
           u.apellidos.toLowerCase().includes(term) ||
           u.email.toLowerCase().includes(term) ||
           u.run.toLowerCase().includes(term);
  });

  // Categorías únicas
  const allCategories = Array.from(new Set(products.map(p => p.categoria)));

  return (
    <div className="admin-layout-root">
      {/* BARRA SUPERIOR PARA PANTALLAS MÓVILES */}
      <div className="admin-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label="Abrir menú de administración"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span style={{ fontWeight: 900, letterSpacing: '0.04em', fontSize: '1.1rem' }}>LOS MAESTROS</span>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>
          {user?.rol || 'ADMIN'}
        </span>
      </div>

      {/* SIDEBAR LATERAL IZQUIERDO (DISEÑO EXACTO AL DE LA IMAGEN) */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Cabecera del Sidebar */}
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-brand" onClick={() => handleTabChange('resumen')}>
            <Wrench size={20} color="#C84B29" />
            <span>LOS MAESTROS</span>
          </Link>
          <span className="admin-sidebar-subtitle">
            FERRETERÍA &bull; PANEL OPERATIVO
          </span>
        </div>

        {/* Menú de Opciones del Sidebar */}
        <nav className="admin-sidebar-nav" aria-label="Navegación del panel administrativo">
          <button 
            type="button"
            onClick={() => handleTabChange('resumen')}
            className={`admin-nav-item ${activeTab === 'resumen' ? 'active' : ''}`}
          >
            <div className="admin-nav-item-content">
              <Home size={18} />
              <span>Resumen</span>
            </div>
            <span className="admin-nav-item-chevron">&rsaquo;</span>
          </button>

          <button 
            type="button"
            onClick={() => handleTabChange('productos')}
            className={`admin-nav-item ${activeTab === 'productos' ? 'active' : ''}`}
          >
            <div className="admin-nav-item-content">
              <Package size={18} />
              <span>Productos</span>
            </div>
            <span className="admin-nav-item-chevron">&rsaquo;</span>
          </button>

          <button 
            type="button"
            onClick={() => handleTabChange('pedidos')}
            className={`admin-nav-item ${activeTab === 'pedidos' ? 'active' : ''}`}
          >
            <div className="admin-nav-item-content">
              <ShoppingBag size={18} />
              <span>Pedidos</span>
            </div>
            <span className="admin-nav-item-chevron">&rsaquo;</span>
          </button>

          {isAdmin ? (
            <button 
              type="button"
              onClick={() => handleTabChange('usuarios')}
              className={`admin-nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
            >
              <div className="admin-nav-item-content">
                <Users size={18} />
                <span>Usuarios</span>
              </div>
              <span className="admin-nav-item-chevron">&rsaquo;</span>
            </button>
          ) : (
            <div 
              className="admin-nav-item" 
              style={{ opacity: 0.45, cursor: 'not-allowed' }} 
              title="Usuarios disponible solo para perfil Administrador"
            >
              <div className="admin-nav-item-content">
                <Users size={18} />
                <span>Usuarios (Admin)</span>
              </div>
            </div>
          )}

          <button 
            type="button"
            onClick={() => handleTabChange('categorias')}
            className={`admin-nav-item ${activeTab === 'categorias' ? 'active' : ''}`}
          >
            <div className="admin-nav-item-content">
              <Layers size={18} />
              <span>Categorías</span>
            </div>
            <span className="admin-nav-item-chevron">&rsaquo;</span>
          </button>
        </nav>

        {/* Footer del Sidebar con Usuario y Acciones */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-meta">
              <span className="admin-user-name">
                {user?.nombre || 'Don Carlos'} {user?.apellidos || 'Vega'}
              </span>
              <span className="admin-user-role-badge">
                {user?.rol || 'ADMINISTRADOR'}
              </span>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <Link to="/" className="admin-btn-back-store" title="Regresar a la tienda pública">
              <ArrowLeft size={14} /> Volver a la Tienda
            </Link>
            <button 
              type="button"
              onClick={handleLogout} 
              className="admin-btn-logout"
              title="Cerrar sesión operativa"
            >
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTENIDO */}
      <main className="admin-main-canvas">
        {/* MENSAJE DE FEEDBACK TÁCTIL */}
        {feedback && (
          <div className={`alert-tactile alert-tactile-${feedback.type}`} style={{ marginBottom: '1.5rem' }}>
            {feedback.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 1: RESUMEN (DISEÑO EXACTO AL DE LA IMAGEN)
            ======================================================== */}
        {activeTab === 'resumen' && (
          <div>
            {/* Encabezado Principal */}
            <div className="admin-header-block">
              <div className="admin-overline">
                OPERACIONES / GESTIÓN DE MESÓN
              </div>
              <h1 className="admin-title">
                El mesón, organizado.
              </h1>
              <p className="admin-subtitle">
                Monitoreo en tiempo real del catálogo ferretero, niveles de reposición y despacho a faenas en La Serena y Coquimbo.
              </p>
            </div>

            {/* TARJETAS MÉTRICAS KPI (FILA DE 3 - EXACTO A LA IMAGEN) */}
            <div className="admin-kpi-grid">
              {/* Tarjeta 1: Productos */}
              <div 
                className="admin-kpi-card" 
                onClick={() => handleTabChange('productos')} 
                style={{ cursor: 'pointer' }}
                title="Ver mantenedor de productos"
              >
                <div className="admin-kpi-header">
                  <span className="admin-kpi-label">Productos</span>
                  <Package size={20} color="#142436" />
                </div>
                <div className="admin-kpi-value">
                  {products.length}
                </div>
                <div className="admin-kpi-footer">
                  Artículos activos en catálogo &rarr;
                </div>
              </div>

              {/* Tarjeta 2: Stock Crítico */}
              <div 
                className={`admin-kpi-card ${criticalProducts.length > 0 ? 'admin-kpi-card-critical' : ''}`}
                onClick={() => {
                  setProductCriticalOnly(true);
                  handleTabChange('productos');
                }}
                style={{ cursor: 'pointer' }}
                title="Filtrar productos con stock crítico"
              >
                <div className="admin-kpi-header">
                  <span className="admin-kpi-label" style={{ color: criticalProducts.length > 0 ? '#dc2626' : '#475569' }}>
                    Stock crítico
                  </span>
                  <AlertOctagon size={20} color={criticalProducts.length > 0 ? '#dc2626' : '#142436'} />
                </div>
                <div className="admin-kpi-value" style={{ color: criticalProducts.length > 0 ? '#dc2626' : '#142436' }}>
                  {criticalProducts.length}
                </div>
                <div className="admin-kpi-footer" style={{ color: criticalProducts.length > 0 ? '#b91c1c' : '#64748b' }}>
                  {criticalProducts.length > 0 ? 'Requieren orden de reposición inmediata' : 'Niveles de stock óptimos'}
                </div>
              </div>

              {/* Tarjeta 3: Pedidos Registrados */}
              <div 
                className="admin-kpi-card"
                onClick={() => handleTabChange('pedidos')}
                style={{ cursor: 'pointer' }}
                title="Ver gestión de órdenes"
              >
                <div className="admin-kpi-header">
                  <span className="admin-kpi-label">Pedidos registrados</span>
                  <ShoppingBag size={20} color="#142436" />
                </div>
                <div className="admin-kpi-value">
                  {orders.length}
                </div>
                <div className="admin-kpi-footer">
                  Órdenes emitidas en la plataforma &rarr;
                </div>
              </div>
            </div>

            {/* SECCIÓN: PRODUCTOS QUE NECESITAN ATENCIÓN (EXACTO A LA IMAGEN) */}
            <section className="admin-section-block">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h2 className="admin-section-title">
                    Productos que necesitan atención
                  </h2>
                  <p className="admin-section-desc" style={{ margin: 0 }}>
                    Artículos con existencias iguales o inferiores a su umbral mínimo de seguridad.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={handleOpenCreateProduct} 
                    className="btn-admin-primary"
                    style={{ padding: '0.5rem 0.95rem', fontSize: '0.82rem' }}
                  >
                    <Plus size={15} /> Nuevo Producto
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleTabChange('productos')} 
                    className="btn-tactile btn-tactile-sm"
                  >
                    Ver Todo el Catálogo &rarr;
                  </button>
                </div>
              </div>

              {criticalProducts.length > 0 ? (
                <div className="admin-card-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Código SKU</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th style={{ textAlign: 'center' }}>Stock Actual</th>
                        <th style={{ textAlign: 'center' }}>Stock Mínimo</th>
                        <th style={{ textAlign: 'center' }}>Estado</th>
                        <th style={{ textAlign: 'center' }}>Ajuste Rápido</th>
                        <th style={{ textAlign: 'center' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criticalProducts.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                            {p.codigo}
                          </td>
                          <td>
                            <strong>{p.nombre}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Marca: {p.marca || 'N/A'}</div>
                          </td>
                          <td>{p.categoria}</td>
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#dc2626' }}>
                            {p.stock} {p.unidad}s
                          </td>
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            {p.stockMinimo} {p.unidad}s
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge-admin-critical">
                              {p.stock === 0 ? 'AGOTADO' : 'STOCK CRÍTICO'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="admin-stock-actions" style={{ justifyContent: 'center' }}>
                              <button 
                                type="button"
                                onClick={() => handleQuickStockAdjust(p.id, -1)}
                                className="btn-stock-adjust"
                                title="Disminuir stock en 1"
                                disabled={p.stock <= 0}
                              >
                                -1
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleQuickStockAdjust(p.id, 1)}
                                className="btn-stock-adjust"
                                title="Incrementar stock en 1"
                              >
                                +1
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleQuickStockAdjust(p.id, 5)}
                                className="btn-stock-adjust btn-stock-adjust-replenish"
                                title="Reabastecer con 5 unidades inmediatas"
                              >
                                +5 Reabastecer
                              </button>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              type="button" 
                              onClick={() => handleOpenEditProduct(p)} 
                              className="btn-tactile btn-tactile-sm"
                              title="Editar producto"
                            >
                              <Edit3 size={14} /> Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-card-container" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#f0fdf4', borderColor: '#059669' }}>
                  <CheckCircle2 size={36} color="#059669" style={{ marginBottom: '0.5rem' }} />
                  <h3 style={{ color: '#065f46', fontWeight: 900, margin: '0 0 0.25rem 0' }}>
                    ¡Excelente! Sin productos en stock crítico
                  </h3>
                  <p style={{ color: '#047857', margin: 0, fontSize: '0.9rem' }}>
                    Todos los artículos del catálogo disponen de existencias suficientes para satisfacer pedidos.
                  </p>
                </div>
              )}
            </section>

            {/* SECCIÓN COMPLEMENTARIA: ÚLTIMAS ÓRDENES */}
            <section className="admin-section-block">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="admin-section-title" style={{ fontSize: '1.3rem', margin: 0 }}>
                  Últimos Pedidos Emitidos
                </h3>
                <button 
                  type="button" 
                  onClick={() => handleTabChange('pedidos')} 
                  className="btn-tactile btn-tactile-sm"
                >
                  Gestionar Todos los Pedidos &rarr;
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="admin-card-container">
                  <table className="admin-table">
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
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.customerEmail}</div>
                          </td>
                          <td>{o.deliveryType === 'DESPACHO_OBRA' ? 'Despacho a Obra' : 'Retiro Tienda'}</td>
                          <td>
                            <span className="badge-tactile" style={{
                              backgroundColor: o.paymentMethod === 'CUENTA_CORRIENTE' ? 'var(--color-contractor)' : '#e2e8f0',
                              color: o.paymentMethod === 'CUENTA_CORRIENTE' ? '#ffffff' : 'inherit',
                              fontSize: '0.75rem'
                            }}>
                              {o.paymentMethod === 'CUENTA_CORRIENTE' ? 'Cta. Corriente' : 'Webpay'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
                            ${o.totalMonto?.toLocaleString('es-CL')}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge-admin-ok">
                              {o.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-card-container" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: '#64748b', margin: 0 }}>No hay órdenes registradas aún en el sistema.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 2: PRODUCTOS (MANTENEDOR CRUD COMPLETO)
            ======================================================== */}
        {activeTab === 'productos' && (
          <div>
            <div className="admin-header-block">
              <div className="admin-overline">CATÁLOGO / GESTIÓN DE INVENTARIO</div>
              <h1 className="admin-title">Mantenedor de Productos</h1>
              <p className="admin-subtitle">
                Administración integral de artículos ferreteros, precios, descuentos y existencias en bodega.
              </p>
            </div>

            {/* Barra de Herramientas */}
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={18} className="admin-search-icon" />
                <input 
                  type="text"
                  placeholder="Buscar por código SKU, nombre o marca..."
                  className="admin-search-input"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select 
                  className="select-tactile" 
                  value={productCategoryFilter} 
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  style={{ minWidth: '190px' }}
                >
                  <option value="ALL">Todas las Categorías</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={productCriticalOnly}
                    onChange={(e) => setProductCriticalOnly(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Solo Stock Crítico</span>
                </label>

                <button 
                  type="button" 
                  onClick={handleOpenCreateProduct} 
                  className="btn-admin-primary"
                >
                  <Plus size={18} /> Nuevo Producto
                </button>
              </div>
            </div>

            {/* Tabla de Productos */}
            <div className="admin-card-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th style={{ textAlign: 'right' }}>Precio Venta</th>
                    <th style={{ textAlign: 'center' }}>Stock</th>
                    <th style={{ textAlign: 'center' }}>Mínimo</th>
                    <th style={{ textAlign: 'center' }}>Oferta</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => {
                    const isCritical = p.stock <= p.stockMinimo;
                    return (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{p.codigo}</td>
                        <td>
                          <strong>{p.nombre}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Marca: {p.marca} &bull; {p.unidad}</div>
                        </td>
                        <td>{p.categoria}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                          ${p.precio.toLocaleString('es-CL')}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontWeight: 900,
                            color: isCritical ? '#dc2626' : '#142436',
                            display: 'inline-block',
                            marginRight: '0.35rem'
                          }}>
                            {p.stock}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleQuickStockAdjust(p.id, 1)}
                            className="btn-stock-adjust"
                            title="Sumar 1 unidad"
                            style={{ padding: '0.15rem 0.35rem', fontSize: '0.7rem' }}
                          >
                            +
                          </button>
                        </td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{p.stockMinimo}</td>
                        <td style={{ textAlign: 'center' }}>
                          {p.enOferta ? (
                            <span className="badge-tactile" style={{ backgroundColor: '#EA580C', color: '#fff', fontSize: '0.7rem' }}>
                              -{p.descuento}%
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Normal</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                            <button 
                              type="button"
                              onClick={() => handleOpenEditProduct(p)} 
                              className="btn-tactile btn-tactile-sm"
                              title="Editar"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.nombre)} 
                              className="btn-tactile btn-tactile-sm btn-tactile-danger"
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 3: PEDIDOS (CONTROL DE ÓRDENES Y DESPACHO)
            ======================================================== */}
        {activeTab === 'pedidos' && (
          <div>
            <div className="admin-header-block">
              <div className="admin-overline">LOGÍSTICA / GESTIÓN DE DESPACHO</div>
              <h1 className="admin-title">Control de Órdenes y Pedidos</h1>
              <p className="admin-subtitle">
                Monitoreo de notas de venta, estados logísticos y entregas a pie de obra en la región.
              </p>
            </div>

            {/* Barra de Herramientas */}
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={18} className="admin-search-icon" />
                <input 
                  type="text"
                  placeholder="Buscar por código de orden o nombre de cliente..."
                  className="admin-search-input"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <select 
                className="select-tactile" 
                value={orderStatusFilter} 
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{ minWidth: '190px' }}
              >
                <option value="ALL">Todos los Estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Preparación">En Preparación</option>
                <option value="En Ruta">En Ruta</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>

            {/* Tabla de Órdenes */}
            <div className="admin-card-container">
              {filteredOrders.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Modalidad</th>
                      <th>Medio Pago</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                      <th style={{ textAlign: 'center' }}>Estado Logístico</th>
                      <th style={{ textAlign: 'center' }}>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{o.codigoOrden}</td>
                        <td style={{ fontSize: '0.82rem' }}>{o.fechaLegible}</td>
                        <td>
                          <strong>{o.customerName}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.customerEmail}</div>
                        </td>
                        <td>{o.deliveryType === 'DESPACHO_OBRA' ? 'Despacho Obra' : 'Retiro Tienda'}</td>
                        <td>
                          <span className="badge-tactile" style={{
                            backgroundColor: o.paymentMethod === 'CUENTA_CORRIENTE' ? 'var(--color-contractor)' : '#e2e8f0',
                            color: o.paymentMethod === 'CUENTA_CORRIENTE' ? '#ffffff' : 'inherit',
                            fontSize: '0.72rem'
                          }}>
                            {o.paymentMethod === 'CUENTA_CORRIENTE' ? 'Cta. Corriente' : 'Webpay'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
                          ${o.totalMonto.toLocaleString('es-CL')}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <select 
                            value={o.estado} 
                            onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                            className="select-tactile"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 800 }}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Preparación">En Preparación</option>
                            <option value="En Ruta">En Ruta</option>
                            <option value="Entregado">Entregado</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button"
                            onClick={() => setSelectedOrder(o)}
                            className="btn-tactile btn-tactile-sm"
                            title="Ver Boleta de Venta"
                          >
                            <Eye size={14} /> Boleta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                  No se encontraron pedidos con los criterios aplicados.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 4: USUARIOS (CONTROL RBAC Y CONTRATISTAS)
            ======================================================== */}
        {activeTab === 'usuarios' && isAdmin && (
          <div>
            <div className="admin-header-block">
              <div className="admin-overline">SEGURIDAD / CONTROL DE ACCESO RBAC</div>
              <h1 className="admin-title">Gestión de Usuarios y Roles</h1>
              <p className="admin-subtitle">
                Administración de cuentas, privilegios de acceso y líneas de crédito comercial para contratistas.
              </p>
            </div>

            {/* Barra de Herramientas */}
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={18} className="admin-search-icon" />
                <input 
                  type="text"
                  placeholder="Buscar por RUN, nombre o correo..."
                  className="admin-search-input"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <button 
                type="button" 
                onClick={handleOpenCreateUser} 
                className="btn-admin-primary"
              >
                <Plus size={18} /> Nuevo Usuario
              </button>
            </div>

            {/* Tabla de Usuarios */}
            <div className="admin-card-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>RUN (Módulo 11)</th>
                    <th>Nombre Completo</th>
                    <th>Correo Electrónico</th>
                    <th style={{ textAlign: 'center' }}>Rol Asignado</th>
                    <th>Comuna</th>
                    <th style={{ textAlign: 'right' }}>Línea Crédito</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{u.run}</td>
                      <td>
                        <strong>{u.nombre} {u.apellidos}</strong>
                        {u.empresa && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.empresa}</div>}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                      <td style={{ textAlign: 'center' }}>
                        <select 
                          value={u.rol}
                          onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                          className="select-tactile"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 800 }}
                          disabled={Number(u.id) === Number(user?.id)}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="VENDEDOR">VENDEDOR</option>
                          <option value="CONTRATISTA">CONTRATISTA</option>
                          <option value="CLIENTE">CLIENTE</option>
                        </select>
                      </td>
                      <td>{u.comuna}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {u.rol === 'CONTRATISTA' ? (
                          <span style={{ fontWeight: 800, color: 'var(--color-contractor)' }}>
                            ${(u.creditoMaximo || 0).toLocaleString('es-CL')}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                          <button 
                            type="button"
                            onClick={() => handleOpenEditUser(u)} 
                            className="btn-tactile btn-tactile-sm"
                            title="Editar usuario"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteUser(u.id, `${u.nombre} ${u.apellidos}`)} 
                            className="btn-tactile btn-tactile-sm btn-tactile-danger"
                            title="Eliminar usuario"
                            disabled={Number(u.id) === Number(user?.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 5: CATEGORÍAS (ORGANIZACIÓN POR FAMILIAS)
            ======================================================== */}
        {activeTab === 'categorias' && (
          <div>
            <div className="admin-header-block">
              <div className="admin-overline">ORGANIZACIÓN / FAMILIAS FERRETERAS</div>
              <h1 className="admin-title">Categorías y Familias de Productos</h1>
              <p className="admin-subtitle">
                Estructura del catálogo técnico distribuido por departamentos y especialidades de obra.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {allCategories.map(cat => {
                const prodsInCat = products.filter(p => p.categoria === cat);
                const totalStock = prodsInCat.reduce((sum, p) => sum + p.stock, 0);
                const criticalCount = prodsInCat.filter(p => p.stock <= p.stockMinimo).length;

                return (
                  <div key={cat} className="admin-kpi-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#142436', margin: '0 0 0.5rem 0' }}>
                        {cat}
                      </h3>
                      <Layers size={22} color="#C84B29" />
                    </div>

                    <div style={{ margin: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Artículos activos:</span>
                        <strong style={{ fontFamily: 'var(--font-mono)' }}>{prodsInCat.length} referencias</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Stock disponible:</span>
                        <strong style={{ fontFamily: 'var(--font-mono)' }}>{totalStock} unidades</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Bajo stock mínimo:</span>
                        <strong style={{ color: criticalCount > 0 ? '#dc2626' : '#059669', fontFamily: 'var(--font-mono)' }}>
                          {criticalCount} productos
                        </strong>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => {
                        setProductCategoryFilter(cat);
                        handleTabChange('productos');
                      }}
                      className="btn-tactile btn-tactile-sm btn-tactile-block"
                      style={{ marginTop: 'auto' }}
                    >
                      Filtrar en Mantenedor &rarr;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: CREAR / EDITAR PRODUCTO
          ======================================================== */}
      {productModalOpen && (
        <div className="modal-overlay-tactile" onClick={() => setProductModalOpen(false)}>
          <div className="modal-box-tactile" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: 'var(--border-sm)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <button 
                type="button" 
                onClick={() => setProductModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1.25rem' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Código SKU *</label>
                  <input 
                    type="text" 
                    className="input-tactile"
                    value={productFormData.codigo}
                    onChange={(e) => setProductFormData({ ...productFormData, codigo: e.target.value.toUpperCase() })}
                    placeholder="HE005"
                    required
                  />
                  {productFormErrors.codigo && <span className="error-text">{productFormErrors.codigo}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Nombre del Producto *</label>
                  <input 
                    type="text" 
                    className="input-tactile"
                    value={productFormData.nombre}
                    onChange={(e) => setProductFormData({ ...productFormData, nombre: e.target.value })}
                    placeholder="Taladro percutor..."
                    required
                  />
                  {productFormErrors.nombre && <span className="error-text">{productFormErrors.nombre}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Categoría *</label>
                  <select 
                    className="select-tactile"
                    value={productFormData.categoria}
                    onChange={(e) => setProductFormData({ ...productFormData, categoria: e.target.value })}
                  >
                    <option value="Materiales de Construcción">Materiales de Construcción</option>
                    <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                    <option value="Herramientas Manuales">Herramientas Manuales</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Gasfitería">Gasfitería</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Pinturas">Pinturas</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label-tactile">Marca</label>
                  <input 
                    type="text" 
                    className="input-tactile"
                    value={productFormData.marca}
                    onChange={(e) => setProductFormData({ ...productFormData, marca: e.target.value })}
                    placeholder="Makita, Bosch, Polpaico..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Precio Venta ($) *</label>
                  <input 
                    type="number" 
                    className="input-tactile"
                    value={productFormData.precio}
                    onChange={(e) => setProductFormData({ ...productFormData, precio: e.target.value })}
                    placeholder="79990"
                    required
                  />
                  {productFormErrors.precio && <span className="error-text">{productFormErrors.precio}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Stock Actual *</label>
                  <input 
                    type="number" 
                    className="input-tactile"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    placeholder="15"
                    required
                  />
                  {productFormErrors.stock && <span className="error-text">{productFormErrors.stock}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Stock Mínimo *</label>
                  <input 
                    type="number" 
                    className="input-tactile"
                    value={productFormData.stockMinimo}
                    onChange={(e) => setProductFormData({ ...productFormData, stockMinimo: e.target.value })}
                    placeholder="5"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Unidad de Medida</label>
                  <input 
                    type="text" 
                    className="input-tactile"
                    value={productFormData.unidad}
                    onChange={(e) => setProductFormData({ ...productFormData, unidad: e.target.value })}
                    placeholder="Unidad, Saco, Par, Tira..."
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={productFormData.enOferta}
                      onChange={(e) => setProductFormData({ ...productFormData, enOferta: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>¿En Oferta Promocional?</span>
                  </label>
                  {productFormData.enOferta && (
                    <div style={{ marginTop: '0.35rem' }}>
                      <input 
                        type="number"
                        className="input-tactile"
                        placeholder="% Descuento (ej: 15)"
                        value={productFormData.descuento}
                        onChange={(e) => setProductFormData({ ...productFormData, descuento: e.target.value })}
                        min={1}
                        max={90}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="label-tactile">Descripción Técnica</label>
                <textarea 
                  className="input-tactile"
                  rows={3}
                  value={productFormData.descripcion}
                  onChange={(e) => setProductFormData({ ...productFormData, descripcion: e.target.value })}
                  placeholder="Detalles y uso en obra..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={() => setProductModalOpen(false)}
                  className="btn-tactile"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-tactile btn-tactile-secondary"
                >
                  <Save size={16} /> Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREAR / EDITAR USUARIO
          ======================================================== */}
      {userModalOpen && (
        <div className="modal-overlay-tactile" onClick={() => setUserModalOpen(false)}>
          <div className="modal-box-tactile" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: 'var(--border-sm)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                {editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
              </h2>
              <button 
                type="button" 
                onClick={() => setUserModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1.25rem' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="label-tactile">RUN Chileno *</label>
                  <input 
                    type="text" 
                    className="input-tactile"
                    value={userFormData.run}
                    onChange={(e) => setUserFormData({ ...userFormData, run: e.target.value })}
                    placeholder="11222333-9"
                    required
                  />
                  {userFormErrors.run && <span className="error-text">{userFormErrors.run}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Rol Asignado *</label>
                  <select 
                    className="select-tactile"
                    value={userFormData.rol}
                    onChange={(e) => setUserFormData({ ...userFormData, rol: e.target.value })}
                  >
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="CONTRATISTA">CONTRATISTA</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="ADMIN">ADMINISTRADOR</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Nombre *</label>
                  <input 
                    type="text" 
                    className="input-tactile"
                    value={userFormData.nombre}
                    onChange={(e) => setUserFormData({ ...userFormData, nombre: e.target.value })}
                    placeholder="Carlos"
                    required
                  />
                  {userFormErrors.nombre && <span className="error-text">{userFormErrors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Apellidos *</label>
                  <input 
                    type="text" 
                    className="input-tactile"
                    value={userFormData.apellidos}
                    onChange={(e) => setUserFormData({ ...userFormData, apellidos: e.target.value })}
                    placeholder="Vega Osorio"
                    required
                  />
                  {userFormErrors.apellidos && <span className="error-text">{userFormErrors.apellidos}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Correo Institucional *</label>
                  <input 
                    type="email" 
                    className="input-tactile"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="admin@duoc.cl"
                    required
                  />
                  {userFormErrors.email && <span className="error-text">{userFormErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">
                    {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                  </label>
                  <input 
                    type="password" 
                    className="input-tactile"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                  {userFormErrors.password && <span className="error-text">{userFormErrors.password}</span>}
                </div>
              </div>

              {/* Si es contratista, opciones de crédito */}
              {userFormData.rol === 'CONTRATISTA' && (
                <div style={{ padding: '0.85rem', backgroundColor: '#eff6ff', border: '1.5px solid #3b82f6', borderRadius: '4px', marginBottom: '0.75rem' }}>
                  <label className="label-tactile" style={{ color: '#1e40af' }}>
                    Cupo Línea de Crédito a 30 Días ($)
                  </label>
                  <input 
                    type="number"
                    className="input-tactile"
                    value={userFormData.creditoMaximo}
                    onChange={(e) => setUserFormData({ ...userFormData, creditoMaximo: Number(e.target.value) })}
                    placeholder="3500000"
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button 
                  type="button" 
                  onClick={() => setUserModalOpen(false)}
                  className="btn-tactile"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-tactile btn-tactile-secondary"
                >
                  <Save size={16} /> Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: VER BOLETA / DETALLE DE PEDIDO
          ======================================================== */}
      {selectedOrder && (
        <div className="modal-overlay-tactile" onClick={() => setSelectedOrder(null)}>
          <div className="modal-box-tactile" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: 'var(--border-sm)', paddingBottom: '0.75rem' }}>
              <div>
                <span className="badge-tactile" style={{ backgroundColor: 'var(--color-secondary)', color: '#fff', fontSize: '0.7rem' }}>
                  COMPROBANTE DE VENTA
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0.25rem 0 0 0' }}>
                  Orden N° {selectedOrder.codigoOrden}
                </h2>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1.25rem' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div>
                <strong>Cliente:</strong> {selectedOrder.customerName}<br />
                <strong>RUN:</strong> {selectedOrder.customerRun || 'N/A'}<br />
                <strong>Email:</strong> {selectedOrder.customerEmail}
              </div>
              <div>
                <strong>Modalidad:</strong> {selectedOrder.deliveryType === 'DESPACHO_OBRA' ? 'Despacho a Obra' : 'Retiro Tienda'}<br />
                <strong>Dirección:</strong> {selectedOrder.deliveryAddress || 'Sucursal Balmaceda 1420'}<br />
                <strong>Medio de Pago:</strong> {selectedOrder.paymentMethod === 'CUENTA_CORRIENTE' ? 'Cuenta Corriente Contratista' : 'Webpay Plus'}
              </div>
            </div>

            <div className="table-container-tactile" style={{ marginBottom: '1rem', boxShadow: 'none' }}>
              <table className="table-tactile">
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th style={{ textAlign: 'center' }}>Cant.</th>
                    <th style={{ textAlign: 'right' }}>Unitario</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map(it => (
                    <tr key={it.id}>
                      <td><strong>{it.nombre}</strong></td>
                      <td style={{ textAlign: 'center' }}>{it.quantity}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>${it.precio?.toLocaleString('es-CL')}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>${(it.precio * it.quantity)?.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-sm)', paddingTop: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <strong>Estado Actual:</strong>{' '}
                <span className="badge-admin-ok" style={{ marginLeft: '0.35rem' }}>
                  {selectedOrder.estado}
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                Total: ${selectedOrder.totalMonto?.toLocaleString('es-CL')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => window.print()} 
                className="btn-tactile btn-tactile-sm"
              >
                <FileText size={14} /> Imprimir Comprobante
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedOrder(null)} 
                className="btn-tactile btn-tactile-sm btn-tactile-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
