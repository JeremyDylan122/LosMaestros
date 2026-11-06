import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { userApiService } from '../../services/userApiService';

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('Contrato HTTP de Usuarios', () => {
  it('envía registro público sin token ni campos de crédito', async () => {
    localStorage.setItem('auth_token', 'otra-sesion');
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      token: 'nuevo-token', usuario: { id: 5, rol: 'CONTRATISTA' }
    }), { status: 201 }));
    const result = await userApiService.register({
      run: '12345678-5', nombre: 'Ana', apellidos: 'Rojas', email: 'ana@gmail.com',
      password: 'clave123', rol: 'CONTRATISTA', creditoMaximo: 2500000, cuentaCorrienteActiva: true
    });
    expect(result.token).toBe('nuevo-token');
    const [url, request] = fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/v1\/auth\/registro$/);
    expect(request.headers.Authorization).toBeUndefined();
    expect(JSON.parse(request.body)).not.toHaveProperty('creditoMaximo');
    expect(JSON.parse(request.body)).not.toHaveProperty('cuentaCorrienteActiva');
  });

  it('envía el JWT a gestión y omite contraseña vacía al editar', async () => {
    localStorage.setItem('auth_token', 'jwt-actual');
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
    await userApiService.updateUser(7, { nombre: 'Ana', password: '', saldoPendiente: 999 });
    const [url, request] = fetch.mock.calls[0];
    expect(url).toMatch(/\/usuarios\/7$/);
    expect(request.method).toBe('PUT');
    expect(request.headers.Authorization).toBe('Bearer jwt-actual');
    expect(JSON.parse(request.body)).not.toHaveProperty('password');
    expect(JSON.parse(request.body)).not.toHaveProperty('saldoPendiente');
  });

  it('acepta 204 al desactivar sin intentar leer JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    await expect(userApiService.deleteUser(7)).resolves.toBeNull();
  });

  it('propaga el rechazo del servidor y evita una escritura local de respaldo', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      mensaje: 'El correo o RUN ya está registrado.'
    }), { status: 409 }));
    await expect(userApiService.createUser({ nombre: 'Ana' })).rejects.toThrow('ya está registrado');
    expect(localStorage.getItem('los_maestros_users')).toBeNull();
  });

  it('comunica caída de red y conserva la sesión para reintentar', async () => {
    localStorage.setItem('auth_token', 'jwt-actual');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(userApiService.getUsers()).rejects.toThrow('No se pudo conectar');
    expect(localStorage.getItem('auth_token')).toBe('jwt-actual');
  });
});
