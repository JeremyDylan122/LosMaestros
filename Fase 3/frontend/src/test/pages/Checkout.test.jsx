import React, { } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Checkout } from '../../pages/Checkout';
import { CheckoutSuccess } from '../../pages/CheckoutSuccess';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { storageService } from '../../services/storageService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.restoreAllMocks(); });
function setup() {
  storageService.set('carrito_v2', [{ ...productService.getProductById(1), cantidad: 1 }]);
  render(<MemoryRouter initialEntries={['/checkout']}><AuthProvider><CartProvider><Routes>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/compra-exitosa/:id" element={<CheckoutSuccess />} />
    <Route path="/compra-fallida" element={<h1>Pago rechazado</h1>} />
    <Route path="/carrito" element={<h1>Carrito vacío</h1>} />
  </Routes></CartProvider></AuthProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Nombre Completo *'), { target: { value: 'Cliente de prueba' } });
  fireEvent.change(screen.getByLabelText('Correo Electrónico *'), { target: { value: 'prueba@gmail.com' } });
  fireEvent.change(screen.getByLabelText('Dirección de Entrega / Faena *'), { target: { value: 'Dirección ficticia 123' } });
}

describe('Checkout completo', () => {
  it('mantiene la confirmación después de vaciar el carrito y muestra el flete', async () => {
    setup();
    fireEvent.submit(screen.getByTestId('checkout-form'));
    expect(await screen.findByText('¡Compra Finalizada con Éxito!')).toBeInTheDocument();
    expect(screen.queryByText('Carrito vacío')).not.toBeInTheDocument();
    expect(orderService.getOrders()[0].shippingFee).toBe(4990);
    expect(storageService.get('carrito_v2')).toEqual([]);
  });
  it('un fallo de pago simulado conserva carrito y existencias', async () => {
    setup();
    const stock = productService.getProductById(1).stock;
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByTestId('checkout-form'));
    expect(await screen.findByText('Pago rechazado')).toBeInTheDocument();
    expect(orderService.getOrders()).toHaveLength(0);
    expect(productService.getProductById(1).stock).toBe(stock);
    expect(storageService.get('carrito_v2')).toHaveLength(1);
  });
  it('muestra el error del servicio sin informar compra exitosa', async () => {
    setup();
    vi.spyOn(orderService, 'createOrder').mockImplementation(() => { throw new Error('Almacenamiento no disponible'); });
    fireEvent.submit(screen.getByTestId('checkout-form'));
    expect(await screen.findByText('Almacenamiento no disponible')).toBeInTheDocument();
    expect(storageService.get('carrito_v2')).toHaveLength(1);
  });
});
