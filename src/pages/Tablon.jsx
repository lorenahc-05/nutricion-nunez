import { MENUS, CITA, POSTS } from '../data/menus'
import BottomNav from '../components/BottomNav'
import './Tablon.css'

const TIP_COLORS = ['#3d6b8a', '#7a5c3d', '#5a3d7a', '#3d7a5c']

export default function Tablon({ menuActivo, setMenuActivo }) {
  const curso = POSTS.find(p => p.tipo === 'curso')
  const tips = POSTS.filter(p => p.tipo === 'tip')
  const evento = POSTS.find(p => p.tipo === 'evento')

  return (
    <div className="tablon">

      <div className="tablon-topbar">
        <h1>Novedades</h1>
        <div className="tablon-notif">
          <i className="ti ti-bell" aria-hidden="true" />
        </div>
      </div>

      <div className="menu-selector">
        <p>Menú activo:</p>
        <div className="menu-selector-btns">
          {MENUS.map((m, i) => (
            <button
              key={m.id}
              className={`menu-selector-btn ${menuActivo === i ? 'active' : ''}`}
              onClick={() => setMenuActivo(i)}
            >
              {m.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* HERO — curso destacado */}
      {curso && (
        <div className="hero-card">
          <span className="hero-badge">Nuevo</span>
          <p className="hero-tag">Curso online · 6 semanas</p>
          <h3>{curso.titulo}</h3>
          <p>{curso.descripcion}</p>
          <div className="hero-dots">
            <span className="active"></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* TIPS GRID */}
      {tips.length > 0 && (
        <>
          <p className="section-label">Tips de la semana</p>
          <div className="tips-grid">
            {tips.map((tip, i) => (
              <div
                key={tip.id}
                className="tip-mini"
                style={{ background: TIP_COLORS[i % TIP_COLORS.length] }}
              >
                <div className="tip-mini-overlay" />
                <span className="tip-mini-badge">Tip</span>
                <div className="tip-mini-content">
                  <span className="tag">{tip.subtag || 'Nutrición'}</span>
                  <h4>{tip.titulo}</h4>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EVENTO */}
      {evento && (
        <>
          <p className="section-label">Próximo evento</p>
          <div className="evento-card">
            <div className="evento-date">
              <div className="day">{new Date(evento.fecha).getDate()}</div>
              <div className="month">
                {new Date(evento.fecha).toLocaleDateString('es-ES', { month: 'short' })}
              </div>
            </div>
            <div className="evento-body">
              <span className="tag">{evento.lugar || 'Taller presencial'}</span>
              <h4>{evento.titulo}</h4>
              <p>{evento.hora}h</p>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}