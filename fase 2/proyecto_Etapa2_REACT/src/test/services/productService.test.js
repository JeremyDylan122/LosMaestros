import { describe, it, expect, beforeEach } from 'vitest';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';

describe('Servicio de Productos (productService)', () => {
  beforeEach(() => {
    storageService.clearAll();
  });

  describe('Operaciones CRUD y Consulta', () => {
    it('debe inicializar el catálogo con los datos representativos del Excel', () => {
      const products = productService.getProducts();
      expect(products.length).toBeGreaterThan(15);
      expect(products.some(p => p.codigo === 'MC001')).toBe(true);
    });

    it('debe obtener un producto por su ID', () => {
      const product = productService.getProductById(1);
      expect(product).toBeDefined();
      expect(product.codigo).toBe('MC001');
      expect(product.nombre).toContain('Cemento Polpaico');
    });

    it('debe obtener un producto por su código SKU insensible a mayúsculas', () => {
      const product = productService.getProductByCode('mc001');
      expect(product).not.toBeNull();
      expect(product.codigo).toBe('MC001');
    });

    it('debe crear un nuevo producto con código único', () => {
      const newProd = productService.createProduct({
        codigo: 'TEST001',
        nombre: 'Cinta Métrica Industrial 8m',
        categoria: 'Herramientas Manuales',
        subcategoria: 'Medición',
        marca: 'Stanley',
        unidad: 'Unidad',
        precio: 8990,
        stock: 50,
        stockMinimo: 10,
        enOferta: false
      });

      expect(newProd.id).toBeDefined();
      expect(newProd.codigo).toBe('TEST001');

      const found = productService.getProductByCode('TEST001');
      expect(found).not.toBeNull();
      expect(found.nombre).toBe('Cinta Métrica Industrial 8m');
    });

    it('debe rechazar la creación de un producto con código duplicado', () => {
      expect(() => {
        productService.createProduct({
          codigo: 'MC001', // Ya existe
          nombre: 'Cemento Clonado',
          categoria: 'Materiales de Construcción',
          precio: 5000,
          stock: 10
        });
      }).toThrow('ya existe');
    });

    it('debe actualizar los datos y precio de un producto existente', () => {
      const updated = productService.updateProduct(1, {
        precio: 6490,
        stock: 95
      });

      expect(updated.precio).toBe(6490);
      expect(updated.stock).toBe(95);

      const check = productService.getProductById(1);
      expect(check.precio).toBe(6490);
    });

    it('debe eliminar un producto del catálogo', () => {
      const all = productService.getProducts();
      const last = all[all.length - 1];

      const ok = productService.deleteProduct(last.id);
      expect(ok).toBe(true);

      const check = productService.getProductById(last.id);
      expect(check).toBeNull();
    });
  });

  describe('Control de Stock Crítico y Ofertas', () => {
    it('debe detectar correctamente los productos con stock crítico (stock <= stockMinimo)', () => {
      const critical = productService.getCriticalStockProducts();
      expect(critical.length).toBeGreaterThan(0);
      critical.forEach(p => {
        expect(p.stock).toBeLessThanOrEqual(p.stockMinimo);
      });
    });

    it('debe retornar únicamente productos marcados en oferta', () => {
      const offers = productService.getOfferProducts();
      expect(offers.length).toBeGreaterThan(0);
      offers.forEach(p => {
        expect(p.enOferta).toBe(true);
        expect(p.descuento).toBeGreaterThan(0);
      });
    });

    it('debe descontar stock correctamente y lanzar error si se excede la existencia', () => {
      const prod = productService.getProductById(1);
      const initialStock = prod.stock;

      const after = productService.reduceStock(1, 5);
      expect(after.stock).toBe(initialStock - 5);

      // Intentar descontar más de lo disponible
      expect(() => {
        productService.reduceStock(1, 1000);
      }).toThrow('Stock insuficiente');
    });
  });

  describe('Filtros Combinados de Catálogo', () => {
    it('debe filtrar productos por término de búsqueda en nombre o código', () => {
      const results = productService.filterProducts({ search: 'taladro' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(p => {
        expect(p.nombre.toLowerCase() + p.codigo.toLowerCase()).toContain('taladro');
      });
    });

    it('debe filtrar productos por categoría', () => {
      const results = productService.filterProducts({ category: 'Pinturas' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(p => {
        expect(p.categoria).toBe('Pinturas');
      });
    });
  });
});
