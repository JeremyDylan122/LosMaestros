import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { storageService } from '../services/storageService';

const AuthContext = createContext();

const CURRENT_USER_KEY = 'current_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return storageService.get(CURRENT_USER_KEY, null);
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
  const login = (email, password) => {
    setLoading(true);
    try {
      const authenticatedUser = userService.authenticate(email, password);
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
  const register = (userData) => {
    setLoading(true);
    try {
      const newUser = userService.createUser(userData);
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
      if (updated) {
        const { password: _, ...safe } = updated;
        setUser(safe);
      }
    }
  };

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
