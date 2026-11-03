import React, { useId, useState } from 'react';
import { MapPin, Truck, Clock, PackageCheck } from 'lucide-react';
import { shippingService } from '../../services/shippingService';

// Zonas de demostración. La tarifa procede del mismo servicio que utiliza el checkout.
const zones = {
  urbana: {
    label: 'La Serena y Coquimbo', button: 'Zona urbana', commune: 'La Serena',
    color: 'var(--color-primary)', time: '24 horas hábiles',
    description: 'Entregas urbanas en La Serena y Coquimbo.',
    note: 'Sin costo desde $100.000. Para compras menores se aplica la tarifa base.',
    unloading: 'Descarga de materiales a coordinar según el acceso a la obra.'
  },
  interurbana: {
    label: 'Valle de Elqui', button: 'Valle de Elqui', commune: 'Vicuña',
    color: 'var(--color-contractor)', time: '24 a 48 horas hábiles',
    description: 'Despacho de demostración a la comuna de Vicuña.',
    note: 'Tarifa de demostración por despacho. Otras localidades requieren cotización.',
    unloading: 'Camión de reparto sujeto a coordinación con la faena.'
  },
  rural: {
    label: 'Otras comunas y faenas', button: 'Otras comunas', commune: 'Andacollo',
    color: 'var(--color-accent)', time: 'A coordinar con la tienda',
    description: 'Andacollo, Combarbalá, Illapel y ubicaciones fuera de la cobertura automática.',
    note: 'El costo y la disponibilidad se confirman antes de realizar el pedido.',
    unloading: 'Se revisan ubicación, carga y condiciones de acceso.'
  }
};
const communes = ['La Serena', 'Coquimbo', 'Vicuña', 'Andacollo', 'Combarbalá', 'Illapel', 'Otra comuna'];
const getZone = commune => ['La Serena', 'Coquimbo'].includes(commune) ? 'urbana' : commune === 'Vicuña' ? 'interurbana' : 'rural';
const formatPrice = value => `$${value.toLocaleString('es-CL')}`;

