import { vi } from 'vitest';
import { initialUsers } from '../../data/initialUsers';
import { userApiService } from '../../services/userApiService';

export const serverUsers = initialUsers.map(user => {
  const { passwordHash: _hash, passwordSalt: _salt, cuentaCorrienteActiva: _cuenta,
    creditoMaximo: _credito, saldoPendiente: _saldo, ...profile } = user;
  return { ...profile, activo: true };
});

export function serverSession(id) {
  const profile = serverUsers.find(user => user.id === id);
  localStorage.setItem('auth_token', `token-${id}`);
  vi.spyOn(userApiService, 'getProfile').mockResolvedValue(profile);
  return profile;
}
