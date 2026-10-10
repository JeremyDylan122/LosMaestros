import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { blogsData } from '../data/blogsData';

export const Blogs = () => {
  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header">
        <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
          CAPACITACIÓN TÉCNICA Y FAENA
        </span>
        <h1 className="section-title">
          <BookOpen size={30} /> Consejos de Construcción y Guías Prácticas
        </h1>
        <p className="section-subtitle">
          Artículos preparados por nuestros especialistas para optimizar tus faenas y prolongar la vida útil de tus equipos.
        </p>
      </div>

      {/* GRILLA DE ARTÍCULOS */}
      <div className="grid-3">
        {blogsData.map(blog => (
          <article key={blog.id} className="bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="bento-header">
              <span className="badge-tactile" style={{ backgroundColor: 'var(--color-secondary)', color: '#ffffff' }}>
                {blog.categoria}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} /> {blog.tiempoLectura}
              </span>
            </div>

            <div className="bento-content">
              <h3 className="bento-title" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                {blog.titulo}
              </h3>

              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={13} /> {blog.fecha}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={13} /> {blog.autor}
                </span>
              </div>

              <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6 }}>
                {blog.resumen}
              </p>
            </div>

            <div className="bento-footer">
              <Link 
                to={`/blog/${blog.id}`} 
                className="btn-tactile btn-tactile-sm btn-tactile-secondary"
                style={{ marginLeft: 'auto' }}
              >
                Leer Noticia Completa <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
