import { credentialService } from '../services/credentialService';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { storageService } from '../services/storageService';

const AuthContext = createContext();

const CURRENT_USER_KEY = 'current_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = storageService.get(CURRENT_USER_KEY, null);
    return cached?.id ? credentialService.safe(userService.getUserById(cached.id)) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      storageService.set(CURRENT_USER_KEY, user);
    } else {
      storageService.remove(CURRENT_USER_KEY);
    }
  }, [user]);

  /**
   * Inicia sesión con credenciales
   */
  const login = async (email, password, allowedRoles = null) => {
    setLoading(true);
    try {
      const authenticatedUser = await userService.authenticate(email, password);
      if (allowedRoles && !allowedRoles.includes(authenticatedUser.rol)) {
        throw new Error('Esta cuenta no tiene permisos de Administrador o Vendedor.');
      }
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la sesión activa
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Registra una nueva cuenta de usuario
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await userService.createUser(userData);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza el perfil del usuario actual (ej. saldo de cuenta corriente)
   */
  const refreshUser = () => {
    if (user && user.id) {
      const updated = userService.getUserById(user.id);
      setUser(credentialService.safe(updated));
    }
  };

  // Revalidar la sesión local al volver a la pestaña o al cambiar datos desde otra.
  useEffect(() => {
    const sync = () => {
      const cached = storageService.get(CURRENT_USER_KEY, null);
      setUser(cached?.id ? credentialService.safe(userService.getUserById(cached.id)) : null);
    };
    window.addEventListener('focus', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('focus', sync); window.removeEventListener('storage', sync); };
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    refreshUser,
    isAuthenticated: Boolean(user),
    isAdmin: user?.rol === 'ADMIN',
    isVendor: user?.rol === 'VENDEDOR' || user?.rol === 'ADMIN',
    isContractor: user?.rol === 'CONTRATISTA',
    userRole: user?.rol || 'GUEST'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
