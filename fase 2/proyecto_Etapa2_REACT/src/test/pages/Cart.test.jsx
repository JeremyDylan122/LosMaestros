import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Cart } from '../../pages/Cart';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

const renderCart = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Cart />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Página del Carrito de Compras (Cart)', () => {
  beforeEach(() => {
    storageService.clearAll();
  });

  it('debe mostrar el mensaje de carrito vacío cuando no hay ítems guardados', () => {
    renderCart();
    expect(screen.getByText(/Tu Carrito de Compras está Vacío/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explorar Catálogo/i })).toBeInTheDocument();
  });

  it('debe renderizar los productos, subtotales y el botón de Checkout cuando tiene ítems', () => {
    // Precargar un ítem en localStorage
    storageService.set('carrito_v2', [
      {
        id: 1,
        codigo: 'MC001',
        nombre: 'Cemento Polpaico gris 25 kg',
        precio: 5990,
        stock: 50,
        unidad: 'Saco',
        cantidad: 2
      }
    ]);

    renderCart();

    expect(screen.getByText('Cemento Polpaico gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText(/MC001/)).toBeInTheDocument();
    expect(screen.getAllByText('$11.980').length).toBeGreaterThan(0); // 5990 * 2 = 11980
    expect(screen.getByTestId('proceed-checkout-btn')).toBeInTheDocument();
  });

  it('debe incrementar la cantidad del ítem y recalcular el total al hacer clic en el botón +', () => {
    storageService.set('carrito_v2', [
      {
        id: 1,
        codigo: 'MC001',
        nombre: 'Cemento Polpaico gris 25 kg',
        precio: 5990,
        stock: 50,
        unidad: 'Saco',
        cantidad: 1
      }
    ]);

    renderCart();

    const plusBtn = screen.getByRole('button', { name: /Aumentar cantidad/i });
    fireEvent.click(plusBtn);

    // Debe aumentar a 2 y el total a $11.980
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('$11.980').length).toBeGreaterThan(0);
  });
});
