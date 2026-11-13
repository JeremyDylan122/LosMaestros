import { expect, it } from 'vitest';
import { productService } from '../../services/productService';

// Jeremy: precio unitario de una oferta activa.
it('calcula el precio final de un producto con 20% de descuento', () => {
  const producto = { precio: 10000, enOferta: true, descuento: 20 };
  expect(productService.getUnitPrice(producto)).toBe(8000);
});
