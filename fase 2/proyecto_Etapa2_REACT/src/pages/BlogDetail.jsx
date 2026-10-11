import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, BookOpen, Share2 } from 'lucide-react';
import { blogsData } from '../data/blogsData';

export const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogsData.find(b => Number(b.id) === Number(id));

  if (!blog) {
    return (
      <div className="container page-container">
        <div className="bento-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <h2>Artículo no encontrado</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            La publicación que buscas no se encuentra disponible.
          </p>
          <Link to="/blogs" className="btn-tactile btn-tactile-primary">
            <ArrowLeft size={16} /> Volver a Noticias y Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-container" style={{ maxWidth: '900px' }}>
      <button 
        type="button" 
        onClick={() => navigate(-1)} 
        className="btn-tactile btn-tactile-sm" 
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Volver al Listado
      </button>

      <article className="bento-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)' }}>
            {blog.categoria}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            {blog.tiempoLectura} de lectura
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.25rem', color: 'var(--color-secondary)' }}>
          {blog.titulo}
        </h1>

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          paddingBottom: '1.25rem',
          marginBottom: '1.75rem',
          borderBottom: 'var(--border-sm)',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={16} /> {blog.fecha}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={16} /> Por: <strong>{blog.autor}</strong>
          </span>
        </div>

        {/* CONTENIDO DEL ARTÍCULO */}
        <div style={{
          fontSize: '1.05rem',
          lineHeight: 1.8,
          color: '#1e293b',
          whiteSpace: 'pre-line'
        }}>
          {blog.contenido}
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: 'var(--border-tactile)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/blogs" className="btn-tactile btn-tactile-secondary">
            <ArrowLeft size={16} /> Ver Otros Consejos de Obra
          </Link>
          <Link to="/productos" className="btn-tactile btn-tactile-primary">
            Ver Productos Relacionados
          </Link>
        </div>
      </article>
    </div>
  );
};
