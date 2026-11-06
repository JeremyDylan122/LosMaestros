import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
const receipt = { id: 7, fecha: '2026-11-05T12:00:00', estado: 'CONFIRMADO', totalMonto: 24990 };
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
beforeEach(() => { localStorage.clear(); localStorage.setItem('auth_token', 'jwt-cliente'); });
afterEach(() => vi.restoreAllMocks());
describe('Pedidos REST', () => {
  it('envía cantidades sin aceptar identidad ni precios del navegador', async () => {
    const stock = productService.getProductById(1).stock;
    const fetch = vi.spyOn(global, 'fetch').mockResolvedValue(response(receipt, 201));
    const result = await orderService.createOrder({ userId: 999, totalMonto: 1, customerRole: 'ADMIN', customerName: 'Cliente', customerEmail: 'cliente@gmail.com', paymentMethod: 'WEBPAY_SIMULADO', deliveryType: 'RETIRO_TIENDA', items: [{ id: 1, cantidad: 2, precio: 1 }] });
    const options = fetch.mock.calls[0][1];
    const payload = JSON.parse(options.body);
    expect(payload.items).toEqual([{ id: 1, cantidad: 2 }]);
    expect(payload).not.toHaveProperty('userId');
    expect(payload).not.toHaveProperty('totalMonto');
    expect(options.headers.Authorization).toBe('Bearer jwt-cliente');
    expect(result.totalMonto).toBe(24990);
    expect(productService.getProductById(1).stock).toBe(stock);
  });
  it('consulta todas las páginas del historial autorizado por Ventas', async () => {
    const fetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce(response({ content: [receipt], totalPages: 2 })).mockResolvedValueOnce(response({ content: [{ ...receipt, id: 8 }], totalPages: 2 }));
    expect((await orderService.getOrders()).map(order => order.id)).toEqual([7, 8]);
    expect(fetch.mock.calls[1][0]).toContain('page=1');
  });
  it('actualiza estados con PATCH y conserva la respuesta del servidor', async () => {
    const fetch = vi.spyOn(global, 'fetch').mockResolvedValue(response({ ...receipt, estado: 'ANULADO' }));
    expect((await orderService.updateOrderStatus(7, 'ANULADO')).estado).toBe('ANULADO');
    expect(fetch.mock.calls[0][1].method).toBe('PATCH');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ estado: 'ANULADO' });
  });
  it.each([401,403,404,409,503])('propaga errores %s sin crear una orden local', async status => {
    vi.spyOn(global, 'fetch').mockResolvedValue(response({ mensaje: 'Compra rechazada' }, status));
    await expect(orderService.createOrder({ items: [{ id: 1, cantidad: 1 }] })).rejects.toMatchObject({ status, message: 'Compra rechazada' });
    expect(localStorage.getItem('orders')).toBeNull();
  });
  it('distingue cuenta inexistente de una dependencia no disponible', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(response({},404)).mockResolvedValueOnce(response({ mensaje: 'Sin conexión' },503));
    expect(await orderService.getMyAccount()).toBeNull();
    await expect(orderService.getMyAccount()).rejects.toMatchObject({ status: 503 });
  });
  it('consulta y configura crédito sin enviar deuda modificable', async () => {
    const fetch = vi.spyOn(global, 'fetch').mockResolvedValue(response({ usuarioId: 3, activa: true, creditoMaximo: 50000, saldoPendiente: 10000, creditoDisponible: 40000 }));
    expect((await orderService.getAccount(3)).saldoPendiente).toBe(10000);
    await orderService.configureAccount(3, { activa: true, creditoMaximo: 50000 });
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ activa: true, creditoMaximo: 50000 });
  });
});
