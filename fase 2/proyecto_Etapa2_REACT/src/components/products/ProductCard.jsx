import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isCritical = product.stock <= product.stockMinimo;
  const isOutOfStock = product.stock <= 0;

  const finalPrice = product.enOferta && product.descuento > 0
    ? Math.round(product.precio * (1 - product.descuento / 100))
    : product.precio;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <article className="product-card-tactile" data-testid={`product-card-${product.id}`}>
      {/* IMAGEN Y BADGES FLOTANTES */}
      <div className="product-img-wrapper">
        <img 
          src={product.imagen || '/assets/img/productos/cemento.jpg'} 
          alt={product.nombre}
          className="product-img"
          loading="lazy"
        />

        {/* Badge de Oferta */}
        {product.enOferta && (
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <span className="badge-tactile badge-offer">
              -{product.descuento}% OFF
            </span>
          </div>
        )}

        {/* Badge de Stock Crítico */}
        {isCritical && !isOutOfStock && (
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span className="badge-tactile badge-stock-critical" data-testid="critical-badge">
              <AlertOctagon size={13} /> Stock Crítico ({product.stock} un.)
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span className="badge-tactile" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="product-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-category-tag">
            {product.categoria}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            CÓD: {product.codigo}
          </span>
        </div>

        <h3 className="product-title" title={product.nombre}>
          {product.nombre}
        </h3>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
          Marca: <strong>{product.marca}</strong> &bull; Unidad: <strong>{product.unidad}</strong>
        </div>

        {/* INDICADOR DE STOCK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          {isOutOfStock ? (
            <span style={{ color: 'var(--color-danger)', fontWeight: 800 }}>Sin stock disponible</span>
          ) : isCritical ? (
            <span style={{ color: 'var(--color-danger)', fontWeight: 800 }}>
              &bull; ¡Últimas {product.stock} unidades disponibles!
            </span>
          ) : (
            <span style={{ color: '#059669', fontWeight: 700 }}>
              <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Stock en bodega: {product.stock} {product.unidad}s
            </span>
          )}
        </div>

        {/* PRECIO Y ACCIONES */}
        <div className="product-price-box">
          <div>
            {product.enOferta && (
              <span className="product-price-original">
                ${product.precio.toLocaleString('es-CL')}
              </span>
            )}
            <span className="product-price">
              ${finalPrice.toLocaleString('es-CL')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <Link 
              to={`/producto/${product.id}`} 
              className="btn-tactile btn-tactile-sm"
              title="Ver Ficha Técnica"
              aria-label={`Ver detalles de ${product.nombre}`}
            >
              <Eye size={16} />
            </Link>

            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="btn-tactile btn-tactile-sm btn-tactile-primary"
              title="Agregar al Carrito"
              aria-label={`Agregar ${product.nombre} al carrito`}
            >
              <ShoppingCart size={16} />
              <span>Añadir</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
