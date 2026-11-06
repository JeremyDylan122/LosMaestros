import React from 'react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';
import { MyOrders } from '../../pages/MyOrders';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { storageService } from '../../services/storageService';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { userApiService } from '../../services/userApiService';
import { serverSession, serverUsers } from '../helpers/serverSession';

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  vi.spyOn(productService, 'fetchProducts').mockResolvedValue([]);
  vi.spyOn(productService, 'fetchCriticalStock').mockResolvedValue([]);
  vi.spyOn(productService, 'fetchCategories').mockResolvedValue([]);
  vi.spyOn(orderService, 'getOrders').mockResolvedValue([]);
});
afterEach(() => vi.restoreAllMocks());

function protectedView(element, roles = ['ADMIN'], path = '/admin/usuarios') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><Routes>
    <Route path={path} element={<ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>} />
    <Route path="/login" element={<h1>Acceder</h1>} />
    <Route path="/" element={<h1>Inicio público</h1>} />
  </Routes></AuthProvider></MemoryRouter>);
}

describe('Acceso con sesión validada por Usuarios', () => {
  it('descarta la sesión local de fase 2 y redirige a login', () => {
    storageService.set('current_user', { id: 1, rol: 'ADMIN' });
    protectedView(<h1>Privado</h1>);
    expect(screen.getByText('Acceder')).toBeInTheDocument();
  });

  it('bloquea al cliente en administración según el perfil del servidor', async () => {
    serverSession(4);
    protectedView(<h1>Privado</h1>);
    expect(screen.getByRole('status')).toHaveTextContent('Comprobando sesión');
    expect(await screen.findByText('Inicio público')).toBeInTheDocument();
  });

  it('muestra el historial devuelto para la sesión del titular', async () => {
    serverSession(4);
    vi.spyOn(orderService, 'getOrders').mockResolvedValue([{ id: 12, codigoOrden: 'LM-0001', fechaLegible: '01/11/2026', estado: 'CONFIRMADO', totalMonto: 10000, estadoPago: 'PAGADO_SIMULADO' }]);
    protectedView(<MyOrders />, [], '/mis-pedidos');
    expect(await screen.findByText('LM-0001')).toBeInTheDocument();
    expect(orderService.getOrders).toHaveBeenCalledOnce();
  });

  it('rechaza RUN inválido desde el formulario administrativo', async () => {
    serverSession(1);
    vi.spyOn(userApiService, 'getUsers').mockResolvedValue(serverUsers);
    protectedView(<AdminDashboard />);
    const nuevo = await screen.findByRole('button', { name: /nuevo usuario/i });
    await waitFor(() => expect(nuevo).toBeEnabled());
    fireEvent.click(nuevo);
    const run = screen.getByPlaceholderText('11222333-9');
    fireEvent.change(run, { target: { value: '12345678-0' } });
    fireEvent.submit(run.closest('form'));
    expect(screen.getByText(/El RUN ingresado no es válido/)).toBeInTheDocument();
  });

  it('conserva el token ante una falla de red y permite revalidar', async () => {
    localStorage.setItem('auth_token', 'token-1');
    vi.spyOn(userApiService, 'getProfile').mockRejectedValueOnce(new Error('Sin conexión.'))
      .mockResolvedValueOnce(serverUsers[0]);
    protectedView(<h1>Privado</h1>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Sin conexión.');
    expect(localStorage.getItem('auth_token')).toBe('token-1');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Privado')).toBeInTheDocument();
  });
});
