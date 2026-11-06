import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AUTH_TOKEN_KEY, userApiService } from '../services/userApiService';
import { storageService } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(Boolean(token));
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [revision, setRevision] = useState(0);
  const validatedToken = useRef(null);

  const logout = () => {
    validatedToken.current = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
    setSessionError('');
  };

  const refreshUser = () => setRevision(previous => previous + 1);

  useEffect(() => {
    // Las sesiones locales anteriores requieren iniciar sesión en el servidor.
    storageService.remove('current_user');
    let active = true;
    if (!token) {
      setInitializing(false);
      return;
    }
    // Al recuperar el foco se consulta en segundo plano, sin desmontar la ruta.
    const background = validatedToken.current === token;
    if (!background) setInitializing(true);
    userApiService.getProfile(token).then(profile => {
      if (active) {
        validatedToken.current = token;
        setUser(previous => JSON.stringify(previous) === JSON.stringify(profile) ? previous : profile);
        setSessionError('');
      }
    }).catch(error => {
      if (active && !background && error.status !== 401) setSessionError(error.message);
    }).finally(() => {
      if (active) setInitializing(false);
    });
    return () => { active = false; };
  }, [token, revision]);

  useEffect(() => {
    const expired = event => {
      if (event.detail === localStorage.getItem(AUTH_TOKEN_KEY)) logout();
    };
    const sync = event => {
      if (event.key !== AUTH_TOKEN_KEY && event.key !== null) return;
      if (localStorage.getItem(AUTH_TOKEN_KEY) === validatedToken.current) return;
      validatedToken.current = null;
      setUser(null);
      setSessionError('');
      setInitializing(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));
      setToken(localStorage.getItem(AUTH_TOKEN_KEY));
      refreshUser();
    };
    const focus = () => refreshUser();
    window.addEventListener('auth-expired', expired);
    window.addEventListener('storage', sync);
    window.addEventListener('focus', focus);
    return () => {
      window.removeEventListener('auth-expired', expired);
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', focus);
    };
  }, []);

  const startSession = async (operation, allowedRoles) => {
    setLoading(true);
    try {
      const session = await operation();
      if (!session?.token || !session.usuario?.id || !session.usuario.rol) {
        throw new Error('No se pudo iniciar la sesión. Intenta nuevamente.');
      }
      if (allowedRoles && !allowedRoles.includes(session.usuario.rol)) {
        throw new Error('Esta cuenta no tiene permisos de Administrador o Vendedor.');
      }
      localStorage.setItem(AUTH_TOKEN_KEY, session.token);
      validatedToken.current = session.token;
      setUser(session.usuario);
      setToken(session.token);
      setSessionError('');
      return { success: true, user: session.usuario };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    initializing,
    sessionError,
    login: (email, password, allowedRoles = null) => startSession(() => userApiService.login(email, password), allowedRoles),
    register: data => startSession(() => userApiService.register(data)),
    logout,
    refreshUser,
    isAuthenticated: Boolean(user),
    isAdmin: user?.rol === 'ADMIN',
    isVendor: user?.rol === 'VENDEDOR' || user?.rol === 'ADMIN',
    isContractor: user?.rol === 'CONTRATISTA',
    userRole: user?.rol || 'GUEST'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  return context;
};
