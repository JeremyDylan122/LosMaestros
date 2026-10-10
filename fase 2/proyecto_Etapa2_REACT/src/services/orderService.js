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

    // 1. Validar disponibilidad de stock para cada ítem antes de procesar
    for (const item of items) {
      const prod = productService.getProductById(item.id);
      if (!prod) {
        throw new Error(`El producto "${item.nombre}" ya no está disponible.`);
      }
      if (prod.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para "${prod.nombre}". Solicitado: ${item.cantidad}, Disponible: ${prod.stock}.`);
      }
    }

    // 2. Calcular monto total
    const totalMonto = items.reduce((acc, item) => {
      const precioUnitario = item.enOferta && item.descuento > 0
        ? Math.round(item.precio * (1 - item.descuento / 100))
        : item.precio;
      return acc + (precioUnitario * item.cantidad);
    }, 0);

    // 3. Si el pago es con Cuenta Corriente (Contratistas)
    if (paymentMethod === 'CUENTA_CORRIENTE') {
      if (!userId) {
        throw new Error('Debes iniciar sesión como contratista para utilizar la línea de crédito.');
      }
      const user = userService.getUserById(userId);
      if (!user || user.rol !== 'CONTRATISTA' || !user.cuentaCorrienteActiva) {
        throw new Error('No cuentas con una cuenta corriente activa autorizada por la administración.');
      }

      const nuevoSaldo = (user.saldoPendiente || 0) + totalMonto;
      if (nuevoSaldo > user.creditoMaximo) {
        throw new Error(`El pedido excede tu línea de crédito disponible. Crédito máximo: $${user.creditoMaximo.toLocaleString('es-CL')}, saldo actual tras pedido: $${nuevoSaldo.toLocaleString('es-CL')}.`);
      }

      // Actualizar saldo pendiente en cuenta corriente
      userService.updateUser(userId, { saldoPendiente: nuevoSaldo });
    }

    // 4. Descontar stock de cada producto en inventario
    for (const item of items) {
      productService.reduceStock(item.id, item.cantidad);
    }

    // 5. Generar código correlativo de orden LM-2026-XXXX
    const orders = this.getOrders();
    const nextId = orders.length > 0 ? Math.max(...orders.map(o => Number(o.id) || 0)) + 1 : 1;
    const codigoOrden = `LM-2026-${String(nextId).padStart(4, '0')}`;

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
      items: items.map(it => ({
        id: it.id,
        codigo: it.codigo,
        nombre: it.nombre,
        precioUnitario: it.precio,
        cantidad: it.cantidad,
        subtotal: it.precio * it.cantidad
      })),
      totalMonto,
      deliveryType: deliveryType || 'RETIRO_TIENDA',
      address: deliveryType === 'DESPACHO_OBRA' ? address : 'Retiro en Tienda - Av. Balmaceda 1420, La Serena',
      commune: commune || 'La Serena',
      paymentMethod,
      estadoPago: paymentMethod === 'CUENTA_CORRIENTE' ? 'PENDIENTE_FIN_DE_MES' : 'PAGADO',
      estado: 'CONFIRMADO', // CONFIRMADO | EN_PREPARACION | DESPACHADO | ENTREGADO | ANULADO
      notes: notes || ''
    };

    orders.unshift(newOrder); // Las órdenes más recientes primero
    storageService.set(STORAGE_KEY, orders);
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

    orders[index].estado = newStatus;
    storageService.set(STORAGE_KEY, orders);
    return orders[index];
  }
};
