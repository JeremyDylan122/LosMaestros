import { apiRequest } from './apiService';
import { storageService } from './storageService';
import { initialProducts } from '../data/initialProducts';

const STORAGE_KEY = 'products';

// URL de la API REST de Ventas configurada vía variable de entorno Vite (Fase 3)
const API_VENTAS_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_VENTAS_URL) 
  ? import.meta.env.VITE_API_VENTAS_URL 
  : 'http://localhost:8082/api/v1';

// Imágenes genéricas de la versión anterior, usadas solo para actualizar sus referencias.
const LEGACY_CATEGORY_IMAGES = {
  'Materiales de Construcción': 'cemento.jpg',
  Pinturas: 'pintura.jpg',
  'Herramientas Manuales': 'martillo.jpg',
  'Herramientas Eléctricas': 'taladro.jpg',
  Gasfitería: 'tuberia-pvc.jpg',
  Electricidad: 'taladro.jpg',
  Seguridad: 'casco.jpg'
};
const INITIAL_PRODUCTS_BY_CODE = new Map(initialProducts.map(product => [product.codigo, product]));

function normalizeProduct(product) {
  const initial = INITIAL_PRODUCTS_BY_CODE.get(product.codigo);
  const legacyImage = initial && `/assets/img/productos/${LEGACY_CATEGORY_IMAGES[initial.categoria]}`;
  // Las referencias genéricas antiguas se actualizan antes de mostrar o guardar el producto.
  // Una imagen personalizada del servidor se conserva.
  return {
    ...product,
    categoria: product.categoriaNombre ?? product.categoria ?? '',
    imagen: initial && product.imagen === legacyImage ? initial.imagen : product.imagen
  };
}

function saveProducts(products) {
  storageService.set(STORAGE_KEY, products);
  window.dispatchEvent(new Event('catalog-updated'));
}

function mergeProducts(products) {
  const cached = new Map(storageService.get(STORAGE_KEY, []).map(product => [Number(product.id), product]));
  for (const product of products) cached.set(Number(product.id), product);
  saveProducts(Array.from(cached.values()));
}

async function categoryRecords() {
  const categories = await apiRequest(API_VENTAS_URL + '/categorias', { token: null });
  if (!Array.isArray(categories)) throw new Error('No se pudo leer las categorías.');
  const active = categories.filter(category => category.activo !== false);
  storageService.set('api_categories', active);
  return active;
}

async function resolveCategory(data) {
  if (data.categoriaId) return Number(data.categoriaId);
  const categories = await categoryRecords();
  const category = categories.find(item => item.nombre.toLowerCase() === data.categoria?.trim().toLowerCase());
  if (!category) throw new Error('Selecciona una categoría vigente del catálogo.');
  return category.id;
}


