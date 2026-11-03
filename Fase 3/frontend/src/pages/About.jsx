import React, { useState } from 'react';
import { Users, Award, ShieldCheck, HeartHandshake, ArrowUpRight } from 'lucide-react';
import { CoverageMap } from '../components/common/CoverageMap';

// Valores de la empresa y ejemplos de su aplicación en la atención del mesón.
const companyValues = [
  {
    id: 'compromiso',
    nombre: 'Compromiso',
    icon: ShieldCheck,
    titulo: 'Tu obra necesita respuestas claras.',
    descripcion: 'Una compra comienza por entender qué necesitas, qué materiales están disponibles y cómo se coordinará la entrega. Queremos que puedas organizar tu trabajo con información clara desde la primera consulta.',
    ejemploTitulo: 'Necesitas materiales para comenzar una faena.',
    ejemplo: 'Revisamos las existencias y las condiciones de entrega antes de cerrar el pedido. Si falta un material, conversamos las alternativas para que puedas organizar los siguientes pasos de tu obra.',
    nota: 'Materiales y despacho, coordinados desde el mesón.'
  },
  {
    id: 'experiencia',
    nombre: 'Experiencia',
    icon: Award,
    titulo: 'El oficio también se comparte.',
    descripcion: 'Cada reparación y cada obra requieren materiales y herramientas adecuados. Nuestra experiencia en ferretería se traduce en orientación práctica para comparar opciones y comprender sus usos antes de elegir.',
    ejemploTitulo: 'Buscas una herramienta para un trabajo específico.',
    ejemplo: 'Te ayudamos a revisar sus características, medidas y accesorios, considerando el material que vas a trabajar. La idea es que conozcas las diferencias entre las alternativas y elijas con mayor confianza.',
    nota: 'Conocimiento del rubro al servicio de tu proyecto.'
  },
  {
    id: 'confianza',
    nombre: 'Confianza',
    icon: HeartHandshake,
    titulo: 'Una relación que continúa después de la compra.',
    descripcion: 'Atendemos a familias, maestros y contratistas que necesitan un proveedor cercano. Construimos esa relación con acuerdos claros sobre los productos, la entrega y las condiciones de cada compra.',
    ejemploTitulo: 'Coordinas compras para las distintas etapas de una obra.',
    ejemplo: 'Conversamos las cantidades, el retiro o despacho y las condiciones de pago antes de confirmar. Para clientes habilitados con cuenta corriente, la claridad en sus compras y saldos es parte de esa relación.',
    nota: 'Atención cercana y cuentas claras para seguir construyendo.'
  }
];

