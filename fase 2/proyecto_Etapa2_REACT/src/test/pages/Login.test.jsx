import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../../pages/Login';
import { AuthProvider } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Página de Inicio de Sesión (Login)', () => {
  beforeEach(() => {
    storageService.clearAll();
  });

  it('debe renderizar los inputs de correo, contraseña y los botones demo', () => {
    renderLogin();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar al Sistema/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Administrador/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vendedor/i })).toBeInTheDocument();
  });

  it('debe mostrar errores cuando los campos se envían vacíos', () => {
    renderLogin();
    const submitBtn = screen.getByRole('button', { name: /Ingresar al Sistema/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/La contraseña es obligatoria/i)).toBeInTheDocument();
  });

  it('debe autocompletar las credenciales al hacer clic en el botón demo de Administrador', () => {
    renderLogin();
    const adminDemoBtn = screen.getByRole('button', { name: /Administrador/i });
    fireEvent.click(adminDemoBtn);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passInput = screen.getByLabelText(/Contraseña/i);

    expect(emailInput.value).toBe('admin@duoc.cl');
    expect(passInput.value).toBe('admin123');
  });
});
