import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Percent } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';

export const Offers = () => {
  const [offerProducts, setOfferProducts] = useState([]);

  useEffect(() => {
    const offers = productService.getOfferProducts();
    setOfferProducts(offers);
  }, []);

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header">
        <span className="badge-tactile badge-offer" style={{ marginBottom: '0.35rem' }}>
          <Percent size={14} /> DESCUENTOS Y PROMOCIONES DE FAENA
        </span>
        <h1 className="section-title">
          <Tag size={30} /> Ofertas Destacadas para Contratistas y Maestros
        </h1>
        <p className="section-subtitle">
          Aprovecha descuentos especiales por volumen en herramientas eléctricas, pinturas y equipamiento de seguridad.
        </p>
      </div>

      {/* BANNER PROMOCIONAL BENTO */}
      <div className="bento-card bento-card-accent" style={{ marginBottom: 'var(--space-2xl)', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="bento-icon-badge" style={{ backgroundColor: 'var(--color-accent)', borderColor: '#000000', color: '#ffffff' }}>
            <Sparkles size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.25rem' }}>
              Promoción del Mes: Descuentos de hasta 20% en Línea Makita y Calzado Norseg
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#7c2d12' }}>
              Precios válidos hasta agotar existencias en mesón y pedidos con despacho a faena en La Serena.
            </p>
          </div>
        </div>
      </div>

      {/* GRILLA DE OFERTAS */}
      <div className="grid-3">
        {offerProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
