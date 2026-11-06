import { apiRequest } from './apiService';
const API_URL = (import.meta.env.VITE_API_USUARIOS_URL || 'http://localhost:8081/api/v1').replace(/\/$/, '');

export const AUTH_TOKEN_KEY = 'auth_token';

function request(path, options) {
  return apiRequest(API_URL + path, options);
}

function userData(data) {
  // El crédito pertenece a Ventas. Usuarios recibe solo los campos de su contrato.
  const { run, nombre, apellidos, email, password, rol, region, comuna, direccion, empresa } = data;
  return {
    run, nombre, apellidos, email, rol, region, comuna, direccion, empresa,
    ...(password ? { password } : {})
  };
}

export const userApiService = {
  login(email, password) {
    return request('/auth/login', { method: 'POST', data: { email, password }, token: null });
  },
  register(data) {
    return request('/auth/registro', { method: 'POST', data: userData(data), token: null });
  },
  getProfile(token) {
    return request('/usuarios/me', { token });
  },
  async getUsers() {
    const users = await request('/usuarios');
    if (!Array.isArray(users)) throw new Error('No se pudo leer el listado de usuarios. Intenta nuevamente.');
    return users;
  },
  createUser(data) {
    return request('/usuarios', { method: 'POST', data: userData(data) });
  },
  updateUser(id, data) {
    return request(`/usuarios/${id}`, { method: 'PUT', data: userData(data) });
  },
  deleteUser(id) {
    return request(`/usuarios/${id}`, { method: 'DELETE' });
  }
};
