import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, initializing, sessionError, refreshUser } = useAuth();
  const location = useLocation();

  if (initializing) return <p role="status">Comprobando sesión...</p>;
  if (sessionError) return <div className="container page-container">
    <p role="alert">{sessionError}</p>
    <button type="button" className="btn-tactile" onClick={refreshUser}>Reintentar</button>
  </div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.rol)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
