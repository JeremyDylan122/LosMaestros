import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Paintbrush, 
  Hammer, 
  Zap, 
  Droplet, 
  ShieldCheck, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import { productService } from '../services/productService';

export const Categories = () => {
  const products = productService.getProducts();

  const categoryDetails = [
    {
      nombre: 'Materiales de Construcción',
      icon: <Building2 size={26} />,
      descripcion: 'Cementos Polpaico y Melón, morteros cola, niveladores, áridos y ladrillos fiscales para fundaciones y albañilería.',
      referencias: '110+ referencias',
      color: 'bento-card-primary',
      bgTag: 'var(--color-primary)'
    },
    {
      nombre: 'Pinturas',
      icon: <Paintbrush size={26} />,
      descripcion: 'Látex interior, esmaltes al agua antihumedad, barnices marinos intemperie y accesorios de aplicación profesional.',
      referencias: '80+ referencias',
      color: 'bento-card-accent',
      bgTag: 'var(--color-accent)'
    },
    {
      nombre: 'Herramientas Manuales',
      icon: <Hammer size={26} />,
      descripcion: 'Martillos carpinteros, alicates universales de 8", sierras caladoras manuales, niveles torpedo de aluminio y llaves.',
      referencias: '90+ referencias',
      color: '',
      bgTag: 'var(--color-secondary)'
    },
    {
      nombre: 'Herramientas Eléctricas',
      icon: <Zap size={26} />,
      descripcion: 'Taladros percutores 650W, esmeriles angulares 4-1/2", sierras circulares 7-1/4" y atornilladores inalámbricos Makita.',
      referencias: '50+ referencias',
      color: 'bento-card-contractor',
      bgTag: 'var(--color-contractor)'
    },
    {
      nombre: 'Gasfitería',
      icon: <Droplet size={26} />,
      descripcion: 'Cañerías PVC hidráulicas clase 10, tuberías de cobre tipo L, llaves de paso esféricas Nibsa y teflón de alta densidad.',
      referencias: '120+ referencias',
      color: '',
      bgTag: '#0284c7'
    },
    {
      nombre: 'Electricidad',
      icon: <Zap size={26} />,
      descripcion: 'Conductores libres de halógenos EVA 1.5mm, disyuntores termomagnéticos bipolares Legrand y enchufes para obra.',
      referencias: '100+ referencias',
      color: '',
      bgTag: '#d97706'
    },
    {
      nombre: 'Seguridad',
      icon: <ShieldCheck size={26} />,
      descripcion: 'Cascos de seguridad dieléctricos 3M, botines punta de acero Norseg, guantes de cabritilla y antiparras certificadas.',
      referencias: '60+ referencias',
      color: 'bento-card-dark',
      bgTag: '#ef4444'
    }
  ];

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header">
        <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
          DEPARTAMENTOS DE FERRETERÍA
        </span>
        <h1 className="section-title">
          <Layers size={30} /> Categorías y Módulos de Especialidad
        </h1>
        <p className="section-subtitle">
          Explora los departamentos de Ferretería Los Maestros estructurados para contratistas y maestros constructores.
        </p>
      </div>

      {/* BENTO GRID DE CATEGORÍAS */}
      <div className="bento-grid">
        {categoryDetails.map((cat, idx) => {
          const count = products.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;

          return (
            <article 
              key={cat.nombre} 
              className={`bento-card ${cat.color} ${idx === 0 ? 'bento-col-span-2' : ''}`}
              style={{ minHeight: '230px' }}
            >
              <div className="bento-header">
                <span className="badge-tactile" style={{ backgroundColor: cat.bgTag, color: '#ffffff' }}>
                  {cat.referencias}
                </span>
                <div className="bento-icon-badge">
                  {cat.icon}
                </div>
              </div>

              <div className="bento-content">
                <h3 className="bento-title" style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                  {cat.nombre}
                </h3>
                <p className="bento-subtitle" style={{ fontSize: '0.925rem', lineHeight: 1.5 }}>
                  {cat.descripcion}
                </p>
              </div>

              <div className="bento-footer">
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  {count} productos en vitrina
                </span>
                <Link 
                  to={`/productos?categoria=${encodeURIComponent(cat.nombre)}`}
                  className="btn-tactile btn-tactile-sm btn-tactile-primary"
                >
                  Ver Catálogo <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
