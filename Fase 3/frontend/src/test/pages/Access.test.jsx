import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';
import { MyOrders } from '../../pages/MyOrders';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { storageService } from '../../services/storageService';
import { orderService } from '../../services/orderService';

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
const session = id => storageService.set('current_user', { id, rol: 'ADMIN' });
function protectedView(element, roles = ['ADMIN'], path = '/admin/usuarios') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><Routes>
    <Route path={path} element={<ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>} />
    <Route path="/login" element={<h1>Acceder</h1>} />
    <Route path="/" element={<h1>Inicio público</h1>} />
  </Routes></AuthProvider></MemoryRouter>);
}

describe('Acceso a vistas y gestión de usuarios', () => {
  it('redirige a login cuando no hay sesión', () => {
    protectedView(<h1>Privado</h1>);
    expect(screen.getByText('Acceder')).toBeInTheDocument();
  });
  it('revalida el rol guardado y bloquea a un cliente en administración', () => {
    session(4);
    protectedView(<h1>Privado</h1>);
    expect(screen.getByText('Inicio público')).toBeInTheDocument();
  });
  it('muestra únicamente el historial del titular', () => {
    session(4);
    orderService.createOrder({ userId: 4, items: [{ id: 1, cantidad: 1 }], paymentMethod: 'WEBPAY_SIMULADO' });
    orderService.createOrder({ userId: 3, items: [{ id: 1, cantidad: 1 }], paymentMethod: 'WEBPAY_SIMULADO' });
    protectedView(<MyOrders />, [], '/mis-pedidos');
    expect(screen.getByText(/0001$/)).toBeInTheDocument();
    expect(screen.queryByText(/0002$/)).not.toBeInTheDocument();
  });
  it('rechaza RUN inválido desde el formulario administrativo', () => {
    session(1);
    protectedView(<AdminDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /nuevo usuario/i }));
    const run = screen.getByPlaceholderText('11222333-9');
    fireEvent.change(run, { target: { value: '12345678-0' } });
    fireEvent.submit(run.closest('form'));
    expect(screen.getByText(/El RUN ingresado no es válido/)).toBeInTheDocument();
  });
});
