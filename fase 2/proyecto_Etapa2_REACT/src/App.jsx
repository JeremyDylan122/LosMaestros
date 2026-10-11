import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { ProductManager } from './pages/admin/ProductManager';
import { UserManager } from './pages/admin/UserManager';
import { OrderManager } from './pages/admin/OrderManager';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
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

                {/* Flujo de Compra y Carrito */}
                <Route path="/carrito" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/compra-exitosa/:id" element={<CheckoutSuccess />} />
                <Route path="/compra-fallida" element={<CheckoutFailure />} />

                {/* Vistas Protegidas del Administrador y Vendedor (RBAC) */}
                <Route 
                  path="/admin" 
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
                      <ProductManager />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/pedidos" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
                      <OrderManager />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/usuarios" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <UserManager />
                    </ProtectedRoute>
                  } 
                />

                {/* Ruta comodín */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
