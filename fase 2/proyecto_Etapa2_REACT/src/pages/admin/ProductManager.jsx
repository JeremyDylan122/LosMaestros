import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertOctagon, 
  Search, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft 
} from 'lucide-react';
import { productService } from '../../services/productService';

export const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriticalOnly, setFilterCriticalOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Formulario modal
  const initialFormState = {
    codigo: '',
    nombre: '',
    categoria: 'Materiales de Construcción',
    subcategoria: '',
    marca: '',
    unidad: 'Unidad',
    precio: '',
    stock: '',
    stockMinimo: '',
    enOferta: false,
    descuento: 0,
    descripcion: '',
    imagen: '/assets/img/productos/cemento.jpg'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  const reloadProducts = () => {
    setProducts(productService.getProducts());
  };

  useEffect(() => {
    reloadProducts();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFormErrors({});
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      subcategoria: p.subcategoria || '',
      marca: p.marca || '',
      unidad: p.unidad || 'Unidad',
      precio: p.precio,
      stock: p.stock,
      stockMinimo: p.stockMinimo || 0,
      enOferta: Boolean(p.enOferta),
      descuento: p.descuento || 0,
      descripcion: p.descripcion || '',
      imagen: p.imagen || '/assets/img/productos/cemento.jpg'
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${nombre}"?`)) {
      const ok = productService.deleteProduct(id);
      if (ok) {
        showFeedback(`Producto "${nombre}" eliminado con éxito.`);
        reloadProducts();
      }
    }
  };

  const validateForm = () => {
    const errs = {};

    // Código: Requerido, texto, mín 3
    if (!formData.codigo.trim() || formData.codigo.trim().length < 3) {
      errs.codigo = 'El código es obligatorio y debe tener al menos 3 caracteres.';
    }

    // Nombre: Requerido, máx 100
    if (!formData.nombre.trim() || formData.nombre.trim().length > 100) {
      errs.nombre = 'El nombre es obligatorio (máximo 100 caracteres).';
    }

    // Precio: Requerido, mín 0
    if (formData.precio === '' || Number(formData.precio) < 0) {
      errs.precio = 'El precio debe ser un número mayor o igual a 0.';
    }

    // Stock: Requerido, entero >= 0
    if (formData.stock === '' || parseInt(formData.stock, 10) < 0 || !Number.isInteger(Number(formData.stock))) {
      errs.stock = 'El stock debe ser un número entero mayor o igual a 0.';
    }

    // Stock Crítico: opcional o entero >= 0
    if (formData.stockMinimo !== '' && (parseInt(formData.stockMinimo, 10) < 0 || !Number.isInteger(Number(formData.stockMinimo)))) {
      errs.stockMinimo = 'El stock mínimo debe ser un número entero mayor o igual a 0.';
    }

    if (!formData.categoria.trim()) {
      errs.categoria = 'La categoría es obligatoria.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingProduct) {
        // Actualizar
        productService.updateProduct(editingProduct.id, {
          ...formData,
          precio: Number(formData.precio),
          stock: parseInt(formData.stock, 10),
          stockMinimo: parseInt(formData.stockMinimo, 10) || 0,
          descuento: Number(formData.descuento) || 0
        });
        showFeedback(`Producto "${formData.nombre}" actualizado correctamente.`);
      } else {
        // Crear
        productService.createProduct({
          ...formData,
          precio: Number(formData.precio),
          stock: parseInt(formData.stock, 10),
          stockMinimo: parseInt(formData.stockMinimo, 10) || 0,
          descuento: Number(formData.descuento) || 0
        });
        showFeedback(`Producto "${formData.nombre}" creado exitosamente.`);
      }
      setModalOpen(false);
      reloadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtrado de la tabla
  const displayedProducts = products.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCritical = filterCriticalOnly ? p.stock <= p.stockMinimo : true;
    return matchSearch && matchCritical;
  });

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ marginBottom: '0.35rem' }}>
            <Link to="/admin" style={{ fontSize: '0.85rem', fontWeight: 800, textDecoration: 'underline' }}>
              &larr; Volver al Dashboard Administrativo
            </Link>
          </div>
          <h1 className="section-title">
            <Package size={28} /> Mantenedor de Productos e Inventario
          </h1>
          <p className="section-subtitle">
            Gestión completa (CRUD) de referencias, precios de venta, stock en bodega y umbrales críticos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-tactile btn-tactile-primary"
          data-testid="create-product-btn"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {feedback && (
        <div className={`alert-tactile alert-tactile-${feedback.type}`}>
          <CheckCircle2 size={18} />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* FILTROS DE TABLA */}
      <div className="bento-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="input-tactile"
              placeholder="Buscar por código, nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-danger)' }}>
            <input
              type="checkbox"
              checked={filterCriticalOnly}
              onChange={(e) => setFilterCriticalOnly(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-danger)' }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertOctagon size={16} /> Solo Stock Crítico ({products.filter(p => p.stock <= p.stockMinimo).length})
            </span>
          </label>
        </div>
      </div>

      {/* TABLA CRUD DE PRODUCTOS */}
      <div className="table-container-tactile">
        <table className="table-tactile" data-testid="products-admin-table">
          <thead>
            <tr>
              <th>Cód / SKU</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th style={{ textAlign: 'right' }}>P. Venta</th>
              <th style={{ textAlign: 'center' }}>Stock</th>
              <th style={{ textAlign: 'center' }}>Stock Mín.</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map(p => {
              const isCrit = p.stock <= p.stockMinimo;
              return (
                <tr key={p.id} data-testid={`admin-product-row-${p.id}`}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    {p.codigo}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={p.imagen || '/assets/img/productos/cemento.jpg'} 
                        alt=""
                        style={{ width: '36px', height: '36px', objectFit: 'cover', border: '1px solid #000', borderRadius: '3px' }}
                      />
                      <div>
                        <strong>{p.nombre}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.marca} &bull; {p.unidad}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{p.categoria}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    ${p.precio.toLocaleString('es-CL')}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 900, color: isCrit ? '#dc2626' : 'inherit' }}>
                    {p.stock}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    {p.stockMinimo}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {isCrit ? (
                      <span className="badge-tactile badge-stock-critical" style={{ fontSize: '0.7rem' }}>
                        CRÍTICO
                      </span>
                    ) : (
                      <span className="badge-tactile badge-stock-ok" style={{ fontSize: '0.7rem' }}>
                        OK
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="btn-tactile btn-tactile-sm"
                        title="Editar Producto"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.nombre)}
                        className="btn-tactile btn-tactile-sm btn-tactile-danger"
                        title="Eliminar Producto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL TÁCTIL PARA CREAR / EDITAR PRODUCTO */}
      {modalOpen && (
        <div className="modal-overlay-tactile" role="dialog" aria-modal="true">
          <div className="modal-box-tactile">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: 'var(--border-sm)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900 }}>
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto en Catálogo'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="btn-tactile btn-tactile-sm"
                style={{ padding: '0.2rem 0.5rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Código / SKU * (Mín 3)</label>
                  <input
                    type="text"
                    className={`input-tactile ${formErrors.codigo ? 'input-error' : ''}`}
                    placeholder="MC001"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  />
                  {formErrors.codigo && <span className="error-text">{formErrors.codigo}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Nombre del Producto * (Máx 100)</label>
                  <input
                    type="text"
                    className={`input-tactile ${formErrors.nombre ? 'input-error' : ''}`}
                    placeholder="Cemento Polpaico gris 25 kg"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    maxLength={100}
                  />
                  {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Categoría *</label>
                  <select
                    className="select-tactile"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  >
                    <option value="Materiales de Construcción">Materiales de Construcción</option>
                    <option value="Pinturas">Pinturas</option>
                    <option value="Herramientas Manuales">Herramientas Manuales</option>
                    <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                    <option value="Gasfitería">Gasfitería</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Seguridad">Seguridad</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label-tactile">Subcategoría</label>
                  <input
                    type="text"
                    className="input-tactile"
                    placeholder="Cementos, Brochas, etc."
                    value={formData.subcategoria}
                    onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Marca</label>
                  <input
                    type="text"
                    className="input-tactile"
                    placeholder="Polpaico, Makita, etc."
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="label-tactile">Unidad de Venta</label>
                  <input
                    type="text"
                    className="input-tactile"
                    placeholder="Saco, Unidad, Galón, Tira..."
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label-tactile">Precio (CLP) *</label>
                  <input
                    type="number"
                    min="0"
                    className={`input-tactile ${formErrors.precio ? 'input-error' : ''}`}
                    placeholder="5990"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  />
                  {formErrors.precio && <span className="error-text">{formErrors.precio}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Stock Actual *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={`input-tactile ${formErrors.stock ? 'input-error' : ''}`}
                    placeholder="80"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                  {formErrors.stock && <span className="error-text">{formErrors.stock}</span>}
                </div>

                <div className="form-group">
                  <label className="label-tactile">Stock Crítico</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={`input-tactile ${formErrors.stockMinimo ? 'input-error' : ''}`}
                    placeholder="20"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={formData.enOferta}
                    onChange={(e) => setFormData({ ...formData, enOferta: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>¿Activar en Ofertas y Promociones?</span>
                </label>

                {formData.enOferta && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="label-tactile">% Descuento</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      className="input-tactile"
                      placeholder="15"
                      value={formData.descuento}
                      onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="label-tactile">Descripción (Máx 500)</label>
                <textarea
                  className="textarea-tactile"
                  rows={3}
                  placeholder="Detalles sobre uso, dosificación o resistencia..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  maxLength={500}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: 'var(--border-sm)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-tactile"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tactile btn-tactile-primary"
                >
                  <Save size={16} /> Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
