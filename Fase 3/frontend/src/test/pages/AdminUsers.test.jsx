import React from 'react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AuthProvider } from '../../context/AuthContext';
import { userApiService } from '../../services/userApiService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { serverSession, serverUsers } from '../helpers/serverSession';

beforeEach(() => {
  localStorage.clear();
  serverSession(1);
  vi.spyOn(userApiService, 'getUsers').mockResolvedValue(serverUsers);
  vi.spyOn(productService, 'fetchProducts').mockResolvedValue(productService.getProducts());
  vi.spyOn(productService, 'fetchCriticalStock').mockResolvedValue([]);
  vi.spyOn(productService, 'fetchCategories').mockResolvedValue([]);
  vi.spyOn(orderService, 'getOrders').mockResolvedValue([]);
});
afterEach(() => vi.restoreAllMocks());

function renderUsers() {
  render(<MemoryRouter initialEntries={['/admin/usuarios']}><AuthProvider>
    <AdminDashboard />
  </AuthProvider></MemoryRouter>);
}

describe('Mantenedor de usuarios conectado', () => {
  it('conserva el formulario y el listado si el servidor rechaza la creación', async () => {
    vi.spyOn(userApiService, 'createUser').mockRejectedValue(new Error('El RUN ya está registrado.'));
    renderUsers();
    const nuevo = await screen.findByRole('button', { name: /Nuevo Usuario/i });
    await waitFor(() => expect(nuevo).toBeEnabled());
    fireEvent.click(nuevo);
    fireEvent.change(screen.getByPlaceholderText('11222333-9'), { target: { value: '12345678-5' } });
    fireEvent.change(screen.getByPlaceholderText('Carlos'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText('Vega Osorio'), { target: { value: 'Rojas' } });
    fireEvent.change(screen.getByPlaceholderText('admin@duoc.cl'), { target: { value: 'ana@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'clave123' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar Usuario/i }));
    expect(await screen.findByText('El RUN ya está registrado.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Carlos')).toHaveValue('Ana');
    expect(screen.getByRole('button', { name: /Guardar Usuario/i })).toBeEnabled();
    expect(screen.queryByText('Usuario "Ana" registrado exitosamente.')).not.toBeInTheDocument();
  });

  it('envía un perfil completo al cambiar de rol y refleja la desactivación confirmada', async () => {
    const actualizado = { ...serverUsers[3], rol: 'VENDEDOR' };
    const update = vi.spyOn(userApiService, 'updateUser').mockResolvedValue(actualizado);
    const deactivate = vi.spyOn(userApiService, 'deleteUser').mockResolvedValue(null);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderUsers();
    const correo = await screen.findByText('cliente@gmail.com');
    const fila = correo.closest('tr');
    fireEvent.change(within(fila).getByRole('combobox'), { target: { value: 'VENDEDOR' } });
    await waitFor(() => expect(update).toHaveBeenCalledWith(4, expect.objectContaining({
      nombre: 'Andrea', run: '18333444-1', rol: 'VENDEDOR'
    })));
    await waitFor(() => expect(within(fila).getByRole('button', { name: 'Desactivar usuario' })).toBeEnabled());
    fireEvent.click(within(fila).getByRole('button', { name: 'Desactivar usuario' }));
    await waitFor(() => expect(deactivate).toHaveBeenCalledWith(4));
    expect(await within(fila).findByText('Inactivo')).toBeInTheDocument();
  });
});
