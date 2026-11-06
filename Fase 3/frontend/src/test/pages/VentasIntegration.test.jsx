import React from 'react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CuentaCorrienteModal } from '../../components/admin/CuentaCorrienteModal';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { Products } from '../../pages/Products';
import { AuthProvider } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { serverSession } from '../helpers/serverSession';

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());
const contractor = { id: 3, nombre: 'Contratista', apellidos: 'Prueba' };
const account = { usuarioId: 3, activa: true, creditoMaximo: 100000, saldoPendiente: 12000, creditoDisponible: 88000 };
describe('Integración visible de Ventas', () => {
  it('el comprobante administrativo muestra cantidades, precios y entrega del pedido REST', async () => {
    serverSession(1);
    vi.spyOn(productService, 'fetchProducts').mockResolvedValue([]);
    vi.spyOn(productService, 'fetchCategories').mockResolvedValue([]);
    vi.spyOn(productService, 'fetchCriticalStock').mockResolvedValue([]);
    vi.spyOn(orderService, 'getOrders').mockResolvedValue([{ id: 9, codigoOrden: 'LM-9', customerName: 'Cliente', customerEmail: 'cliente@gmail.com', fechaLegible: '05/11/2026', estado: 'CONFIRMADO', totalMonto: 21973, subtotal: 16983, shippingFee: 4990, deliveryType: 'DESPACHO_OBRA', address: 'Dirección de prueba 123', commune: 'La Serena', paymentMethod: 'TRANSFERENCIA', items: [{ id: 7, nombre: 'Pintura de prueba', cantidad: 2, precioUnitario: 8491.5, subtotal: 16983 }] }]);
    render(<MemoryRouter initialEntries={['/admin/pedidos']}><AuthProvider><AdminDashboard /></AuthProvider></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /Boleta/ }));
    const row = screen.getByText('Pintura de prueba').closest('tr');
    expect(within(row).getByText('2')).toBeInTheDocument();
    expect(within(row).getByText('$8.491,5')).toBeInTheDocument();
    expect(within(row).getByText('$16.983')).toBeInTheDocument();
    expect(screen.getByText(/Dirección de prueba 123 \(La Serena\)/)).toBeInTheDocument();
    expect(screen.getByText(/Transferencia Electrónica/)).toBeInTheDocument();
    expect(screen.getByText(/Productos: \$16.983 · Despacho: \$4.990/)).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  });
  it('carga cupo y deuda de Ventas; guardar solo modifica cupo y activación', async () => {
    vi.spyOn(orderService, 'getAccount').mockResolvedValue(account);
    const save = vi.spyOn(orderService, 'configureAccount').mockResolvedValue(account);
    render(<CuentaCorrienteModal user={contractor} onClose={vi.fn()} />);
    const limit = await screen.findByLabelText('Cupo máximo (CLP)');
    await waitFor(() => expect(limit).toHaveValue(100000));
    expect(screen.getByText(/Saldo pendiente: \$12.000/)).toBeInTheDocument();
    fireEvent.change(limit, { target: { value: '150000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cuenta' }));
    expect(await screen.findByText('Cuenta corriente guardada.')).toBeInTheDocument();
    expect(save).toHaveBeenCalledWith(3, { activa: true, creditoMaximo: 150000 });
  });
  it('conserva el cupo escrito cuando Ventas rechaza la configuración', async () => {
    vi.spyOn(orderService, 'getAccount').mockResolvedValue(null);
    vi.spyOn(orderService, 'configureAccount').mockRejectedValue(new Error('Usuario inactivo'));
    render(<CuentaCorrienteModal user={contractor} onClose={vi.fn()} />);
    const limit = await screen.findByLabelText('Cupo máximo (CLP)');
    fireEvent.change(limit, { target: { value: '80000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cuenta' }));
    expect(await screen.findByText('Usuario inactivo')).toBeInTheDocument();
    expect(limit).toHaveValue(80000);
  });
  it('muestra el error del catálogo y permite volver a consultar', async () => {
    vi.spyOn(productService, 'fetchProducts').mockRejectedValueOnce(new Error('Inventario no disponible')).mockResolvedValue([]);
    vi.spyOn(productService, 'fetchCategories').mockResolvedValue([]);
    render(<MemoryRouter><AuthProvider><Products /></AuthProvider></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Inventario no disponible');
    expect(screen.queryAllByTestId(/^product-card-/)).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText(/Catálogo de Materiales/)).toBeInTheDocument();
    expect(screen.queryAllByTestId(/^product-card-/)).toHaveLength(0);
  });
  it.each([[1, false], [2, true]])('el perfil %s respeta permisos de estado de pedidos', async (id, disabled) => {
    serverSession(id);
    vi.spyOn(productService, 'fetchProducts').mockResolvedValue([]);
    vi.spyOn(productService, 'fetchCategories').mockResolvedValue([]);
    vi.spyOn(productService, 'fetchCriticalStock').mockResolvedValue([]);
    vi.spyOn(orderService, 'getOrders').mockResolvedValue([{ id: 9, codigoOrden: 'LM-9', customerName: 'Cliente', customerEmail: 'cliente@gmail.com', fechaLegible: '05/11/2026', estado: 'CONFIRMADO', totalMonto: 10000 }]);
    const change = vi.spyOn(orderService, 'updateOrderStatus').mockResolvedValue({ id: 9, estado: 'EN_PREPARACION' });
    render(<MemoryRouter initialEntries={['/admin/pedidos']}><AuthProvider><AdminDashboard /></AuthProvider></MemoryRouter>);
    const selector = await screen.findByLabelText('Estado del pedido LM-9');
    expect(selector.disabled).toBe(disabled);
    if (!disabled) {
      fireEvent.change(selector, { target: { value: 'EN_PREPARACION' } });
      await waitFor(() => expect(change).toHaveBeenCalledWith(9, 'EN_PREPARACION'));
    } else expect(change).not.toHaveBeenCalled();
  });
});
