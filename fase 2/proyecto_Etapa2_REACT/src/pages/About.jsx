import React from 'react';
import { Users, Award, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';
import { CoverageMap } from '../components/common/CoverageMap';

export const About = () => {
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

      {/* HISTORIA EN BENTO GRID */}
      <div className="bento-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
        <article className="bento-card bento-col-span-2" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>
            Nuestra Historia y Misión
          </h2>
          <p style={{ lineHeight: 1.7, color: '#334155', marginBottom: '1rem', fontSize: '1.025rem' }}>
            <strong>Ferretería Los Maestros</strong> nació en la ciudad de La Serena como una iniciativa familiar 
            para responder a una necesidad latente: los maestros de obra y contratistas requerían un proveedor que 
            entendiera los tiempos de faena, mantuviera stock permanente sin falsas promesas y ofreciera condiciones 
            de crédito accesibles.
          </p>
          <p style={{ lineHeight: 1.7, color: '#334155', fontSize: '1.025rem' }}>
            Con más de dos décadas de experiencia, nos hemos consolidado como el punto de encuentro técnico en 
            Av. Balmaceda, combinando atención cercana en mesón con herramientas digitales modernas de consulta y despacho.
          </p>
        </article>

        <article className="bento-card bento-card-dark" style={{ padding: '2rem' }}>
          <div className="bento-header">
            <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}>
              VALORES DE EMPRESA
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Transparencia de Stock:</strong> Si el producto figura en el catálogo, está físicamente en bodega listo para entrega.
              </div>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <HeartHandshake size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Confianza con Contratistas:</strong> Cuentas corrientes claras sin sorpresas a fin de mes.
              </div>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Award size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Marcas Certificadas:</strong> Solo materiales normalizados bajo estándares chilenos de calidad.
              </div>
            </li>
          </ul>
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
