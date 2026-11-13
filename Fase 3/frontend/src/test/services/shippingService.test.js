import { expect, it } from 'vitest';
import { shippingService } from '../../services/shippingService';

// Sebastián: vivir fuera de cobertura no impide comprar con retiro.
it('permite retiro gratuito aunque la dirección esté fuera de cobertura', () => {
  const cotizacion = shippingService.quote({
    deliveryType: 'RETIRO_TIENDA',
    region: 'Región Metropolitana de Santiago',
    commune: 'Santiago',
    subtotal: 10000
  });
  expect(cotizacion.available).toBe(true);
  expect(cotizacion.fee).toBe(0);
});
