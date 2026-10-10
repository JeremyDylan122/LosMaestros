import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { userService } from '../services/userService';

export const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    comentario: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar error al tipear
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};

    // 1. Nombre: Requerido, máx 100
    if (!formData.nombre.trim()) {
      errs.nombre = 'El nombre o razón social es obligatorio.';
    } else if (formData.nombre.trim().length > 100) {
      errs.nombre = 'El nombre no puede exceder los 100 caracteres.';
    }

    // 2. Correo: Requerido, máx 100, solo dominios permitidos
    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!userService.validateEmail(formData.email)) {
      errs.email = 'Ingresa un correo válido (máx 100 caracteres) con dominios permitidos: @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }

    // 3. Comentario: Requerido, máx 500
    if (!formData.comentario.trim()) {
      errs.comentario = 'El mensaje o consulta es obligatorio.';
    } else if (formData.comentario.trim().length > 500) {
      errs.comentario = 'El mensaje no puede superar los 500 caracteres.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        comentario: ''
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '1000px' }}>
      <div className="section-header">
        <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
          ATENCIÓN Y CUBICACIONES
        </span>
        <h1 className="section-title">
          <Mail size={30} /> Contacto y Cotización para Obras
        </h1>
        <p className="section-subtitle">
          Escríbenos para solicitar presupuestos por volumen, apertura de cuentas corrientes o despacho especial a faenas.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* FORMULARIO TÁCTIL */}
        <div className="bento-card" style={{ padding: '2rem' }}>
          {submitted && (
            <div className="alert-tactile alert-tactile-success" data-testid="contact-success-alert">
              <CheckCircle2 size={20} />
              <div>
                <strong>¡Mensaje enviado con éxito!</strong> Nuestro equipo comercial se comunicará contigo a la brevedad.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate data-testid="contact-form">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="contacto-nombre" className="label-tactile">
                Nombre Completo o Razón Social *
              </label>
              <input
                id="contacto-nombre"
                name="nombre"
                type="text"
                className={`input-tactile ${errors.nombre ? 'input-error' : ''}`}
                placeholder="Ej. Maestro Juan Pérez o Constructora del Norte"
                value={formData.nombre}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.nombre && <span className="error-text"><AlertCircle size={13} /> {errors.nombre}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="contacto-email" className="label-tactile">
                Correo Electrónico *
              </label>
              <input
                id="contacto-email"
                name="email"
                type="email"
                className={`input-tactile ${errors.email ? 'input-error' : ''}`}
                placeholder="ejemplo@duoc.cl o ejemplo@gmail.com"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.email && <span className="error-text"><AlertCircle size={13} /> {errors.email}</span>}
            </div>

            {/* Teléfono y Empresa (en 2 columnas) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="contacto-telefono" className="label-tactile">
                  Teléfono / WhatsApp
                </label>
                <input
                  id="contacto-telefono"
                  name="telefono"
                  type="tel"
                  className="input-tactile"
                  placeholder="+56 9 8765 4321"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contacto-empresa" className="label-tactile">
                  Faena u Obra
                </label>
                <input
                  id="contacto-empresa"
                  name="empresa"
                  type="text"
                  className="input-tactile"
                  placeholder="Ej. Faena San Joaquín Lote 4"
                  value={formData.empresa}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Comentario */}
            <div className="form-group">
              <label htmlFor="contacto-comentario" className="label-tactile">
                Materiales a Cotizar o Consulta * ({formData.comentario.length}/500)
              </label>
              <textarea
                id="contacto-comentario"
                name="comentario"
                className={`textarea-tactile ${errors.comentario ? 'input-error' : ''}`}
                rows={5}
                placeholder="Indica la lista de materiales, cantidades o especificaciones que requieres para tu proyecto..."
                value={formData.comentario}
                onChange={handleChange}
                maxLength={500}
              />
              {errors.comentario && <span className="error-text"><AlertCircle size={13} /> {errors.comentario}</span>}
            </div>

            <button type="submit" className="btn-tactile btn-tactile-primary btn-tactile-block" style={{ marginTop: '1rem' }}>
              <Send size={18} /> Enviar Solicitud de Cotización
            </button>
          </form>
        </div>

        {/* INFORMACIÓN DE MESÓN Y CONTACTO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="bento-card bento-card-primary" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 900 }}>
              Mesón Directo para Contratistas
            </h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: '#334155', marginBottom: '1rem' }}>
              Si necesitas cotizaciones inmediatas para licitaciones o cubicaciones de planos estructurales, 
              visítanos directamente en nuestro mesón de atención técnica.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
              <div>&bull; Av. Balmaceda 1420, La Serena</div>
              <div>&bull; Teléfono: +56 51 224 8900</div>
              <div>&bull; Horario: 07:30 a 18:30 hrs</div>
            </div>
          </div>

          <div className="bento-card bento-card-contractor" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 900 }}>
              ¿Buscas abrir Cuenta Corriente?
            </h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: '#1e3a8a', margin: 0 }}>
              Los maestros y constructoras registradas pueden acceder a líneas de crédito de hasta $3.500.000 
              con facturación a 30 días. Indica en el mensaje tu RUT y faenas activas para evaluación crediticia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
