import React, { useState } from 'react';
import { MapPin, Truck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const CoverageMap = () => {
  const [selectedZone, setSelectedZone] = useState('urbana');

  const zones = {
    urbana: {
      id: 'urbana',
      nombre: 'Zona 1: Radio Urbano La Serena & Coquimbo (0 a 15 km)',
      cobertura: 'La Serena Centro, El Milagro, San Joaquín, Las Compañías, Coquimbo Centro, Sindempart, Peñuelas.',
      tiempoEntrega: '24 horas hábiles (o retiro inmediato en mesón)',
      costo: 'Gratuito para compras sobre $100.000 (o $4.990 compras menores)',
      camionPluma: 'Disponible para descarga de cementos, áridos y perfiles.',
      color: 'var(--color-primary)'
    },
    interurbana: {
      id: 'interurbana',
      nombre: 'Zona 2: Valle de Elqui & Eje Panamericana (15 a 45 km)',
      cobertura: 'Vicuña, Algarrobito, Elqui, Guanaqueros, Tongoy, Quebrada de Talca.',
      tiempoEntrega: '24 a 48 horas coordinado con faena',
      costo: '$14.990 tarifa plana en camión de reparto',
      camionPluma: 'Sujeto a confirmación según accesos viales de obra.',
      color: 'var(--color-contractor)'
    },
    rural: {
      id: 'rural',
      nombre: 'Zona 3: Faenas Mineras y Zonas Rurales Distantes (+45 km)',
      cobertura: 'Andacollo, Combarbalá, Illapel, faenas cordilleranas.',
      tiempoEntrega: 'A convenir con la administración comercial',
      costo: 'Tarifa por kilometraje y tonelaje según cubicación',
      camionPluma: 'Flete dedicado en camión de alto tonelaje.',
      color: 'var(--color-accent)'
    }
  };

  const active = zones[selectedZone];

  return (
    <div className="bento-card" style={{ padding: 'var(--space-xl)' }}>
      <div className="bento-header">
        <div>
          <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            <Truck size={14} /> Logística y Despacho en Obra
          </span>
          <h3 className="bento-title" style={{ fontSize: '1.4rem' }}>
            Mapa Interactivo de Cobertura de Despacho
          </h3>
          <p className="bento-subtitle">
            Verifica el rango de despacho a tu faena antes de realizar tu pedido o cotización.
          </p>
        </div>
      </div>

      {/* SELECTOR DE ZONAS */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => setSelectedZone('urbana')}
          className={`btn-tactile btn-tactile-sm ${selectedZone === 'urbana' ? 'btn-tactile-primary' : ''}`}
        >
          Zona 1: La Serena / Coquimbo
        </button>
        <button
          type="button"
          onClick={() => setSelectedZone('interurbana')}
          className={`btn-tactile btn-tactile-sm ${selectedZone === 'interurbana' ? 'btn-tactile-contractor' : ''}`}
        >
          Zona 2: Valle de Elqui
        </button>
        <button
          type="button"
          onClick={() => setSelectedZone('rural')}
          className={`btn-tactile btn-tactile-sm ${selectedZone === 'rural' ? 'btn-tactile-accent' : ''}`}
        >
          Zona 3: Faenas Distantes
        </button>
      </div>

      {/* MAPA SVG TÁCTIL INTERACTIVO */}
      <div style={{
        backgroundColor: '#0f172a',
        border: 'var(--border-tactile)',
        borderRadius: 'var(--radius-sm)',
        padding: '1.5rem',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.25rem'
      }}>
        <svg viewBox="0 0 700 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Océano Pacífico */}
          <rect x="0" y="0" width="220" height="320" fill="#1e293b" />
          <text x="70" y="160" fill="#64748b" fontSize="14" fontWeight="800" letterSpacing="3">OCÉANO PACÍFICO</text>

          {/* Costa / Tierra */}
          <rect x="220" y="0" width="480" height="320" fill="#334155" />

          {/* Zona 3 (Faenas lejanas) */}
          <circle cx="430" cy="160" r="140" fill="#ea580c" opacity={selectedZone === 'rural' ? 0.45 : 0.15} stroke="#ea580c" strokeWidth="2" strokeDasharray="4 4" />

          {/* Zona 2 (Valle de Elqui) */}
          <circle cx="410" cy="160" r="95" fill="#2563eb" opacity={selectedZone === 'interurbana' ? 0.5 : 0.2} stroke="#2563eb" strokeWidth="2.5" />

          {/* Zona 1 (Urbana La Serena / Coquimbo) */}
          <circle cx="370" cy="160" r="55" fill="#f59e0b" opacity={selectedZone === 'urbana' ? 0.65 : 0.3} stroke="#f59e0b" strokeWidth="3" />

          {/* Punto Ferretería Los Maestros */}
          <circle cx="370" cy="160" r="8" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          <circle cx="370" cy="160" r="4" fill="#dc2626" />

          {/* Etiquetas geográficas */}
          <text x="385" y="155" fill="#ffffff" fontSize="13" fontWeight="900">FERRETERÍA LOS MAESTROS</text>
          <text x="385" y="172" fill="#fde047" fontSize="11" fontWeight="700">Av. Balmaceda 1420 (Casa Matriz)</text>

          <text x="310" y="210" fill="#e2e8f0" fontSize="11" fontWeight="700">Coquimbo Centro</text>
          <text x="310" y="110" fill="#e2e8f0" fontSize="11" fontWeight="700">Las Compañías</text>
          <text x="490" y="130" fill="#e2e8f0" fontSize="11" fontWeight="700">Vicuña (Valle de Elqui)</text>
          <text x="490" y="230" fill="#e2e8f0" fontSize="11" fontWeight="700">Andacollo</text>
        </svg>

        <div style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid #475569',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: '#cbd5e1'
        }}>
          Casa Matriz: <strong>La Serena, Chile</strong> &bull; GPS: -29.914, -71.250
        </div>
      </div>

      {/* FICHA TÉCNICA DE LA ZONA SELECCIONADA */}
      <div style={{
        backgroundColor: 'var(--bg-surface-alt)',
        border: 'var(--border-tactile)',
        borderRadius: 'var(--radius-sm)',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <MapPin size={20} color="var(--color-secondary)" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{active.nombre}</h4>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>Comunas / Sectores:</span>
            <span>{active.cobertura}</span>
          </div>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>Tiempo Estimado:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{active.tiempoEntrega}</span>
          </div>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>Tarifa de Despacho:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{active.costo}</span>
          </div>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>Descarga en Faena:</span>
            <span>{active.camionPluma}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
