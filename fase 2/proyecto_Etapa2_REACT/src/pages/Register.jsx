import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { chileLocations } from '../data/chileLocations';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'CLIENTE', // CLIENTE o CONTRATISTA
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    direccion: '',
    empresa: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const availableComunas = chileLocations[formData.region] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      const newComunas = chileLocations[value] || [];
      setFormData(prev => ({
        ...prev,
        region: value,
        comuna: newComunas[0] || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};

    // 1. RUN
    const runVal = userService.validateRun(formData.run);
    if (!runVal.isValid) {
      errs.run = runVal.message;
    }

    // 2. Nombre: Requerido, máx 50
    if (!formData.nombre.trim()) {
      errs.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.trim().length > 50) {
      errs.nombre = 'El nombre no puede exceder 50 caracteres.';
    }

    // 3. Apellidos: Requerido, máx 100
    if (!formData.apellidos.trim()) {
      errs.apellidos = 'Los apellidos son obligatorios.';
    } else if (formData.apellidos.trim().length > 100) {
      errs.apellidos = 'Los apellidos no pueden exceder 100 caracteres.';
    }

    // 4. Correo: Requerido, dominios permitidos, máx 100
    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!userService.validateEmail(formData.email)) {
      errs.email = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com (máx 100 caracteres).';
    }

    // 5. Contraseña: 4 a 10 caracteres
    if (!formData.password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 4 || formData.password.length > 10) {
      errs.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }

    // 6. Región y Comuna
    if (!formData.region) errs.region = 'Debes seleccionar una región.';
    if (!formData.comuna) errs.comuna = 'Debes seleccionar una comuna.';

    // 7. Dirección: Requerido, máx 300
    if (!formData.direccion.trim()) {
      errs.direccion = 'La dirección es obligatoria.';
    } else if (formData.direccion.trim().length > 300) {
      errs.direccion = 'La dirección no puede exceder los 300 caracteres.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    const result = register({
      run: formData.run,
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      email: formData.email,
      password: formData.password,
      rol: formData.rol,
      region: formData.region,
      comuna: formData.comuna,
      direccion: formData.direccion,
      empresa: formData.empresa,
      cuentaCorrienteActiva: formData.rol === 'CONTRATISTA',
      creditoMaximo: formData.rol === 'CONTRATISTA' ? 2500000 : 0,
      saldoPendiente: 0
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '680px' }}>
      <div className="bento-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: 'var(--color-primary)',
            border: 'var(--border-tactile)',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '0.75rem'
          }}>
            <UserPlus size={28} color="var(--color-secondary)" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.35rem' }}>
            Registro de Usuario
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Crea tu cuenta como Cliente Particular o Contratista con línea de crédito
          </p>
        </div>

        {serverError && (
          <div className="alert-tactile alert-tactile-danger">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {success && (
          <div className="alert-tactile alert-tactile-success">
            <CheckCircle2 size={18} />
            <span>¡Cuenta creada con éxito! Redirigiendo a la tienda...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate data-testid="register-form">
          {/* TIPO DE CUENTA */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="label-tactile">Tipo de Perfil *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                border: 'var(--border-tactile)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: formData.rol === 'CLIENTE' ? 'var(--color-primary)' : 'var(--bg-surface)',
                cursor: 'pointer',
                fontWeight: 800
              }}>
                <input
                  type="radio"
                  name="rol"
                  value="CLIENTE"
                  checked={formData.rol === 'CLIENTE'}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px' }}
                />
                Cliente Particular
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                border: 'var(--border-tactile)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: formData.rol === 'CONTRATISTA' ? 'var(--color-contractor)' : 'var(--bg-surface)',
                color: formData.rol === 'CONTRATISTA' ? '#ffffff' : 'inherit',
                cursor: 'pointer',
                fontWeight: 800
              }}>
                <input
                  type="radio"
                  name="rol"
                  value="CONTRATISTA"
                  checked={formData.rol === 'CONTRATISTA'}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px' }}
                />
                Contratista / Maestro
              </label>
            </div>
          </div>

          {/* RUN */}
          <div className="form-group">
            <label htmlFor="reg-run" className="label-tactile">
              RUN Chileno * (Sin puntos ni guión, ej: 19011022K)
            </label>
            <input
              id="reg-run"
              name="run"
              type="text"
              className={`input-tactile ${errors.run ? 'input-error' : ''}`}
              placeholder="19011022K"
              value={formData.run}
              onChange={handleChange}
              maxLength={9}
            />
            {errors.run && <span className="error-text"><AlertCircle size={13} /> {errors.run}</span>}
          </div>

          {/* NOMBRE Y APELLIDOS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="reg-nombre" className="label-tactile">Nombre *</label>
              <input
                id="reg-nombre"
                name="nombre"
                type="text"
                className={`input-tactile ${errors.nombre ? 'input-error' : ''}`}
                placeholder="Ej. Roberto"
                value={formData.nombre}
                onChange={handleChange}
                maxLength={50}
              />
              {errors.nombre && <span className="error-text"><AlertCircle size={13} /> {errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="reg-apellidos" className="label-tactile">Apellidos *</label>
              <input
                id="reg-apellidos"
                name="apellidos"
                type="text"
                className={`input-tactile ${errors.apellidos ? 'input-error' : ''}`}
                placeholder="Ej. Muñoz Vega"
                value={formData.apellidos}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.apellidos && <span className="error-text"><AlertCircle size={13} /> {errors.apellidos}</span>}
            </div>
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="reg-email" className="label-tactile">
              Correo Electrónico * (@duoc.cl, @profesor.duoc.cl, @gmail.com)
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className={`input-tactile ${errors.email ? 'input-error' : ''}`}
              placeholder="usuario@duoc.cl o usuario@gmail.com"
              value={formData.email}
              onChange={handleChange}
              maxLength={100}
            />
            {errors.email && <span className="error-text"><AlertCircle size={13} /> {errors.email}</span>}
          </div>

          {/* CONTRASEÑA Y CONFIRMACIÓN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="reg-password" className="label-tactile">Contraseña * (4 a 10 car.)</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className={`input-tactile ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.password && <span className="error-text"><AlertCircle size={13} /> {errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm" className="label-tactile">Repetir Contraseña *</label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                className={`input-tactile ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.confirmPassword && <span className="error-text"><AlertCircle size={13} /> {errors.confirmPassword}</span>}
            </div>
          </div>

          {/* REGIÓN Y COMUNA EN CASCADA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="reg-region" className="label-tactile">Región *</label>
              <select
                id="reg-region"
                name="region"
                className="select-tactile"
                value={formData.region}
                onChange={handleChange}
              >
                {Object.keys(chileLocations).map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg-comuna" className="label-tactile">Comuna *</label>
              <select
                id="reg-comuna"
                name="comuna"
                className="select-tactile"
                value={formData.comuna}
                onChange={handleChange}
              >
                {availableComunas.map(com => (
                  <option key={com} value={com}>{com}</option>
                ))}
              </select>
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div className="form-group">
            <label htmlFor="reg-direccion" className="label-tactile">Dirección de Despacho o Faena *</label>
            <input
              id="reg-direccion"
              name="direccion"
              type="text"
              className={`input-tactile ${errors.direccion ? 'input-error' : ''}`}
              placeholder="Calle, Número, Población o Lote de Faena"
              value={formData.direccion}
              onChange={handleChange}
              maxLength={300}
            />
            {errors.direccion && <span className="error-text"><AlertCircle size={13} /> {errors.direccion}</span>}
          </div>

          {formData.rol === 'CONTRATISTA' && (
            <div className="form-group">
              <label htmlFor="reg-empresa" className="label-tactile">Razón Social o Constructora (Opcional)</label>
              <input
                id="reg-empresa"
                name="empresa"
                type="text"
                className="input-tactile"
                placeholder="Ej. Constructora Elqui SpA"
                value={formData.empresa}
                onChange={handleChange}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-tactile btn-tactile-primary btn-tactile-block"
            style={{ marginTop: '1.25rem', padding: '0.85rem' }}
          >
            <UserPlus size={18} /> Crear Cuenta
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ¿Ya tienes una cuenta registrada?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'underline' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
