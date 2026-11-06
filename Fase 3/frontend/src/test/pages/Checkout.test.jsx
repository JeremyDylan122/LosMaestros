import { serverSession } from '../helpers/serverSession';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Checkout } from '../../pages/Checkout';
import { CheckoutSuccess } from '../../pages/CheckoutSuccess';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { storageService } from '../../services/storageService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.restoreAllMocks(); });
const receipt = { id: 12, codigoOrden: 'LM-0012', fecha: '2026-11-05T12:00:00', fechaLegible: '05/11/2026', customerName: 'Cliente de prueba', customerEmail: 'prueba@gmail.com', subtotal: 5000, shippingFee: 4990, totalMonto: 9990, items: [], paymentMethod: 'WEBPAY_SIMULADO', deliveryType: 'DESPACHO_OBRA', estado: 'CONFIRMADO', estadoPago: 'PAGADO_SIMULADO' };
async function setup() {
  serverSession(4);
  vi.spyOn(productService, 'fetchProducts').mockResolvedValue(productService.getProducts());
  vi.spyOn(orderService, 'createOrder').mockResolvedValue(receipt);
  vi.spyOn(orderService, 'getOrderById').mockResolvedValue(receipt);
  storageService.set('carrito_v2', [{ ...productService.getProductById(1), cantidad: 1 }]);
  render(<MemoryRouter initialEntries={['/checkout']}><AuthProvider><CartProvider><Routes>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/compra-exitosa/:id" element={<CheckoutSuccess />} />
    <Route path="/compra-fallida" element={<h1>Pago rechazado</h1>} />
    <Route path="/carrito" element={<h1>Carrito vacío</h1>} />
  </Routes></CartProvider></AuthProvider></MemoryRouter>);
  await waitFor(() => expect(screen.getByLabelText('Nombre Completo *').value).not.toBe(''));
  await waitFor(() => expect(screen.getByRole('button', { name: /confirmar|pagar/i })).toBeEnabled());
  fireEvent.change(screen.getByLabelText('Nombre Completo *'), { target: { value: 'Cliente de prueba' } });
  fireEvent.change(screen.getByLabelText('Correo Electrónico *'), { target: { value: 'prueba@gmail.com' } });
  fireEvent.change(screen.getByLabelText('Dirección de Entrega / Faena *'), { target: { value: 'Dirección ficticia 123' } });
}

describe('Checkout completo', () => {
  it('mantiene la confirmación después de vaciar el carrito y muestra el flete', async () => {
    await setup();
    fireEvent.submit(screen.getByTestId('checkout-form'));
    expect(await screen.findByText('¡Compra Finalizada con Éxito!')).toBeInTheDocument();
    expect(screen.queryByText('Carrito vacío')).not.toBeInTheDocument();
    expect(orderService.createOrder).toHaveBeenCalledOnce();
    expect(orderService.getOrderById).toHaveBeenCalledWith('12');
    expect(storageService.get('carrito_v2')).toEqual([]);
  });
  it('un fallo de pago simulado conserva carrito y existencias', async () => {
    await setup();
    const stock = productService.getProductById(1).stock;
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByTestId('checkout-form'));
    expect(await screen.findByText('Pago rechazado')).toBeInTheDocument();
    expect(orderService.createOrder).not.toHaveBeenCalled();
    expect(productService.getProductById(1).stock).toBe(stock);
    expect(storageService.get('carrito_v2')).toHaveLength(1);
  });
  it('muestra el error del servicio sin informar compra exitosa', async () => {
    await setup();
    orderService.createOrder.mockRejectedValue(new Error('Ventas no disponible'));
    fireEvent.submit(screen.getByTestId('checkout-form'));
    expect(await screen.findByText('Ventas no disponible')).toBeInTheDocument();
    expect(storageService.get('carrito_v2')).toHaveLength(1);
  });
  it('mantiene los datos de entrega editados cuando llega una actualización del perfil', async () => {
    await setup();
    fireEvent.change(screen.getByLabelText('Dirección de Entrega / Faena *'), { target: { value: 'Otra dirección de entrega' } });
    const { userApiService } = await import('../../services/userApiService');
    const { serverUsers } = await import('../helpers/serverSession');
    userApiService.getProfile.mockResolvedValueOnce({ ...serverUsers.find(user => user.id === 4), empresa: 'Empresa actualizada' });
    fireEvent(window, new Event('focus'));
    await waitFor(() => expect(userApiService.getProfile).toHaveBeenCalledTimes(2));
    expect(screen.getByLabelText('Dirección de Entrega / Faena *')).toHaveValue('Otra dirección de entrega');
    expect(screen.getByLabelText('Nombre Completo *')).toHaveValue('Cliente de prueba');
  });
  it('evita dos envíos mientras el primer pedido sigue pendiente', async () => {
    await setup();
    let resolveOrder;
    orderService.createOrder.mockReturnValue(new Promise(resolve => { resolveOrder = resolve; }));
    fireEvent.submit(screen.getByTestId('checkout-form'));
    fireEvent.submit(screen.getByTestId('checkout-form'));
    expect(orderService.createOrder).toHaveBeenCalledOnce();
    expect(storageService.get('carrito_v2')).toHaveLength(1);
    resolveOrder(receipt);
    expect(await screen.findByText('¡Compra Finalizada con Éxito!')).toBeInTheDocument();
  });
  it('el detalle informa una anulación sin presentar un cargo vigente', async () => {
    orderService.getOrderById = vi.spyOn(orderService, 'getOrderById').mockResolvedValue({ ...receipt, estado: 'ANULADO', estadoPago: 'ANULADO', paymentMethod: 'CUENTA_CORRIENTE' });
    render(<MemoryRouter initialEntries={['/compra-exitosa/12']}><Routes><Route path="/compra-exitosa/:id" element={<CheckoutSuccess />} /></Routes></MemoryRouter>);
    expect(await screen.findByText('Pedido anulado')).toBeInTheDocument();
    expect(screen.queryByText('Pedido cargado a Cuenta Corriente Contratista:')).not.toBeInTheDocument();
  });
});