export const productService = {
  /**
   * Obtiene el precio unitario considerando ofertas activas
   */
  getUnitPrice(product) {
    if (!product) return 0;
    if (Number.isFinite(product.precioEfectivo)) return product.precioEfectivo;
    return product.enOferta && product.descuento > 0
      ? Math.round(product.precio * (1 - product.descuento / 100)) : product.precio;
  },

  /**
   * Validación de campos obligatorios y rangos numéricos
   */
  validateProduct(product) {
    if (!product.codigo?.trim() || !product.nombre?.trim() || !product.categoria?.trim()) {
      throw new Error('Código, nombre y categoría son obligatorios.');
    }
    for (const field of ['precio', 'stock', 'stockMinimo', 'descuento']) {
      const value = Number(product[field] ?? 0);
      if (!Number.isFinite(value) || value < 0) {
        throw new Error('Precio, existencias y descuento deben ser números no negativos.');
      }
    }
    if (!Number.isInteger(Number(product.stock)) || !Number.isInteger(Number(product.stockMinimo ?? 0))) {
      throw new Error('El stock debe ser un número entero.');
    }
    if (Number(product.descuento) > 100) {
      throw new Error('El descuento no puede superar 100%.');
    }
  },

  /**
   * Obtiene todos los productos almacenados o inicializa con la semilla
   * @returns {Array}
   */
  getProducts() {
    const products = storageService.init(STORAGE_KEY, initialProducts);
    let imagesUpdated = false;
    const updatedProducts = products.map(product => {
      const initial = INITIAL_PRODUCTS_BY_CODE.get(product.codigo);
      if (!initial || product.imagen === initial.imagen) return product;

      const legacyImage = `/assets/img/productos/${LEGACY_CATEGORY_IMAGES[initial.categoria]}`;
      if (product.imagen !== legacyImage) return product;

      imagesUpdated = true;
      return { ...product, imagen: initial.imagen };
    });

    if (imagesUpdated) storageService.set(STORAGE_KEY, updatedProducts);
    return updatedProducts;
  },

  /**
   * Obtiene un producto por su ID (sincrónico)
   */
  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => Number(p.id) === Number(id)) || null;
  },

  /**
   * Obtiene un producto por su código SKU (sincrónico)
   */
  getProductByCode(codigo) {
    if (!codigo) return null;
    const products = this.getProducts();
    return products.find(p => p.codigo.trim().toUpperCase() === codigo.trim().toUpperCase()) || null;
  },

  /**
   * Crea un nuevo producto (sincrónico)
   */
  createProduct(productData) {
    const products = this.getProducts();

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
      especificaciones: productData.especificaciones || '',
      activo: productData.activo !== undefined ? Boolean(productData.activo) : true
    };

    this.validateProduct(productData);
    products.push(newProduct);
    storageService.set(STORAGE_KEY, products);
    return newProduct;
  },

  /**
   * Actualiza un producto existente (sincrónico)
   */
  updateProduct(id, updatedData) {
    const products = this.getProducts();
    const index = products.findIndex(p => Number(p.id) === Number(id));

    if (index === -1) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }

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
      id: current.id,
      codigo: updatedData.codigo ? updatedData.codigo.trim().toUpperCase() : current.codigo,
      precio: updatedData.precio !== undefined ? Number(updatedData.precio) : current.precio,
      stock: updatedData.stock !== undefined ? Math.max(0, parseInt(updatedData.stock, 10)) : current.stock,
      stockMinimo: updatedData.stockMinimo !== undefined ? Math.max(0, parseInt(updatedData.stockMinimo, 10)) : current.stockMinimo,
      enOferta: updatedData.enOferta !== undefined ? Boolean(updatedData.enOferta) : current.enOferta,
      descuento: updatedData.descuento !== undefined ? Number(updatedData.descuento) : current.descuento
    };

    this.validateProduct({ ...current, ...updatedData });
    products[index] = updatedProduct;
    storageService.set(STORAGE_KEY, products);
    return updatedProduct;
  },

  /**
   * Elimina un producto (sincrónico)
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
   */
  reduceStock(id, quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('La cantidad debe ser un entero positivo.');
    const product = this.getProductById(id);
    if (!product) throw new Error('Producto no existe para descontar stock.');
    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}, solicitado: ${quantity}.`);
    }
    return this.updateProduct(id, { stock: product.stock - quantity });
  },

  /**
   * Obtiene la lista de categorías únicas
   */
  getCategories() {
    const products = this.getProducts();
    const categoriesSet = new Set(products.map(p => p.categoria));
    return Array.from(categoriesSet);
  },

  /**
   * Obtiene los productos con stock crítico (stock <= stockMinimo)
   */
  getCriticalStockProducts() {
    const products = this.getProducts();
    return products.filter(p => p.stock <= p.stockMinimo);
  },

  /**
   * Obtiene los productos en oferta
   */
  getOfferProducts() {
    const products = this.getProducts();
    return products.filter(p => p.enOferta === true);
  },

  /**
   * Filtra productos por múltiples criterios combinados
   */
  filterProducts({ category, search, minPrice, maxPrice, inOffer, criticalOnly } = {}, products = this.getProducts()) {
    let list = [...products];

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
  },

  // Consultas y escrituras REST de fase 3. El almacenamiento conserva una caché del servidor.
  async fetchProducts({ categoriaId, enOferta, buscar, page = 0, size = 100, allPages = true } = {}) {
    let currentPage = page;
    let totalPages;
    const products = [];
    do {
      const params = new URLSearchParams({ page: currentPage, size });
      if (categoriaId) params.set('categoriaId', categoriaId);
      if (enOferta !== undefined && enOferta !== null) params.set('enOferta', enOferta);
      if (buscar) params.set('buscar', buscar);
      const data = await apiRequest(`${API_VENTAS_URL}/productos?${params}`, { token: null });
      const rows = Array.isArray(data) ? data : data.content;
      if (!Array.isArray(rows)) throw new Error('No se pudo leer el catálogo.');
      products.push(...rows.map(normalizeProduct));
      totalPages = Array.isArray(data) ? currentPage + 1 : data.totalPages;
      currentPage++;
    } while (allPages && currentPage < totalPages);

    if (!categoriaId && enOferta == null && !buscar && page === 0 && allPages) saveProducts(products);
    else mergeProducts(products);
    return products;
  },

  async fetchProductById(id) {
    const product = normalizeProduct(await apiRequest(`${API_VENTAS_URL}/productos/${id}`, { token: null }));
    if (product.activo === false) {
      const error = new Error('El producto ya no está disponible.');
      error.status = 404;
      throw error;
    }
    mergeProducts([product]);
    return product;
  },

  async fetchCategories() {
    return (await categoryRecords()).map(category => category.nombre);
  },

  fetchCategoryDetails() {
    return categoryRecords();
  },

  async fetchCriticalStock() {
    const rows = await apiRequest(API_VENTAS_URL + '/productos/criticos', { token: null });
    if (!Array.isArray(rows)) throw new Error('No se pudo leer el inventario.');
    const products = rows.map(normalizeProduct);
    mergeProducts(products);
    return products;
  },

  async fetchOffers() {
    const rows = await apiRequest(API_VENTAS_URL + '/productos/ofertas', { token: null });
    if (!Array.isArray(rows)) throw new Error('No se pudo leer las ofertas.');
    const products = rows.map(normalizeProduct);
    mergeProducts(products);
    return products;
  },

  async createProductApi(productData, token) {
    this.validateProduct(productData);
    const payload = {
      ...productData,
      codigo: productData.codigo.trim().toUpperCase(),
      nombre: productData.nombre.trim(),
      categoriaId: await resolveCategory(productData),
      precio: Number(productData.precio),
      precioCompra: Number(productData.precioCompra || 0),
      stock: Number(productData.stock),
      stockMinimo: Number(productData.stockMinimo || 0),
      descuento: Number(productData.descuento || 0),
      enOferta: Boolean(productData.enOferta)
    };
    delete payload.categoria;
    const product = normalizeProduct(await apiRequest(API_VENTAS_URL + '/productos', {
      method: 'POST', data: payload, token
    }));
    mergeProducts([product]);
    return product;
  },

  async updateProductApi(id, updatedData, token) {
    const payload = { ...updatedData };
    if (updatedData.categoriaId || updatedData.categoria) payload.categoriaId = await resolveCategory(updatedData);
    delete payload.categoria;
    for (const field of ['precio', 'precioCompra', 'stock', 'stockMinimo', 'descuento']) {
      if (payload[field] !== undefined) payload[field] = Number(payload[field]);
    }
    const product = normalizeProduct(await apiRequest(`${API_VENTAS_URL}/productos/${id}`, {
      method: 'PUT', data: payload, token
    }));
    mergeProducts([product]);
    return product;
  },

  async adjustStockApi(id, delta, token) {
    const product = normalizeProduct(await apiRequest(`${API_VENTAS_URL}/productos/${id}/stock`, {
      method: 'PATCH', data: { delta }, token
    }));
    mergeProducts([product]);
    return product;
  },

  async deleteProductApi(id, token) {
    await apiRequest(`${API_VENTAS_URL}/productos/${id}`, { method: 'DELETE', token });
    saveProducts(storageService.get(STORAGE_KEY, []).filter(product => Number(product.id) !== Number(id)));
    return true;
  }
};