// Ilustración vectorial propia: conexiones orientativas, sin coordenadas ni escala real.
const CoverageIllustration = ({ commune, zone, onSelect }) => (
  <div className="coverage-map" data-zone={zone}>
    <svg viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect width="1000" height="560" fill="#eaf3f4" />
      <path d="M260 0 C245 80 300 140 275 210 S230 340 275 400 S300 510 290 560 H1000 V0Z" fill="#f2efe4" />
      <path d="M245 0 C230 80 285 140 260 210 S215 340 260 400 S285 510 275 560" fill="none" stroke="#a9d6dc" strokeWidth="18" />
      <g fill="none" stroke="#bddde5" strokeWidth="3" opacity=".7">
        <path d="M45 90 Q95 65 145 90 T245 90" /><path d="M20 140 Q70 115 120 140 T220 140" />
        <path d="M35 430 Q85 405 135 430 T235 430" /><path d="M10 480 Q60 455 110 480 T210 480" />
      </g>
      {/* Relieve y valle ilustrados */}
      <path d="M1000 65 Q790 95 680 145 T370 245" fill="none" stroke="#d3e0c4" strokeWidth="100" />
      <path d="M1000 65 Q790 95 680 145 T370 245" fill="none" stroke="#b8cfab" strokeWidth="3" />
      <g fill="#e4dcc9" stroke="#d5cbb6" strokeWidth="2">
        <path d="M520 530 L590 420 L660 530Z" /><path d="M610 530 L725 345 L840 530Z" />
        <path d="M785 530 L870 400 L960 530Z" /><path d="M770 100 L840 20 L910 100Z" />
      </g>
      {/* Trama urbana simplificada */}
      <g fill="#e0dfd4" stroke="#f9f8f3" strokeWidth="5">
        <rect x="315" y="135" width="42" height="38" rx="5" /><rect x="365" y="135" width="42" height="38" rx="5" />
        <rect x="310" y="180" width="42" height="38" rx="5" /><rect x="360" y="180" width="42" height="38" rx="5" />
        <rect x="300" y="350" width="45" height="38" rx="5" /><rect x="350" y="350" width="45" height="38" rx="5" />
        <rect x="315" y="395" width="45" height="38" rx="5" /><rect x="365" y="395" width="45" height="38" rx="5" />
        <rect x="755" y="110" width="42" height="34" rx="5" /><rect x="805" y="115" width="42" height="34" rx="5" />
      </g>
      <path className="coverage-area coverage-area--urbana" d="M300 100 Q440 75 470 220 L450 415 Q345 490 290 420 L280 225Z" />
      <path className="coverage-area coverage-area--interurbana" d="M400 210 Q585 100 850 100 L875 205 Q640 180 440 290Z" />
      <path className="coverage-area coverage-area--rural" d="M475 310 Q620 280 770 375 L795 485 Q580 515 475 410Z" />
      {/* Caminos: el color señala la zona elegida, sin representar límites geográficos. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M350 0 Q440 125 370 240 T355 560" stroke="#fff" strokeWidth="18" />
        <path d="M350 0 Q440 125 370 240 T355 560" stroke="#c9bfa5" strokeWidth="3" strokeDasharray="8 9" />
        <path d="M365 245 Q550 180 810 157" stroke="#fff" strokeWidth="18" />
        <path className="coverage-road coverage-road--interurbana" d="M365 245 Q550 180 810 157" />
        <path d="M365 245 Q540 300 700 445" stroke="#fff" strokeWidth="18" />
        <path className="coverage-road coverage-road--rural" d="M365 245 Q540 300 700 445" />
        <path className="coverage-road coverage-road--urbana" d="M365 245 Q315 315 355 405" />
      </g>
    </svg>
    <span className="coverage-map-kicker">DESDE LA SERENA</span>
    <span className="coverage-ocean">Océano<br />Pacífico</span>
    <button type="button" className="coverage-depot" onClick={() => onSelect('La Serena')} aria-label="Consultar despacho a La Serena" aria-pressed={commune === 'La Serena'}>
      <span className="coverage-depot-icon"><MapPin size={22} /></span>
      <span><small>Casa matriz</small><strong>Los Maestros</strong><span>La Serena</span></span>
    </button>
    {[
      { name: 'Coquimbo', className: 'coquimbo', zone: 'urbana' },
      { name: 'Vicuña', className: 'vicuna', zone: 'interurbana' },
      { name: 'Andacollo', className: 'andacollo', zone: 'rural' }
    ].map(place => <button key={place.name} type="button" className={`coverage-place coverage-place--${place.className}`} data-place-zone={place.zone} aria-label={`Consultar despacho a ${place.name}`} aria-pressed={commune === place.name} onClick={() => onSelect(place.name)}>
      <span className="coverage-place-dot" /><span>{place.name}</span>
    </button>)}
    <span className="coverage-map-scale">Ilustración sin escala</span>
  </div>
);

export const CoverageMap = () => {
  const id = useId();
  const [commune, setCommune] = useState('La Serena');
  const selectedZone = getZone(commune);
  const active = zones[selectedZone];
  const quote = shippingService.quote({ deliveryType: 'DESPACHO_OBRA', commune, subtotal: 0 });

  return (
    <section className="bento-card coverage-card" aria-labelledby={`${id}-title`} style={{ '--coverage-accent': active.color }}>
      <div className="coverage-heading">
        <span className="badge-tactile"><Truck size={14} /> Logística y despacho en obra</span>
        <h3 id={`${id}-title`} className="bento-title">Cobertura referencial de despacho</h3>
        <p className="bento-subtitle">Elige una comuna y conoce las opciones de entrega. Este esquema es ilustrativo y no valida una dirección exacta.</p>
      </div>

      {/* Una sola selección mantiene coherentes comuna, zona y tarifa. */}
      <div className="coverage-controls">
        <div>
          <label htmlFor={`${id}-commune`} className="label-tactile">Consultar comuna</label>
          <select id={`${id}-commune`} className="select-tactile" value={commune} onChange={event => setCommune(event.target.value)}>
            {communes.map(name => <option key={name}>{name}</option>)}
          </select>
        </div>
        <div className="coverage-quote" role="status" aria-live="polite">
          <span>Tarifa base para {commune.toLowerCase() === 'otra comuna' ? 'otra comuna' : commune}</span>
          <strong>{quote.available ? formatPrice(quote.fee) : 'Solicitar cotización'}</strong>
          <small>{selectedZone === 'urbana' ? 'Compras menores a $100.000' : quote.available ? 'Por despacho de demostración' : 'Retiro gratuito disponible en tienda'}</small>
        </div>
      </div>
      <div className="coverage-zone-buttons" role="group" aria-label="Zonas de despacho">
        {Object.entries(zones).map(([key, zone]) => <button key={key} type="button" className="btn-tactile btn-tactile-sm" aria-pressed={selectedZone === key} onClick={() => setCommune(zone.commune)} style={{ '--zone-color': zone.color }}>
          <span className="coverage-zone-dot" />{zone.button}
        </button>)}
      </div>

      <div className="coverage-layout">
        <figure className="coverage-figure">
          <CoverageIllustration commune={commune} zone={selectedZone} onSelect={setCommune} />
          <figcaption>Conexiones orientativas entre La Serena, Coquimbo, el Valle de Elqui y otras faenas. No representa distancias ni límites reales de cobertura.</figcaption>
        </figure>
        <aside className="coverage-details" aria-label="Información de la zona seleccionada">
          <span className="coverage-zone-label">Zona seleccionada</span>
          <h4>{active.label}</h4>
          <p>{active.description}</p>
          <dl>
            <div><dt><Truck size={18} /> Despacho</dt><dd>{quote.available ? 'Disponible en la demo' : 'Sujeto a cotización'}</dd></div>
            <div><dt><Clock size={18} /> Plazo referencial</dt><dd>{active.time}</dd></div>
            <div><dt><PackageCheck size={18} /> Descarga</dt><dd>{active.unloading}</dd></div>
          </dl>
          <p className="coverage-note">{active.note}</p>
          <small className="coverage-disclaimer">Tarifas y plazos de demostración. Las condiciones de una entrega real se confirman con la tienda.</small>
        </aside>
      </div>
    </section>
  );
};
