import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Truck, 
  CreditCard, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  CheckCircle2, 
  Package 
} from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';
import { CoverageMap } from '../components/common/CoverageMap';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const all = productService.getProducts();
    // Seleccionar 6 productos destacados
    setFeaturedProducts(all.slice(0, 6));
  }, []);

  return (
    <div className="container page-container">
      {/* 1. HERO BENTO GRID BRUTALISTA */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="bento-grid">
          {/* Bento Item 1: Principal de Bienvenida */}
          <article className="bento-card bento-card-primary bento-col-span-2 bento-row-span-2" style={{ padding: '2rem' }}>
            <div className="bento-header">
              <span className="badge-tactile" style={{ backgroundColor: 'var(--color-secondary)', color: '#ffffff' }}>
                FERRETERÍA INDUSTRIAL &bull; CASA MATRIZ
              </span>
              <div className="bento-icon-badge" style={{ backgroundColor: 'var(--color-primary)' }}>
                <Wrench size={24} color="var(--color-secondary)" />
              </div>
            </div>

            <div className="bento-content" style={{ marginTop: '0.5rem' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem', color: 'var(--color-secondary)' }}>
                Materiales de Construcción y Herramientas para Faena
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 500 }}>
                Abastecemos a contratistas, maestros de obra y hogares con más de 800 referencias en stock garantizado, 
                atención especializada en mesón y despacho directo a obra en toda la Región de Coquimbo.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: 'auto' }}>
              <Link to="/productos" className="btn-tactile btn-tactile-secondary">
                Ver Catálogo Completo <ArrowRight size={18} />
              </Link>
              <Link to="/ofertas" className="btn-tactile btn-tactile-accent">
                <Tag size={16} /> Ver Rebajas de Faena
              </Link>
            </div>
          </article>

          {/* Bento Item 2: Línea de Crédito para Contratistas */}
          <article className="bento-card bento-card-contractor">
            <div className="bento-header">
              <span className="badge-tactile" style={{ backgroundColor: 'var(--color-contractor)', color: '#ffffff' }}>
                CONTRATISTAS
              </span>
              <div className="bento-icon-badge">
                <CreditCard size={22} color="var(--color-contractor)" />
              </div>
            </div>
            <div className="bento-content">
              <h3 className="bento-title" style={{ fontSize: '1.25rem' }}>
                Cuenta Corriente a Fin de Mes
              </h3>
              <p className="bento-subtitle" style={{ color: '#1e3a8a', fontSize: '0.925rem', marginTop: '0.5rem' }}>
                Compra materiales para tu obra y consolida tus pagos mensuales con crédito directo y facturación centralizada.
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/contacto" className="btn-tactile btn-tactile-sm btn-tactile-contractor">
                Solicitar Línea de Crédito
              </Link>
            </div>
          </article>

          {/* Bento Item 3: Despacho a Faena */}
          <article className="bento-card">
            <div className="bento-header">
              <span className="badge-tactile badge-stock-ok">
                LOGÍSTICA
              </span>
              <div className="bento-icon-badge">
                <Truck size={22} color="#059669" />
              </div>
            </div>
            <div className="bento-content">
              <h3 className="bento-title" style={{ fontSize: '1.25rem' }}>
                Despacho en 24 Horas
              </h3>
              <p className="bento-subtitle" style={{ fontSize: '0.925rem', marginTop: '0.5rem' }}>
                Camión pluma para descarga segura de cementos, fierros y áridos directo a pie de obra en La Serena y Coquimbo.
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/nosotros" className="btn-tactile btn-tactile-sm">
                Ver Zonas de Cobertura
              </Link>
            </div>
          </article>

          {/* Bento Item 4: Consejos Técnicos */}
          <article className="bento-card bento-card-accent">
            <div className="bento-header">
              <span className="badge-tactile" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>
                CAPACITACIÓN
              </span>
              <div className="bento-icon-badge">
                <BookOpen size={22} color="var(--color-accent)" />
              </div>
            </div>
            <div className="bento-content">
              <h3 className="bento-title" style={{ fontSize: '1.25rem' }}>
                Guías y Consejos de Faena
              </h3>
              <p className="bento-subtitle" style={{ color: '#7c2d12', fontSize: '0.925rem', marginTop: '0.5rem' }}>
                Aprende técnicas de dosificación de concreto y mantención preventiva de herramientas con nuestros maestros.
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/blogs" className="btn-tactile btn-tactile-sm btn-tactile-accent">
                Leer Artículos Técnicos
              </Link>
            </div>
          </article>

          {/* Bento Item 5: Garantía y Respaldo */}
          <article className="bento-card bento-card-dark">
            <div className="bento-header">
              <span className="badge-tactile" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                22 AÑOS DE TRAYECTORIA
              </span>
              <div className="bento-icon-badge" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
                <ShieldCheck size={22} color="var(--color-primary)" />
              </div>
            </div>
            <div className="bento-content">
              <h3 className="bento-title" style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                Respaldo y Servicio Técnico
              </h3>
              <p className="bento-subtitle" style={{ color: '#94a3b8', fontSize: '0.925rem', marginTop: '0.5rem' }}>
                Garantía oficial en marcas líderes: Polpaico, Makita, Bosch, Tigre, 3M, Stanley y Covisa.
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/categorias" className="btn-tactile btn-tactile-sm btn-tactile-primary">
                Explorar Categorías
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 2. PRODUCTOS DESTACADOS DEL CATÁLOGO */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
              CATÁLOGO SELECCIONADO
            </span>
            <h2 className="section-title">
              <Package size={28} /> Productos Destacados para Obra
            </h2>
            <p className="section-subtitle">
              Consulta stock en tiempo real y precios con venta por mayor y menor.
            </p>
          </div>
          <Link to="/productos" className="btn-tactile">
            Ver Todos los Productos <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-3">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. MAPA INTERACTIVO DE COBERTURA */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <CoverageMap />
      </section>
    </div>
  );
};
