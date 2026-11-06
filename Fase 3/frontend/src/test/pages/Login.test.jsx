import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../../pages/Login';
import { AuthProvider } from '../../context/AuthContext';
import { userApiService } from '../../services/userApiService';

const renderLogin = () => render(<BrowserRouter><AuthProvider><Login /></AuthProvider></BrowserRouter>);

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('Login con Usuarios', () => {
  it('muestra el formulario de acceso', () => {
    renderLogin();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar al Sistema/i })).toBeInTheDocument();
  });

  it('valida los campos antes de enviar', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /Ingresar al Sistema/i }));
    expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/La contraseña es obligatoria/i)).toBeInTheDocument();
  });

  it('muestra el error del servidor y permite reintentar sin crear una sesión local', async () => {
    vi.spyOn(userApiService, 'login').mockRejectedValue(new Error('Credenciales inválidas.'));
    renderLogin();
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'admin@duoc.cl' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'error123' } });
    fireEvent.submit(screen.getByLabelText(/Contraseña/i).closest('form'));
    expect(await screen.findByText('Credenciales inválidas.')).toBeInTheDocument();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(screen.getByRole('button', { name: /Ingresar al Sistema/i })).toBeEnabled();
  });
});
