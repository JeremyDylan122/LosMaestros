import React from 'react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '../../pages/Register';
import { AuthProvider } from '../../context/AuthContext';
import { userApiService } from '../../services/userApiService';

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

function completeForm() {
  render(<MemoryRouter><AuthProvider><Register /></AuthProvider></MemoryRouter>);
  fireEvent.click(screen.getByLabelText(/Contratista \/ Maestro/));
  for (const [label, value] of [
    [/RUN Chileno/, '12345678-5'], [/^Nombre/, 'Ana'], [/^Apellidos/, 'Rojas'],
    [/Correo Electrónico/, 'ana@gmail.com'], [/^Contraseña/, 'clave123'],
    [/Repetir Contraseña/, 'clave123'], [/Dirección de Despacho/, 'Calle de prueba 123']
  ]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.submit(screen.getByTestId('register-form'));
}

describe('Registro conectado', () => {
  it('crea sesión con el token del servidor sin habilitar crédito en el formulario', async () => {
    const profile = { id: 8, nombre: 'Ana', rol: 'CONTRATISTA', activo: true };
    const register = vi.spyOn(userApiService, 'register').mockResolvedValue({ token: 'token-nuevo', usuario: profile });
    vi.spyOn(userApiService, 'getProfile').mockResolvedValue(profile);
    completeForm();
    expect(await screen.findByText(/¡Cuenta creada con éxito!/)).toBeInTheDocument();
    expect(localStorage.getItem('auth_token')).toBe('token-nuevo');
    expect(register).toHaveBeenCalledWith(expect.objectContaining({ rol: 'CONTRATISTA', run: '12345678-5' }));
    expect(register.mock.calls[0][0]).not.toHaveProperty('creditoMaximo');
    expect(register.mock.calls[0][0]).not.toHaveProperty('cuentaCorrienteActiva');
  });

  it('muestra el rechazo de registro y conserva los campos para corregirlos', async () => {
    vi.spyOn(userApiService, 'register').mockRejectedValue(new Error('El correo ya está registrado.'));
    completeForm();
    expect(await screen.findByText('El correo ya está registrado.')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nombre/)).toHaveValue('Ana');
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(screen.getByRole('button', { name: /Crear Cuenta/ })).toBeEnabled();
  });
});
