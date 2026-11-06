import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { storageService } from '../../services/storageService';
import { serverSession } from '../helpers/serverSession';

afterEach(() => vi.restoreAllMocks());

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
    localStorage.removeItem('auth_token');
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

  it('debe mostrar el acceso al Panel Admin cuando Usuarios confirma el perfil ADMIN', async () => {
    serverSession(1);

    renderNavbar();
    const adminBtn = await screen.findByRole('link', { name: /Panel Admin/i });
    expect(adminBtn).toBeInTheDocument();
  });
});
