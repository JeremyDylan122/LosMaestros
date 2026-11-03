import { shippingService } from './shippingService';
import { storageService } from './storageService';
import { productService } from './productService';
import { userService } from './userService';

const STORAGE_KEY = 'orders';

export const orderService = {
  /**
   * Obtiene todas las órdenes registradas
   * @returns {Array}
   */
  getOrders() {
    return storageService.get(STORAGE_KEY, []);
  },

  /**
   * Obtiene una orden por su ID o código de orden
   * @param {number|string} id 
   * @returns {Object|null}
   */
  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => Number(o.id) === Number(id) || o.codigoOrden === id) || null;
  },

  /**
   * Obtiene las órdenes realizadas por un usuario específico
   * @param {number|string} userId 
   * @returns {Array}
   */
  getOrderForViewer(id, viewer) {
    const order = this.getOrderById(id);
    if (!order) return null;
    if (viewer && (['ADMIN', 'VENDEDOR'].includes(viewer.rol) || (order.userId && Number(order.userId) === Number(viewer.id)))) return order;
    try {
      if (!viewer && !order.userId && sessionStorage.getItem('los_maestros_guest_order') === String(order.id)) return order;
    } catch { /* Almacenamiento de sesión no disponible. */ }
    return null;
  },

  getOrdersByUserId(userId) {
    const orders = this.getOrders();
    return orders.filter(o => Number(o.userId) === Number(userId));
  },

  /**
   * Crea una nueva orden de compra, descuenta stock y gestiona cuenta corriente
   * @param {Object} orderData 
   * @returns {Object} Orden creada
   */
  createOrder(orderData) {
    const {
      userId,
      customerName,
      customerEmail,
      customerRole,
      items,
      deliveryType, // 'DESPACHO_OBRA' | 'RETIRO_TIENDA'
      address,
      commune,
      paymentMethod, // 'CUENTA_CORRIENTE' | 'WEBPAY_SIMULADO' | 'TRANSFERENCIA'
      notes
    } = orderData;

    if (!items || items.length === 0) {
      throw new Error('La orden no contiene ningún producto.');
    }

    // Consolidar cantidades y usar siempre el catálogo vigente, nunca precios enviados por el carrito.
    const quantities = new Map();
    for (const item of items) {
      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) throw new Error('La cantidad debe ser un entero positivo.');
      quantities.set(Number(item.id), (quantities.get(Number(item.id)) || 0) + item.cantidad);
    }
    const products = productService.getProducts();
    const lines = Array.from(quantities, ([id, cantidad]) => {
      const product = products.find(p => Number(p.id) === id);
      if (!product) throw new Error('El producto ya no está disponible.');
      if (product.stock < cantidad) throw new Error(`Stock insuficiente para "${product.nombre}".`);
      const precioUnitario = productService.getUnitPrice(product);
      return { id, codigo: product.codigo, nombre: product.nombre, precioUnitario, cantidad, subtotal: precioUnitario * cantidad };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
    const shipping = shippingService.quote({ deliveryType: deliveryType || 'RETIRO_TIENDA', region: orderData.region, commune, subtotal });
    if (!shipping.available) throw new Error(shipping.message);
    const totalMonto = subtotal + shipping.fee;
    if (!['CUENTA_CORRIENTE', 'WEBPAY_SIMULADO', 'TRANSFERENCIA'].includes(paymentMethod)) throw new Error('Selecciona un medio de pago válido.');
    const users = userService.getUsers();
    if (paymentMethod === 'CUENTA_CORRIENTE') {
      const user = users.find(u => Number(u.id) === Number(userId));
      if (!userId || !user || user.rol !== 'CONTRATISTA' || !user.cuentaCorrienteActiva) throw new Error('No cuentas con una cuenta corriente activa.');
      const nuevoSaldo = (user.saldoPendiente || 0) + totalMonto;
      if (nuevoSaldo > user.creditoMaximo) throw new Error('El pedido excede tu línea de crédito disponible.');
      user.saldoPendiente = nuevoSaldo;
    }
    for (const line of lines) products.find(p => Number(p.id) === line.id).stock -= line.cantidad;

    // 5. Generar código correlativo de orden LM-2026-XXXX
    const orders = this.getOrders();
    const nextId = orders.length > 0 ? Math.max(...orders.map(o => Number(o.id) || 0)) + 1 : 1;
    const codigoOrden = `LM-${new Date().getFullYear()}-${String(nextId).padStart(4, '0')}`;

    const newOrder = {
      id: nextId,
      codigoOrden,
      fecha: new Date().toISOString(),
      fechaLegible: new Date().toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      userId: userId || null,
      customerName: customerName || 'Cliente Mesón',
      customerEmail: customerEmail || '',
      customerRole: customerRole || 'CLIENTE',
      items: lines,
      subtotal,
      shippingFee: shipping.fee,
      region: orderData.region || 'Región de Coquimbo',
      phone: orderData.phone || '',
      empresa: orderData.empresa || '',
      totalMonto,
      deliveryType: deliveryType || 'RETIRO_TIENDA',
      address: deliveryType === 'DESPACHO_OBRA' ? address : 'Retiro en Tienda - Av. Balmaceda 1420, La Serena',
      commune: commune || 'La Serena',
      paymentMethod,
      estadoPago: paymentMethod === 'CUENTA_CORRIENTE' ? 'PENDIENTE_FIN_DE_MES' : paymentMethod === 'TRANSFERENCIA' ? 'PENDIENTE_TRANSFERENCIA' : 'PAGADO_SIMULADO',
      estado: 'CONFIRMADO', // CONFIRMADO | EN_PREPARACION | DESPACHADO | ENTREGADO | ANULADO
      notes: notes || ''
    };

    orders.unshift(newOrder); // Las órdenes más recientes primero
    storageService.setMany({ products, users, orders });
    if (!newOrder.userId) {
      // Capacidad temporal para consultar únicamente la compra invitada de esta pestaña.
      try { sessionStorage.setItem('los_maestros_guest_order', String(newOrder.id)); } catch { /* La confirmación seguirá sin exponer otras órdenes. */ }
    }
    return newOrder;
  },

  /**
   * Actualiza el estado de una orden (acceso Administrador / Vendedor)
   * @param {number|string} id 
   * @param {string} newStatus 
   * @returns {Object}
   */
  updateOrderStatus(id, newStatus) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => Number(o.id) === Number(id));

    if (index === -1) {
      throw new Error(`Orden con ID ${id} no encontrada.`);
    }

    const allowed = ['CONFIRMADO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO', 'ANULADO'];
    if (!allowed.includes(newStatus)) throw new Error('Estado de pedido inválido.');
    const order = orders[index];
    if (newStatus === order.estado) return order;
    if (['ANULADO', 'ENTREGADO'].includes(order.estado)) throw new Error('El pedido ya está cerrado.');
    if (newStatus !== 'ANULADO' && allowed.indexOf(newStatus) <= allowed.indexOf(order.estado)) throw new Error('El estado no puede retroceder.');
    if (newStatus === 'ANULADO') {
      const products = productService.getProducts();
      order.items.forEach(line => { const p = products.find(p => Number(p.id) === Number(line.id)); if (p) p.stock += line.cantidad; });
      const users = userService.getUsers();
      const customer = users.find(u => Number(u.id) === Number(order.userId));
      if (customer && order.paymentMethod === 'CUENTA_CORRIENTE') customer.saldoPendiente = Math.max(0, customer.saldoPendiente - order.totalMonto);
      order.estado = newStatus;
      order.estadoPago = 'ANULADO';
      storageService.setMany({ products, users, orders });
      return order;
    }
    orders[index].estado = newStatus;
    storageService.set(STORAGE_KEY, orders);
    return orders[index];
  }
};
