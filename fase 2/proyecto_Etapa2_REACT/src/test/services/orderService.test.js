import { describe, it, expect, beforeEach } from 'vitest';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { storageService } from '../../services/storageService';

describe('Servicio de Órdenes (orderService)', () => {
  beforeEach(() => {
    storageService.clearAll();
    // Inicializar semillas
    productService.getProducts();
    userService.getUsers();
  });

  it('debe crear una orden de compra regular y descontar stock automáticamente', () => {
    const prod = productService.getProductById(1); // Cemento Polpaico
    const stockAntes = prod.stock;

    const order = orderService.createOrder({
      userId: 4, // Cliente
      customerName: 'Andrea Soto',
      customerEmail: 'cliente@gmail.com',
      customerRole: 'CLIENTE',
      items: [
        { id: prod.id, codigo: prod.codigo, nombre: prod.nombre, precio: prod.precio, cantidad: 2 }
      ],
      deliveryType: 'RETIRO_TIENDA',
      paymentMethod: 'WEBPAY_SIMULADO'
    });

    expect(order.id).toBeDefined();
    expect(order.codigoOrden).toMatch(/^LM-2026-\d{4}$/);
    expect(order.totalMonto).toBe(prod.precio * 2);
    expect(order.estado).toBe('CONFIRMADO');

    // Comprobar que el stock del producto disminuyó
    const prodDespues = productService.getProductById(1);
    expect(prodDespues.stock).toBe(stockAntes - 2);
  });

  it('debe registrar un pedido con Cuenta Corriente Contratista y actualizar su saldo pendiente', () => {
    const contratista = userService.getUserById(3); // Patricio Gómez
    const saldoAntes = contratista.saldoPendiente;

    const prod = productService.getProductById(2); // Cemento Melón
    const cantidad = 3;
    const montoEsperado = prod.precio * cantidad;

    const order = orderService.createOrder({
      userId: contratista.id,
      customerName: contratista.nombre,
      customerEmail: contratista.email,
      customerRole: 'CONTRATISTA',
      items: [
        { id: prod.id, codigo: prod.codigo, nombre: prod.nombre, precio: prod.precio, cantidad }
      ],
      deliveryType: 'DESPACHO_OBRA',
      address: 'Obra Los Olivos 240',
      commune: 'La Serena',
      paymentMethod: 'CUENTA_CORRIENTE'
    });

    expect(order.paymentMethod).toBe('CUENTA_CORRIENTE');
    expect(order.estadoPago).toBe('PENDIENTE_FIN_DE_MES');

    // Comprobar que aumentó el saldo pendiente del contratista
    const contratistaActualizado = userService.getUserById(3);
    expect(contratistaActualizado.saldoPendiente).toBe(saldoAntes + montoEsperado);
  });

  it('debe rechazar un pedido a cuenta corriente si excede el límite de crédito', () => {
    const contratista = userService.getUserById(3);
    // Establecer saldo al límite
    userService.updateUser(contratista.id, { saldoPendiente: contratista.creditoMaximo - 1000 });

    const prod = productService.getProductById(15); // Taladro $79.990

    expect(() => {
      orderService.createOrder({
        userId: contratista.id,
        customerName: contratista.nombre,
        customerEmail: contratista.email,
        customerRole: 'CONTRATISTA',
        items: [
          { id: prod.id, codigo: prod.codigo, nombre: prod.nombre, precio: prod.precio, cantidad: 1 }
        ],
        deliveryType: 'RETIRO_TIENDA',
        paymentMethod: 'CUENTA_CORRIENTE'
      });
    }).toThrow('excede tu línea de crédito');
  });

  it('debe permitir a un administrador o vendedor actualizar el estado de una orden', () => {
    const prod = productService.getProductById(5);
    const order = orderService.createOrder({
      customerName: 'Cliente Mesón',
      customerEmail: 'cliente@gmail.com',
      items: [{ id: prod.id, codigo: prod.codigo, nombre: prod.nombre, precio: prod.precio, cantidad: 1 }],
      deliveryType: 'DESPACHO_OBRA',
      paymentMethod: 'WEBPAY_SIMULADO'
    });

    const updated = orderService.updateOrderStatus(order.id, 'EN_PREPARACION');
    expect(updated.estado).toBe('EN_PREPARACION');

    const dispatched = orderService.updateOrderStatus(order.id, 'DESPACHADO');
    expect(dispatched.estado).toBe('DESPACHADO');
  });
});
