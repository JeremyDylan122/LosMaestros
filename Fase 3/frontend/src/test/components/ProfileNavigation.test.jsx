import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { CoverageMap } from '../../components/common/CoverageMap';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { storageService } from '../../services/storageService';

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
function SessionProbe() {
  const { user } = useAuth();
  return <output data-testid="active-session">{user?.email || 'visitante'}</output>;
}
function renderNavbar() {
  return render(<MemoryRouter><AuthProvider><CartProvider><Navbar /><SessionProbe /></CartProvider></AuthProvider></MemoryRouter>);
}

describe('Acceso administrativo y navegación por perfil', () => {
  it('rechaza una cuenta de cliente sin iniciar una sesión desde el modal administrativo', async () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Acceder a Administración' }));
    fireEvent.change(screen.getByLabelText('Correo Operativo'), { target: { value: 'cliente@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña de Seguridad'), { target: { value: 'clie123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar al Panel de Operaciones' }));
    expect(await screen.findByText(/Esta cuenta no tiene permisos/)).toBeInTheDocument();
    expect(screen.getByTestId('active-session')).toHaveTextContent('visitante');
    expect(storageService.get('current_user')).toBeNull();
  });
  it('conserva la cuenta contratista si se rechaza otro perfil en el modal', async () => {
    storageService.set('current_user', { id: 3 });
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Acceder a Administración' }));
    fireEvent.change(screen.getByLabelText('Correo Operativo'), { target: { value: 'cliente@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña de Seguridad'), { target: { value: 'clie123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar al Panel de Operaciones' }));
    expect(await screen.findByText(/Esta cuenta no tiene permisos/)).toBeInTheDocument();
    expect(screen.getByTestId('active-session')).toHaveTextContent('contratista@duoc.cl');
  });
  it('mantiene el acceso de vendedor desde las cuentas de demostración', async () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Acceder a Administración' }));
    fireEvent.click(screen.getByRole('button', { name: /Ricardo Valdés/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByTestId('active-session')).toHaveTextContent('vendedor@duoc.cl');
  });
  it('incluye el historial del contratista en el menú móvil y cierra el menú al elegirlo', () => {
    storageService.set('current_user', { id: 3 });
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú móvil' }));
    const menu = screen.getByRole('navigation', { name: 'Navegación móvil' });
    fireEvent.click([...menu.querySelectorAll('a')].find(link => link.textContent === 'Mis pedidos'));
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menú móvil' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Coherencia de cobertura y tarifas', () => {
  it('sincroniza comuna, zona y tarifa al seleccionar Valle de Elqui', () => {
    render(<CoverageMap />);
    fireEvent.click(screen.getByRole('button', { name: 'Valle de Elqui', exact: true }));
    expect(screen.getByLabelText('Consultar comuna')).toHaveValue('Vicuña');
    expect(screen.getByRole('status')).toHaveTextContent('$14.990');
    expect(screen.getByRole('button', { name: 'Valle de Elqui', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
  it('comunica cotización sin ofrecer una tarifa automática para otras comunas', () => {
    render(<CoverageMap />);
    fireEvent.change(screen.getByLabelText('Consultar comuna'), { target: { value: 'Illapel' } });
    expect(screen.getByRole('button', { name: 'Otras comunas', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Solicitar cotización');
    expect(screen.getByRole('status')).not.toHaveTextContent('$0');
  });
  it('permite elegir una comuna desde el esquema y actualizar la tarifa urbana', () => {
    render(<CoverageMap />);
    fireEvent.click(screen.getByRole('button', { name: 'Valle de Elqui', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Consultar despacho a Coquimbo' }));
    expect(screen.getByLabelText('Consultar comuna')).toHaveValue('Coquimbo');
    expect(screen.getByRole('status')).toHaveTextContent('$4.990');
    expect(screen.getByRole('button', { name: 'Zona urbana', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
});
