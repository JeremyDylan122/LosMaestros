import React, { useState } from 'react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { userApiService } from '../../services/userApiService';
import { serverSession } from '../helpers/serverSession';

function Probe() {
  const { user, initializing, logout } = useAuth();
  return <div>
    <output>{initializing ? 'Validando' : user?.email || 'Visitante'}</output>
    <button onClick={logout}>Salir</button>
  </div>;
}

function Draft() {
  const [value, setValue] = useState('');
  return <input aria-label="Borrador" value={value} onChange={event => setValue(event.target.value)} />;
}

function protectedDraft() {
  render(<MemoryRouter initialEntries={['/admin']}><AuthProvider><Routes>
    <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><Draft /></ProtectedRoute>} />
    <Route path="/" element={<p>Inicio público</p>} />
    <Route path="/login" element={<p>Iniciar sesión</p>} />
  </Routes></AuthProvider></MemoryRouter>);
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('Ciclo de sesión remota', () => {
  it('conserva el mismo formulario mientras revalida al recuperar el foco', async () => {
    const profile = serverSession(1);
    protectedDraft();
    const input = await screen.findByLabelText('Borrador');
    fireEvent.change(input, { target: { value: 'Datos sin guardar' } });
    let resolveProfile;
    userApiService.getProfile.mockReturnValueOnce(new Promise(resolve => { resolveProfile = resolve; }));
    fireEvent(window, new Event('focus'));
    await waitFor(() => expect(userApiService.getProfile).toHaveBeenCalledTimes(2));
    expect(screen.getByLabelText('Borrador')).toBe(input);
    expect(input).toHaveValue('Datos sin guardar');
    resolveProfile({ ...profile });
    await waitFor(() => expect(screen.getByLabelText('Borrador')).toHaveValue('Datos sin guardar'));
  });

  it('una falla de red durante la revalidación conserva la página y el token', async () => {
    serverSession(1);
    protectedDraft();
    const input = await screen.findByLabelText('Borrador');
    fireEvent.change(input, { target: { value: 'Edición pendiente' } });
    userApiService.getProfile.mockRejectedValueOnce(new Error('Sin conexión'));
    fireEvent(window, new Event('focus'));
    await waitFor(() => expect(userApiService.getProfile).toHaveBeenCalledTimes(2));
    expect(screen.getByLabelText('Borrador')).toBe(input);
    expect(input).toHaveValue('Edición pendiente');
    expect(localStorage.getItem('auth_token')).toBe('token-1');
  });

  it('los cambios de rol siguen restringiendo el acceso al revalidar', async () => {
    const profile = serverSession(1);
    protectedDraft();
    await screen.findByLabelText('Borrador');
    userApiService.getProfile.mockResolvedValueOnce({ ...profile, rol: 'CLIENTE' });
    fireEvent(window, new Event('focus'));
    expect(await screen.findByText('Inicio público')).toBeInTheDocument();
  });

  it('el cierre de sesión en otra pestaña retira el acceso a la página', async () => {
    serverSession(1);
    protectedDraft();
    await screen.findByLabelText('Borrador');
    localStorage.removeItem('auth_token');
    fireEvent(window, new StorageEvent('storage', { key: 'auth_token', oldValue: 'token-1', newValue: null }));
    expect(await screen.findByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('una sesión vencida al recuperar el foco sigue cerrándose', async () => {
    serverSession(1);
    protectedDraft();
    await screen.findByLabelText('Borrador');
    userApiService.getProfile.mockRestore();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));
    fireEvent(window, new Event('focus'));
    expect(await screen.findByText('Iniciar sesión')).toBeInTheDocument();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
  it('restaura el perfil desde el servidor y elimina el token al salir', async () => {
    serverSession(1);
    render(<MemoryRouter><AuthProvider><Probe /></AuthProvider></MemoryRouter>);
    expect(screen.getByText('Validando')).toBeInTheDocument();
    expect(await screen.findByText('admin@duoc.cl')).toBeInTheDocument();
    expect(userApiService.getProfile).toHaveBeenCalledWith('token-1');
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }));
    expect(await screen.findByText('Visitante')).toBeInTheDocument();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('el rechazo 401 del perfil elimina la sesión vencida', async () => {
    localStorage.setItem('auth_token', 'vencido');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));
    render(<MemoryRouter><AuthProvider><Probe /></AuthProvider></MemoryRouter>);
    await waitFor(() => expect(localStorage.getItem('auth_token')).toBeNull());
    expect(await screen.findByText('Visitante')).toBeInTheDocument();
  });
});