export const About = () => {
  const [activeValue, setActiveValue] = useState('compromiso');
  const selectedValue = companyValues.find(value => value.id === activeValue);
  const SelectedValueIcon = selectedValue.icon;

  const team = [
    {
      nombre: 'Don Carlos Vega Osorio',
      cargo: 'Fundador & Maestro Mayor',
      experiencia: 'Más de 35 años en obras civiles y ferretería estructural',
      descripcion: 'Conoce cada requerimiento de una faena en la IV Región. Fundó la ferretería hace 22 años para ofrecer abastecimiento confiable a los maestros constructores locales.',
      color: 'bento-card-primary'
    },
    {
      nombre: 'Ricardo Valdés Pizarro',
      cargo: 'Especialista en Herramientas & Servicio Técnico',
      experiencia: '12 años de trayectoria técnica industrial',
      descripcion: 'Encargado de demostraciones, asesoría en maquinaria eléctrica Makita y Bosch, garantías oficiales y servicio de mantención preventiva.',
      color: ''
    },
    {
      nombre: 'María Ignacia Díaz',
      cargo: 'Asesora Comercial & Logística de Faenas',
      experiencia: 'Gestión de suministros y convenios para contratistas',
      descripcion: 'Coordina los despachos en camión pluma a las distintas obras de la región y administra las líneas de cuenta corriente mensual para contratistas.',
      color: 'bento-card-contractor'
    }
  ];

  return (
    <div className="container page-container">
      {/* CABECERA */}
      <div className="section-header">
        <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
          TRAYECTORIA Y COMPROMISO
        </span>
        <h1 className="section-title">
          <Users size={30} /> Sobre Ferretería Los Maestros
        </h1>
        <p className="section-subtitle">
          22 años apoyando el desarrollo constructivo de La Serena, Coquimbo y el Valle de Elqui.
        </p>
      </div>

      {/* HISTORIA Y TRAYECTORIA EN BENTO GRID */}
      <div className="grid-2 about-overview" style={{ marginBottom: 'var(--space-2xl)' }}>
        <article className="bento-card about-history">
          <div className="about-history-copy">
            <h2 className="about-card-title">Nuestra Historia y Misión</h2>
            <p>
              <strong>Ferretería Los Maestros</strong> nació en la ciudad de La Serena como una iniciativa familiar
              para responder a una necesidad latente: los maestros de obra y contratistas requerían un proveedor que
              entendiera los tiempos de faena, mantuviera stock permanente sin falsas promesas y ofreciera condiciones
              de crédito accesibles.
            </p>
            <p>
              Con más de dos décadas de experiencia, nos hemos consolidado como el punto de encuentro técnico en
              Av. Balmaceda, combinando atención cercana en mesón con herramientas digitales modernas de consulta y despacho.
            </p>
            <p>
              Nuestra misión es facilitar el acceso a materiales y herramientas, con orientación para elegir
              y una atención que entienda cada proyecto. Queremos que familias, maestros y contratistas encuentren
              un apoyo cercano para planificar sus compras, desde una reparación en casa hasta una faena de mayor escala.
            </p>
          </div>

          {/* CIERRE DE TRAYECTORIA */}
          <div className="about-history-footer">
            <div className="about-history-years">
              <strong>22</strong>
              <span>Años de trayectoria</span>
            </div>
            <div className="about-history-signature">
              <p>El oficio nos reúne.<br /><strong>Tu proyecto nos mueve.</strong></p>
              <p>
                Desde La Serena, acompañamos a familias, maestros y contratistas en sus proyectos.
                Cada consulta es una oportunidad para compartir experiencia y construir una relación de confianza,
                desde la elección del material hasta la coordinación de su entrega.
              </p>
            </div>
          </div>
        </article>

        {/* VALORES INTERACTIVOS Y EJEMPLOS DE ATENCIÓN */}
        <article className="bento-card bento-card-dark about-values">
          <div className="bento-header">
            <span className="badge-tactile about-values-badge">VALORES DE EMPRESA</span>
          </div>
          <h2 className="about-card-title">Así trabajamos contigo</h2>
          <p className="about-values-intro">
            Conoce cómo llevamos nuestros valores a la atención de cada día. Selecciona uno para ver un ejemplo.
          </p>

          <div className="about-values-buttons" role="group" aria-label="Valores de la empresa">
            {companyValues.map(value => {
              const ValueIcon = value.icon;
              return (
                <button
                  key={value.id}
                  type="button"
                  className="btn-tactile"
                  aria-pressed={activeValue === value.id}
                  aria-controls="about-value-detail"
                  onClick={() => setActiveValue(value.id)}
                >
                  <ValueIcon size={20} aria-hidden="true" />
                  <span>{value.nombre}</span>
                </button>
              );
            })}
          </div>

          <section id="about-value-detail" className="about-value-detail" aria-label="Detalle del valor seleccionado" aria-live="polite" aria-atomic="true">
            <h3 className="about-value-title">
              <SelectedValueIcon size={22} aria-hidden="true" />
              <span>{selectedValue.titulo}</span>
            </h3>
            <p>{selectedValue.descripcion}</p>

            <div className="about-value-example">
              <span className="about-eyebrow">En el mesón</span>
              <h4>{selectedValue.ejemploTitulo}</h4>
              <p>{selectedValue.ejemplo}</p>
            </div>

            <p className="about-value-note">
              <ArrowUpRight size={16} aria-hidden="true" />
              <span>{selectedValue.nota}</span>
            </p>
          </section>
        </article>
      </div>

      {/* EQUIPO HUMANO */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>
          Nuestro Equipo en Mesón y Faena
        </h2>
        <div className="grid-3">
          {team.map((member) => (
            <div key={member.nombre} className={`bento-card ${member.color}`} style={{ padding: '1.75rem' }}>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--color-secondary)' }}>
                {member.nombre}
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {member.cargo}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.75rem' }}>
                {member.experiencia}
              </div>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.5, color: '#334155' }}>
                {member.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MAPA DE COBERTURA */}
      <section>
        <CoverageMap />
      </section>
    </div>
  );
};
