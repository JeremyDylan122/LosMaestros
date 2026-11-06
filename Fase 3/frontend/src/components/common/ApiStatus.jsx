import React from 'react';

export function ApiStatus({ loading, error, onRetry }) {
  if (loading) return <p role="status">Cargando datos...</p>;
  if (!error) return null;
  return <div className="alert-tactile alert-tactile-danger" role="alert">
    <span>{error.message || error}</span>
    {onRetry && <button type="button" className="btn-tactile btn-tactile-sm" onClick={onRetry}>Reintentar</button>}
  </div>;
}
