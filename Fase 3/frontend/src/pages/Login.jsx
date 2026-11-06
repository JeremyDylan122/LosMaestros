import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!userService.validateEmail(email)) {
      errs.email = 'Solo se permiten correos con @duoc.cl, @profesor.duoc.cl o @gmail.com (máx 100 caracteres).';
    }

    if (!password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (password.length < 4 || password.length > 10) {
      errs.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    const result = await login(email, password);
    if (result.success) {
      // Si es admin o vendedor, redirigir al panel admin
      if (result.user.rol === 'ADMIN' || result.user.rol === 'VENDEDOR') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '540px' }}>
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
            <LogIn size={28} color="var(--color-secondary)" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.35rem' }}>
            Iniciar Sesión
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Ingresa a tu cuenta de Ferretería Los Maestros
          </p>
        </div>

        {error && (
          <div className="alert-tactile alert-tactile-danger" data-testid="login-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate data-testid="login-form">
          <div className="form-group">
            <label htmlFor="login-email" className="label-tactile">
              Correo Electrónico *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className={`input-tactile ${fieldErrors.email ? 'input-error' : ''}`}
                placeholder="ejemplo@duoc.cl"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
                }}
                maxLength={100}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
            </div>
            {fieldErrors.email && <span className="error-text"><AlertCircle size={13} /> {fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="label-tactile">
              Contraseña * (4 a 10 caracteres)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className={`input-tactile ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null }));
                }}
                maxLength={10}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Key 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
            </div>
            {fieldErrors.password && <span className="error-text"><AlertCircle size={13} /> {fieldErrors.password}</span>}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn-tactile btn-tactile-primary btn-tactile-block" 
            style={{ marginTop: '1.25rem', padding: '0.85rem' }}
          >
            <LogIn size={18} /> {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" style={{ color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'underline' }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
