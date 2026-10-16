import { MyOrders } from './pages/MyOrders';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Páginas de la Tienda
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Categories } from './pages/Categories';
import { Offers } from './pages/Offers';
import { About } from './pages/About';
import { Blogs } from './pages/Blogs';
import { BlogDetail } from './pages/BlogDetail';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { CheckoutFailure } from './pages/CheckoutFailure';

// Páginas del Panel Administrativo
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Vistas Públicas de la Tienda */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/ofertas" element={<Offers />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route path="/mis-pedidos" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          {/* Flujo de Compra y Carrito */}
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa/:id" element={<CheckoutSuccess />} />
          <Route path="/compra-fallida" element={<CheckoutFailure />} />

          {/* Vistas Protegidas del Panel Administrativo (RBAC) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/resumen" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/productos" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/pedidos" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/usuarios" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categorias" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Ruta comodín */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
