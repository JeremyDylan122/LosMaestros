import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { storageService } from '../../services/storageService';

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Componente Navbar', () => {
  beforeEach(() => {
    storageService.clearAll();
  });

  it('debe renderizar la marca corporativa "LOS MAESTROS" y la ciudad de origen', () => {
    renderNavbar();
    expect(screen.getByText('LOS MAESTROS')).toBeInTheDocument();
    expect(screen.getByText(/LA SERENA/)).toBeInTheDocument();
  });

  it('debe renderizar los enlaces principales de navegación', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /^Inicio$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Catálogo$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Categorías$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ofertas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Nosotros$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Blogs$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Contacto$/i })).toBeInTheDocument();
  });

  it('debe mostrar el contador de ítems del carrito en 0 inicialmente', () => {
    renderNavbar();
    const badge = screen.getByText('0');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('cart-counter-badge');
  });

  it('debe mostrar el acceso al Panel Admin cuando hay sesión iniciada como ADMIN', () => {
    // Simular sesión de administrador en storageService
    storageService.set('current_user', {
      id: 1,
      nombre: 'Carlos',
      email: 'admin@duoc.cl',
      rol: 'ADMIN'
    });

    renderNavbar();
    const adminBtn = screen.getByRole('link', { name: /Panel Admin/i });
    expect(adminBtn).toBeInTheDocument();
  });
});
