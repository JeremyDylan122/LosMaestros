import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../../components/products/ProductCard';
import { CartProvider } from '../../context/CartContext';
import { storageService } from '../../services/storageService';

const mockProduct = {
  id: 101,
  codigo: 'MC101',
  nombre: 'Mortero Rápido 25 kg',
  categoria: 'Materiales de Construcción',
  marca: 'Polpaico',
  unidad: 'Saco',
  precio: 6500,
  stock: 25,
  stockMinimo: 10,
  enOferta: false,
  descuento: 0,
  imagen: '/assets/img/productos/cemento.jpg'
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Componente ProductCard', () => {
  beforeEach(() => {
    storageService.clearAll();
  });

  describe('Pruebas de Renderizado (Render Tests)', () => {
    it('debe renderizar correctamente los datos del producto (nombre, código, precio y marca)', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);

      expect(screen.getByText('Mortero Rápido 25 kg')).toBeInTheDocument();
      expect(screen.getByText(/MC101/)).toBeInTheDocument();
      expect(screen.getByText(/Polpaico/)).toBeInTheDocument();
      expect(screen.getByText('$6.500')).toBeInTheDocument();
      expect(screen.getByText(/Stock en bodega: 25 Sacos/)).toBeInTheDocument();
    });
  });

  describe('Pruebas de Renderizado Condicional', () => {
    it('debe mostrar el badge de oferta cuando enOferta es true y calcular el descuento', () => {
      const offerProduct = {
        ...mockProduct,
        enOferta: true,
        descuento: 20
      };

      renderWithProviders(<ProductCard product={offerProduct} />);
      expect(screen.getByText(/-20% OFF/)).toBeInTheDocument();
      // Precio con 20% descuento: 6500 * 0.8 = 5200
      expect(screen.getByText('$5.200')).toBeInTheDocument();
      expect(screen.getByText('$6.500')).toBeInTheDocument(); // Precio original tachado
    });

    it('debe mostrar la alerta de Stock Crítico cuando el stock es menor o igual al stock mínimo', () => {
      const criticalProduct = {
        ...mockProduct,
        stock: 5,
        stockMinimo: 8
      };

      renderWithProviders(<ProductCard product={criticalProduct} />);
      expect(screen.getByTestId('critical-badge')).toBeInTheDocument();
      expect(screen.getByText(/Stock Crítico \(5 un\.\)/)).toBeInTheDocument();
    });

    it('debe deshabilitar el botón de compra cuando el stock es 0', () => {
      const outOfStockProduct = {
        ...mockProduct,
        stock: 0
      };

      renderWithProviders(<ProductCard product={outOfStockProduct} />);
      expect(screen.getByText(/Agotado/)).toBeInTheDocument();

      const btn = screen.getByRole('button', { name: /al carrito/i });
      expect(btn).toBeDisabled();
    });
  });

  describe('Pruebas de Eventos (Event Simulation)', () => {
    it('debe simular el evento de clic en Añadir al Carrito y ejecutar la acción sin errores', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);

      const addBtn = screen.getByRole('button', { name: /al carrito/i });
      fireEvent.click(addBtn);

      // El carrito en localStorage debe haberse actualizado
      const savedCart = storageService.get('carrito_v2', []);
      expect(savedCart.length).toBe(1);
      expect(savedCart[0].nombre).toBe('Mortero Rápido 25 kg');
    });
  });
});
