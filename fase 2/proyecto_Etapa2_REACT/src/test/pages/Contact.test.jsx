import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Contact } from '../../pages/Contact';

describe('Página de Contacto y Cotizaciones (Contact)', () => {
  it('debe renderizar los campos del formulario de contacto', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/Nombre Completo o Razón Social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Materiales a Cotizar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar Solicitud/i })).toBeInTheDocument();
  });

  it('debe mostrar errores de validación condicionales cuando se envía el formulario vacío', () => {
    render(<Contact />);
    const submitBtn = screen.getByRole('button', { name: /Enviar Solicitud/i });

    fireEvent.click(submitBtn);

    expect(screen.getByText(/El nombre o razón social es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/El mensaje o consulta es obligatorio/i)).toBeInTheDocument();
  });

  it('debe mostrar error cuando el correo ingresado no pertenece a los dominios permitidos', () => {
    render(<Contact />);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'usuario@hotmail.com' } });

    const submitBtn = screen.getByRole('button', { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/dominios permitidos/i)).toBeInTheDocument();
  });

  it('debe procesar el formulario con éxito y mostrar la alerta de confirmación cuando los datos son válidos', () => {
    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/Nombre Completo o Razón Social/i), {
      target: { value: 'Don Juan Constructor' }
    });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), {
      target: { value: 'juan@duoc.cl' }
    });
    fireEvent.change(screen.getByLabelText(/Materiales a Cotizar/i), {
      target: { value: 'Necesito 50 sacos de cemento Polpaico para obra en La Serena.' }
    });

    const submitBtn = screen.getByRole('button', { name: /Enviar Solicitud/i });
    fireEvent.click(submitBtn);

    expect(screen.getByTestId('contact-success-alert')).toBeInTheDocument();
    expect(screen.getByText(/¡Mensaje enviado con éxito!/i)).toBeInTheDocument();
  });
});
