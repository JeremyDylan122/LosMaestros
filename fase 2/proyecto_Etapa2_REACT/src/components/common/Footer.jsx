import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Wrench, Truck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer-tactile">
      <div className="footer-container">
        {/* COLUMNA 1: IDENTIDAD DE EMPRESA */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-secondary)',
              border: '2px solid #ffffff',
              padding: '6px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Wrench size={22} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
              FERRETERÍA LOS MAESTROS
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Negocio familiar fundado por Don Carlos Vega en La Serena con 22 años de trayectoria. 
            Especialistas en materiales de construcción estructural, herramientas industriales, 
            gasfitería y línea de crédito en cuenta corriente para maestros y contratistas de la IV Región.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge-tactile" style={{ backgroundColor: '#1e293b', color: '#ffffff', borderColor: '#475569' }}>
              <Truck size={14} /> Despacho a Faena
            </span>
            <span className="badge-tactile" style={{ backgroundColor: '#1e293b', color: '#ffffff', borderColor: '#475569' }}>
              <ShieldCheck size={14} /> Facturación Inmediata
            </span>
          </div>
        </div>

        {/* COLUMNA 2: ATENCIÓN Y CONTACTO EN FAENA */}
        <div>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Atención y Ubicación
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
              <span>Av. Balmaceda 1420, La Serena, Región de Coquimbo</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>+56 51 224 8900 / Mesón Central</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>contacto@losmaestros.cl</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Lunes a Viernes:</strong> 07:30 - 18:30 hrs<br />
                <strong>Sábados:</strong> 08:00 - 14:00 hrs
              </div>
            </li>
          </ul>
        </div>

        {/* COLUMNA 3: ACCESOS RÁPIDOS */}
        <div>
          <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Navegación
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li>
              <Link to="/productos" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                &bull; Catálogo Completo (800+ refs)
              </Link>
            </li>
            <li>
              <Link to="/categorias" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                &bull; Categorías de Ferretería
              </Link>
            </li>
            <li>
              <Link to="/ofertas" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                &bull; Descuentos y Promociones
              </Link>
            </li>
            <li>
              <Link to="/nosotros" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                &bull; Cobertura de Despacho en La Serena
              </Link>
            </li>
            <li>
              <Link to="/blogs" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                &bull; Guías Técnicas y Consejos
              </Link>
            </li>
            <li>
              <Link to="/contacto" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                &bull; Cotizaciones de Materiales
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1380px',
        margin: '2rem auto 0',
        paddingTop: '1.5rem',
        borderTop: '1px solid #334155',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.85rem',
        color: '#64748b'
      }}>
        <div>
          &copy; 2026 Ferretería Los Maestros &bull; Proyecto DSY1104 FullStack II &bull; Duoc UC
        </div>
        <div>
          Diseño en <strong>Bento Grid + Brutalismo Táctil</strong> &bull; React SPA &bull; Vitest Suite
        </div>
      </div>
    </footer>
  );
};
