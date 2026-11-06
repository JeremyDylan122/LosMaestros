import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';
import { initialProducts } from '../../data/initialProducts';
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());
describe('Regresiones del catálogo REST', () => {
  it.each(['catalogo', 'ofertas', 'detalle'])('la imagen de %s coincide con la que recibe el carrito', async view => {
    const initial = initialProducts.find(product => product.codigo === 'SE005');
    const remote = { ...initial, id: 927, categoriaNombre: 'Seguridad', imagen: '/assets/img/productos/casco.jpg' };
    const body = view === 'catalogo' ? { content: [remote], totalPages: 1 } : view === 'ofertas' ? [remote] : remote;
    vi.spyOn(global, 'fetch').mockResolvedValue(response(body));
    const result = view === 'catalogo' ? (await productService.fetchProducts())[0]
      : view === 'ofertas' ? (await productService.fetchOffers())[0] : await productService.fetchProductById(927);
    expect(result.imagen).toBe(initial.imagen);
    expect(productService.getProductById(927).imagen).toBe(result.imagen);
    expect(result.id).toBe(927);
  });
  it('conserva las imágenes personalizadas que llegan del servidor', async () => {
    const initial = initialProducts.find(product => product.codigo === 'SE005');
    vi.spyOn(global, 'fetch').mockResolvedValue(response({ ...initial, imagen: '/assets/img/productos/guantes-personalizados.jpg' }));
    const result = await productService.fetchProductById(initial.id);
    expect(result.imagen).toBe('/assets/img/productos/guantes-personalizados.jpg');
    expect(productService.getProductById(initial.id).imagen).toBe(result.imagen);
  });
  it('conserva ids y categorías del servidor al recorrer la paginación', async () => {
    const fetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce(response({ content: [{ id: 105, categoriaNombre: 'Pinturas', precio: 999, precioEfectivo: 899.1 }], totalPages: 2 })).mockResolvedValueOnce(response({ content: [{ id: 207, categoriaNombre: 'Otra' }], totalPages: 2 }));
    const products = await productService.fetchProducts();
    expect(products.map(p => p.id)).toEqual([105,207]);
    expect(products[0].categoria).toBe('Pinturas');
    expect(productService.getUnitPrice(products[0])).toBe(899.1);
    expect(fetch.mock.calls[1][0]).toContain('page=1');
  });
  it('vacía la caché cuando el catálogo real está vacío', async () => {
    productService.getProducts();
    vi.spyOn(global, 'fetch').mockResolvedValue(response({ content: [], totalPages: 0 }));
    expect(await productService.fetchProducts()).toEqual([]);
    expect(storageService.get('products')).toEqual([]);
  });
  it('no presenta datos semilla cuando la API no responde', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new TypeError('network'));
    await expect(productService.fetchProducts()).rejects.toThrow('No se pudo conectar');
  });
  it('resuelve la categoría por sus datos reales y conserva el id del producto creado', async () => {
    const fetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce(response([{ id: 42, nombre: 'Pinturas', activo: true }])).mockResolvedValueOnce(response({ id: 909, codigo: 'P-1', categoriaId: 42, categoriaNombre: 'Pinturas' },201));
    const product = await productService.createProductApi({ codigo: 'P-1', nombre: 'Pintura', categoria: 'Pinturas', precio: 100, stock: 2 });
    expect(JSON.parse(fetch.mock.calls[1][1].body).categoriaId).toBe(42);
    expect(product.id).toBe(909);
    expect(productService.getProductById(909).codigo).toBe('P-1');
  });
  it('una escritura rechazada no modifica la caché', async () => {
    const before = productService.getProducts();
    vi.spyOn(global, 'fetch').mockResolvedValue(response({ mensaje: 'Acceso denegado' },403));
    await expect(productService.adjustStockApi(1,1)).rejects.toThrow('Acceso denegado');
    expect(productService.getProducts()).toEqual(before);
  });
});
