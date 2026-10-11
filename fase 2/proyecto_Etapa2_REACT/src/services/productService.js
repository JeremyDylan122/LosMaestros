import { storageService } from './storageService';
import { initialProducts } from '../data/initialProducts';

const STORAGE_KEY = 'products';

export const productService = {
  /**
   * Obtiene todos los productos almacenados o inicializa con la semilla
   * @returns {Array}
   */
  getProducts() {
    return storageService.init(STORAGE_KEY, initialProducts);
  },

  /**
   * Obtiene un producto por su ID
   * @param {number|string} id 
   * @returns {Object|null}
   */
  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => Number(p.id) === Number(id)) || null;
  },

  /**
   * Obtiene un producto por su código SKU
   * @param {string} codigo 
   * @returns {Object|null}
   */
  getProductByCode(codigo) {
    if (!codigo) return null;
    const products = this.getProducts();
    return products.find(p => p.codigo.trim().toUpperCase() === codigo.trim().toUpperCase()) || null;
  },

  /**
   * Crea un nuevo producto (CRUD: Create)
   * @param {Object} productData 
   * @returns {Object}
   */
  createProduct(productData) {
    const products = this.getProducts();

    // Validar código único
    if (this.getProductByCode(productData.codigo)) {
      throw new Error(`El código de producto "${productData.codigo}" ya existe.`);
    }

    const nextId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;

    const newProduct = {
      id: nextId,
      codigo: productData.codigo.trim().toUpperCase(),
      nombre: productData.nombre.trim(),
      categoria: productData.categoria.trim(),
      subcategoria: productData.subcategoria ? productData.subcategoria.trim() : 'General',
      marca: productData.marca ? productData.marca.trim() : 'Genérico',
      unidad: productData.unidad ? productData.unidad.trim() : 'Unidad',
      precio: Number(productData.precio) || 0,
      precioCompra: Number(productData.precioCompra) || 0,
      stock: Math.max(0, parseInt(productData.stock, 10) || 0),
      stockMinimo: Math.max(0, parseInt(productData.stockMinimo, 10) || 0),
      enOferta: Boolean(productData.enOferta),
      descuento: Number(productData.descuento) || 0,
      descripcion: productData.descripcion ? productData.descripcion.trim() : '',
      imagen: productData.imagen || '/assets/img/productos/cemento.jpg',
      especificaciones: productData.especificaciones || ''
    };

    products.push(newProduct);
    storageService.set(STORAGE_KEY, products);
    return newProduct;
  },

  /**
   * Actualiza un producto existente (CRUD: Update)
   * @param {number|string} id 
   * @param {Object} updatedData 
   * @returns {Object}
   */
  updateProduct(id, updatedData) {
    const products = this.getProducts();
    const index = products.findIndex(p => Number(p.id) === Number(id));

    if (index === -1) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }

    // Si cambia el código, verificar que no colisione con otro
    if (updatedData.codigo && updatedData.codigo !== products[index].codigo) {
      const existing = this.getProductByCode(updatedData.codigo);
      if (existing && Number(existing.id) !== Number(id)) {
        throw new Error(`El código "${updatedData.codigo}" ya está en uso por otro producto.`);
      }
    }

    const current = products[index];
    const updatedProduct = {
      ...current,
      ...updatedData,
      id: current.id, // ID inmutable
      codigo: updatedData.codigo ? updatedData.codigo.trim().toUpperCase() : current.codigo,
      precio: updatedData.precio !== undefined ? Number(updatedData.precio) : current.precio,
      stock: updatedData.stock !== undefined ? Math.max(0, parseInt(updatedData.stock, 10)) : current.stock,
      stockMinimo: updatedData.stockMinimo !== undefined ? Math.max(0, parseInt(updatedData.stockMinimo, 10)) : current.stockMinimo,
      enOferta: updatedData.enOferta !== undefined ? Boolean(updatedData.enOferta) : current.enOferta,
      descuento: updatedData.descuento !== undefined ? Number(updatedData.descuento) : current.descuento
    };

    products[index] = updatedProduct;
    storageService.set(STORAGE_KEY, products);
    return updatedProduct;
  },

  /**
   * Elimina un producto (CRUD: Delete)
   * @param {number|string} id 
   * @returns {boolean}
   */
  deleteProduct(id) {
    const products = this.getProducts();
    const filtered = products.filter(p => Number(p.id) !== Number(id));
    if (filtered.length === products.length) {
      return false;
    }
    storageService.set(STORAGE_KEY, filtered);
    return true;
  },

  /**
   * Reduce el inventario tras una compra confirmada
   * @param {number|string} id 
   * @param {number} quantity 
   */
  reduceStock(id, quantity) {
    const product = this.getProductById(id);
    if (!product) throw new Error('Producto no existe para descontar stock.');
    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}, solicitado: ${quantity}.`);
    }
    return this.updateProduct(id, { stock: product.stock - quantity });
  },

  /**
   * Obtiene la lista de categorías únicas
   * @returns {Array<string>}
   */
  getCategories() {
    const products = this.getProducts();
    const categoriesSet = new Set(products.map(p => p.categoria));
    return Array.from(categoriesSet);
  },

  /**
   * Obtiene los productos con stock crítico (stock <= stockMinimo)
   * @returns {Array}
   */
  getCriticalStockProducts() {
    const products = this.getProducts();
    return products.filter(p => p.stock <= p.stockMinimo);
  },

  /**
   * Obtiene los productos que están en oferta
   * @returns {Array}
   */
  getOfferProducts() {
    const products = this.getProducts();
    return products.filter(p => p.enOferta === true);
  },

  /**
   * Filtra productos por múltiples criterios combinados
   * @param {Object} filters
   * @returns {Array}
   */
  filterProducts({ category, search, minPrice, maxPrice, inOffer, criticalOnly } = {}) {
    let list = this.getProducts();

    if (category && category !== 'ALL') {
      list = list.filter(p => p.categoria.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      );
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      list = list.filter(p => p.precio >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      list = list.filter(p => p.precio <= Number(maxPrice));
    }

    if (inOffer) {
      list = list.filter(p => p.enOferta === true);
    }

    if (criticalOnly) {
      list = list.filter(p => p.stock <= p.stockMinimo);
    }

    return list;
  },

  /**
   * Restablece el catálogo a los datos semilla del Excel
   */
  resetToInitial() {
    storageService.set(STORAGE_KEY, initialProducts);
    return initialProducts;
  }
};
