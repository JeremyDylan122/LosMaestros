import { beforeEach, describe, expect, it, vi } from 'vitest';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { storageService } from '../../services/storageService';
import { shippingService } from '../../services/shippingService';

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.restoreAllMocks(); });
const purchase = (extra = {}) => ({ items: [{ id: 1, cantidad: 1 }], deliveryType: 'RETIRO_TIENDA', paymentMethod: 'WEBPAY_SIMULADO', ...extra });

describe('Regresiones de pedidos y persistencia', () => {
  it('usa el precio y descuento del catálogo y conserva la suma de líneas', () => {
    productService.updateProduct(1, { enOferta: true, descuento: 20 });
    const order = orderService.createOrder(purchase({ items: [{ id: 1, cantidad: 2, precio: 1 }] }));
    expect(order.items[0].precioUnitario).toBe(Math.round(productService.getProductById(1).precio * .8));
    expect(order.totalMonto).toBe(order.items[0].subtotal);
  });
  it('incluye despacho en el pedido y en el saldo del contratista', () => {
    const before = userService.getUserById(3).saldoPendiente;
    const order = orderService.createOrder(purchase({ userId: 3, paymentMethod: 'CUENTA_CORRIENTE', deliveryType: 'DESPACHO_OBRA', commune: 'Vicuña' }));
    expect(order.shippingFee).toBe(14990);
    expect(order.totalMonto).toBe(order.subtotal + 14990);
    expect(userService.getUserById(3).saldoPendiente).toBe(before + order.totalMonto);
  });
  it.each([0, -1, 1.5, NaN])('rechaza cantidad inválida %s sin descontar existencias', cantidad => {
    const stock = productService.getProductById(1).stock;
    expect(() => orderService.createOrder(purchase({ items: [{ id: 1, cantidad }] }))).toThrow('entero positivo');
    expect(productService.getProductById(1).stock).toBe(stock);
    expect(orderService.getOrders()).toHaveLength(0);
  });
  it('consolida líneas repetidas antes de comprobar stock', () => {
    productService.updateProduct(1, { stock: 2 });
    expect(() => orderService.createOrder(purchase({ items: [{ id: 1, cantidad: 2 }, { id: 1, cantidad: 2 }] }))).toThrow('Stock insuficiente');
    expect(productService.getProductById(1).stock).toBe(2);
  });
  it('no confirma un despacho fuera de la cobertura de la demo', () => {
    expect(() => orderService.createOrder(purchase({ deliveryType: 'DESPACHO_OBRA', region: 'Región Metropolitana de Santiago', commune: 'Santiago' }))).toThrow('cotización');
    expect(orderService.getOrders()).toHaveLength(0);
  });
  it('revierte stock y saldo si falla el guardado de la orden', () => {
    productService.getProducts(); userService.getUsers();
    const before = JSON.stringify(localStorage);
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(key, value) {
      if (key === 'los_maestros_orders') throw new Error('Cuota agotada');
      return original.call(this, key, value);
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => orderService.createOrder(purchase({ userId: 3, paymentMethod: 'CUENTA_CORRIENTE' }))).toThrow('guardar');
    expect(JSON.stringify(localStorage)).toBe(before);
  });
  it('no entrega un pedido de otro cliente ni a un visitante', () => {
    const order = orderService.createOrder(purchase({ userId: 4 }));
    expect(orderService.getOrderForViewer(order.id, null)).toBeNull();
    expect(orderService.getOrderForViewer(order.id, userService.getUserById(3))).toBeNull();
    expect(orderService.getOrderForViewer(order.id, userService.getUserById(4))).not.toBeNull();
  });
  it('limita la confirmación invitada a la sesión que compró', () => {
    const order = orderService.createOrder(purchase());
    expect(orderService.getOrderForViewer(order.id, null)).not.toBeNull();
    sessionStorage.clear();
    expect(orderService.getOrderForViewer(order.id, null)).toBeNull();
  });
  it('anula una sola vez y restituye stock y crédito', () => {
    const stock = productService.getProductById(1).stock;
    const saldo = userService.getUserById(3).saldoPendiente;
    const order = orderService.createOrder(purchase({ userId: 3, paymentMethod: 'CUENTA_CORRIENTE' }));
    orderService.updateOrderStatus(order.id, 'ANULADO');
    orderService.updateOrderStatus(order.id, 'ANULADO');
    expect(productService.getProductById(1).stock).toBe(stock);
    expect(userService.getUserById(3).saldoPendiente).toBe(saldo);
    expect(() => orderService.updateOrderStatus(order.id, 'CONFIRMADO')).toThrow('cerrado');
  });
  it('mantiene transferencia pendiente sin fingir cobro', () => {
    expect(orderService.createOrder(purchase({ paymentMethod: 'TRANSFERENCIA' })).estadoPago).toBe('PENDIENTE_TRANSFERENCIA');
  });
});

describe('Credenciales locales y validaciones', () => {
  it('migra claves antiguas y permite seguir iniciando sesión', async () => {
    storageService.set('users', [{ id: 10, email: 'antiguo@gmail.com', password: 'pass123', rol: 'CLIENTE' }]);
    const user = await userService.authenticate('antiguo@gmail.com', 'pass123');
    expect(user.id).toBe(10);
    expect(user.passwordHash).toBeUndefined();
    expect(localStorage.getItem('los_maestros_users')).not.toContain('pass123');
    expect(userService.getUserById(10).passwordHash).toHaveLength(64);
  });
  it('no permite guardar RUN inválido al editar', () => {
    expect(() => userService.updateUser(4, { run: '12345678-0' })).toThrow('verificador');
  });
  it('conserva el crédito de registro elegido para la demo', async () => {
    const user = await userService.createUser({ run: '12345678-5', nombre: 'Demo', email: 'nuevo@gmail.com', password: 'pass123', rol: 'CONTRATISTA', cuentaCorrienteActiva: true, creditoMaximo: 2500000 });
    expect(user.cuentaCorrienteActiva).toBe(true);
    expect(user.creditoMaximo).toBe(2500000);
    expect(user.passwordHash).toBeUndefined();
  });
  it('cambia una clave y rechaza la anterior', async () => {
    await userService.changePassword(1, 'nuevo123');
    await expect(userService.authenticate('admin@duoc.cl', 'admin123')).rejects.toThrow('Credenciales');
    expect((await userService.authenticate('admin@duoc.cl', 'nuevo123')).id).toBe(1);
  });
  it('rechaza descuentos fuera de rango y cantidades negativas', () => {
    expect(() => productService.updateProduct(1, { descuento: 101 })).toThrow('100%');
    expect(() => productService.reduceStock(1, -2)).toThrow('entero positivo');
  });
});

describe('Tarifas de entrega', () => {
  it.each([[99999, 4990], [100000, 0], [100001, 0]])('aplica el límite urbano para subtotal %s', (subtotal, fee) => {
    expect(shippingService.quote({ deliveryType: 'DESPACHO_OBRA', commune: 'Coquimbo', subtotal }).fee).toBe(fee);
  });
  it('permite retiro sin costo independientemente de la región', () => {
    expect(shippingService.quote({ deliveryType: 'RETIRO_TIENDA', region: 'Otra', subtotal: 100 }).fee).toBe(0);
  });
});
