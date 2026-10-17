/** Tarifas de demostración. La cobertura se verifica por comuna, sin geocodificación. */
export const shippingService = {
  quote({ deliveryType, region = 'Región de Coquimbo', commune = 'La Serena', subtotal }) {
    if (deliveryType === 'RETIRO_TIENDA') return { available: true, fee: 0, message: 'Retiro gratuito en tienda.' };
    if (deliveryType !== 'DESPACHO_OBRA') return { available: false, fee: 0, message: 'Selecciona una modalidad de entrega válida.' };
    if (region === 'Región de Coquimbo' && ['La Serena', 'Coquimbo'].includes(commune)) {
      return { available: true, fee: subtotal >= 100000 ? 0 : 4990, message: 'Tarifa urbana de demostración por comuna.' };
    }
    if (region === 'Región de Coquimbo' && commune === 'Vicuña') {
      return { available: true, fee: 14990, message: 'Despacho interurbano a Vicuña.' };
    }
    return { available: false, fee: 0, message: 'Esta ubicación requiere cotización previa. Puedes seleccionar retiro en tienda.' };
  }
};
