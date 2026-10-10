import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Package, 
  Wrench 
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = productService.getProductById(id);
    setProduct(p);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cargando ficha del producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page-container">
        <div className="bento-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Producto no encontrado</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            El producto solicitado no existe o fue retirado del inventario activo.
          </p>
          <Link to="/productos" className="btn-tactile btn-tactile-primary">
            <ArrowLeft size={16} /> Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const isCritical = product.stock <= product.stockMinimo;
  const isOutOfStock = product.stock <= 0;

  const finalPrice = product.enOferta && product.descuento > 0
    ? Math.round(product.precio * (1 - product.descuento / 100))
    : product.precio;

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="container page-container">
      {/* BOTÓN VOLVER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-tactile btn-tactile-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Volver
        </button>
      </div>

      {/* DETALLE EN BENTO GRID */}
      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* COLUMNA 1: IMAGEN TÁCTIL */}
        <div className="bento-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '100%', height: '420px', backgroundColor: '#f1f5f9' }}>
            <img 
              src={product.imagen || '/assets/img/productos/cemento.jpg'} 
              alt={product.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {product.enOferta && (
              <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
                <span className="badge-tactile badge-offer" style={{ fontSize: '0.9rem', padding: '0.35rem 0.75rem' }}>
                  <Tag size={15} /> PROMO -{product.descuento}% OFF
                </span>
              </div>
            )}

            {isCritical && !isOutOfStock && (
              <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                <span className="badge-tactile badge-stock-critical" style={{ fontSize: '0.85rem' }}>
                  <AlertOctagon size={15} /> Stock Crítico ({product.stock} un.)
                </span>
              </div>
            )}
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface-alt)', borderTop: 'var(--border-tactile)' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} color="var(--color-secondary)" /> Garantía del Fabricante
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Truck size={16} color="var(--color-primary)" /> Despacho a Faena
              </span>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: INFORMACIÓN Y ACCIONES */}
        <div className="bento-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)' }}>
              {product.categoria} &bull; {product.subcategoria}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              SKU: {product.codigo}
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--color-secondary)' }}>
            {product.nombre}
          </h1>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <span>Marca: <strong>{product.marca}</strong></span>
            <span>&bull;</span>
            <span>Unidad de Venta: <strong>{product.unidad}</strong></span>
          </div>

          {/* CAJA DE PRECIOS */}
          <div style={{
            backgroundColor: 'var(--bg-surface-alt)',
            border: 'var(--border-tactile)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'baseline',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>
              ${finalPrice.toLocaleString('es-CL')}
            </span>
            {product.enOferta && (
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                ${product.precio.toLocaleString('es-CL')}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              IVA incluido
            </span>
          </div>

          {/* ESTADO DE STOCK */}
          <div style={{ marginBottom: '1.5rem' }}>
            {isOutOfStock ? (
              <div className="alert-tactile alert-tactile-danger">
                <AlertOctagon size={18} />
                <span>Producto agotado actualmente en bodega central La Serena.</span>
              </div>
            ) : isCritical ? (
              <div className="alert-tactile alert-tactile-warning">
                <AlertOctagon size={18} />
                <span>
                  <strong>Stock Crítico:</strong> Quedan solo {product.stock} unidades en existencia.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>Disponible en mesón: {product.stock} {product.unidad}s para entrega inmediata.</span>
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="label-tactile" style={{ marginBottom: '0.35rem' }}>Descripción del Material</h4>
            <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.975rem' }}>
              {product.descripcion}
            </p>
          </div>

          {/* ESPECIFICACIONES TÉCNICAS */}
          {product.especificaciones && (
            <div style={{ marginBottom: '1.75rem', padding: '1rem', border: 'var(--border-sm)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)' }}>
              <h4 className="label-tactile" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>Ficha y Normativa</h4>
              <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>
                {product.especificaciones}
              </p>
            </div>
          )}

          {/* SELECTOR DE CANTIDAD Y BOTÓN AÑADIR */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: 'var(--border-tactile)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)' }}>
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="btn-tactile btn-tactile-sm"
                  style={{ border: 'none', boxShadow: 'none', padding: '0.65rem 1rem' }}
                >
                  -
                </button>
                <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 900, fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= product.stock}
                  className="btn-tactile btn-tactile-sm"
                  style={{ border: 'none', boxShadow: 'none', padding: '0.65rem 1rem' }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-tactile btn-tactile-primary"
                style={{ flex: 1, padding: '0.85rem 1.5rem', fontSize: '1.05rem' }}
              >
                <ShoppingCart size={18} />
                <span>Agregar al Carrito ({quantity})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
