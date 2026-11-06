import React, { useCallback, useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { useApiData } from '../../hooks/useApiData';
import { ApiStatus } from '../common/ApiStatus';

export function CuentaCorrienteModal({ user, onClose }) {
  const load = useCallback(() => orderService.getAccount(user.id), [user.id]);
  const account = useApiData(load);
  const [activa, setActiva] = useState(false);
  const [creditoMaximo, setCreditoMaximo] = useState('0');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    setActiva(account.data?.activa ?? false);
    setCreditoMaximo(String(account.data?.creditoMaximo ?? 0));
  }, [account.data]);
  const save = async event => {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setMessage('');
    try {
      await orderService.configureAccount(user.id, { activa, creditoMaximo: Number(creditoMaximo) });
      setMessage('Cuenta corriente guardada.');
      account.reload();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  };
  return <div className="modal-overlay-tactile"><div className="bento-card" role="dialog" aria-modal="true" aria-labelledby="account-title" style={{ maxWidth: '500px', width: '95%', padding: '2rem' }}>
    <h2 id="account-title">Cuenta corriente: {user.nombre} {user.apellidos}</h2>
    <ApiStatus loading={account.loading} error={account.error} onRetry={account.reload} />
    {message && <p role="status">{message}</p>}
    {!account.loading && !account.error && <form onSubmit={save}>
      <p>Saldo pendiente: ${(account.data?.saldoPendiente ?? 0).toLocaleString('es-CL')}</p>
      <p>Crédito disponible: ${(account.data?.creditoDisponible ?? 0).toLocaleString('es-CL')}</p>
      <label className="label-tactile" htmlFor="account-limit">Cupo máximo (CLP)</label>
      <input id="account-limit" className="input-tactile" type="number" min={account.data?.saldoPendiente ?? 0} step="0.01" required value={creditoMaximo} onChange={event => setCreditoMaximo(event.target.value)} />
      <label><input type="checkbox" checked={activa} onChange={event => setActiva(event.target.checked)} /> Cuenta activa</label>
      <p>El saldo se actualiza con las compras y anulaciones.</p>
      <button type="submit" className="btn-tactile btn-tactile-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cuenta'}</button>
    </form>}
    <button type="button" className="btn-tactile" disabled={saving} onClick={onClose}>Cerrar</button>
  </div></div>;
}
