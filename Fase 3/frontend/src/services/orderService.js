import { apiRequest } from './apiService';

const API_URL = import.meta.env.VITE_API_VENTAS_URL || 'http://localhost:8082/api/v1';
const request = (path, options) => apiRequest(API_URL + path, options);
const normalizeOrder = order => ({ ...order, fechaLegible: new Date(order.fecha).toLocaleString('es-CL') });
async function account(path) {
  try { return await request(path); }
  catch (error) { if (error.status === 404) return null; throw error; }
}

export const orderService = {
  async getOrders() {
    const orders = [];
    let page = 0, totalPages;
    do {
      const data = await request(`/pedidos?page=${page}&size=100`);
      const rows = Array.isArray(data) ? data : data.content;
      if (!Array.isArray(rows)) throw new Error('No se pudo leer los pedidos.');
      orders.push(...rows.map(normalizeOrder));
      totalPages = Array.isArray(data) ? page + 1 : data.totalPages;
      page++;
    } while (page < totalPages);
    return orders;
  },
  async getOrderById(id) { return normalizeOrder(await request(`/pedidos/${encodeURIComponent(id)}`)); },
  getOrderForViewer(id) { return this.getOrderById(id); },
  getOrdersByUserId() { return this.getOrders(); },
  async createOrder(data) {
    // Identidad, precios, stock y crédito se resuelven en Ventas.
    const { deliveryType, paymentMethod, customerName, customerEmail, region, commune, address, phone, empresa, notes } = data;
    const payload = { deliveryType, paymentMethod, customerName, customerEmail, region, commune, address, phone, empresa, notes,
      items: data.items.map(item => ({ id: Number(item.id), cantidad: Number(item.cantidad) })) };
    return normalizeOrder(await request('/pedidos', { method: 'POST', data: payload }));
  },
  async updateOrderStatus(id, estado) {
    return normalizeOrder(await request(`/pedidos/${id}/estado`, { method: 'PATCH', data: { estado } }));
  },
  getMyAccount() { return account('/cuentas-corrientes/me'); },
  getAccount(id) { return account(`/cuentas-corrientes/${id}`); },
  configureAccount(id, data) { return request(`/cuentas-corrientes/${id}`, { method: 'PUT', data }); }
};
