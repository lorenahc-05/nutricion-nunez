import { useState } from 'react'
import { MENUS, PERFIL } from '../data/menus'
import BottomNav from '../components/BottomNav'
import RecipeModal from '../components/RecipeModal'
import './Menu.css'

const TOMAS = [
  { key: 'desayuno', label: 'Desayuno', icon: 'ti-coffee' },
  { key: 'media_manana', label: 'Media mañana', icon: 'ti-apple' },
  { key: 'comida', label: 'Comida', icon: 'ti-bowl' },
  { key: 'merienda', label: 'Merienda', icon: 'ti-apple' },
  { key: 'cena', label: 'Cena', icon: 'ti-moon' },
]

const diasLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function Menu({ menuActivo }) {
  const [diaActivo, setDiaActivo] = useState(0)
  const [selectedPlato, setSelectedPlato] = useState(null)

  const menu = MENUS[menuActivo]
  const dia = menu.dias[diaActivo]

  return (
    <div className="menu-page">

      <div className="menu-topbar">
        <div className="menu-avatar">LH</div>
        <div className="menu-topbar-text">
          <p>Hola,</p>
          <h2>{PERFIL.nombre}</h2>
        </div>
        <i className="ti ti-bell" />
      </div>

      <div className="week-strip">
        {menu.dias.map((d, i) => (
          <button
            key={i}
            className={`day-pill ${diaActivo === i ? 'active' : ''}`}
            onClick={() => setDiaActivo(i)}
          >
            <span>{diasLabels[i]}</span>
            <span>{d.numero}</span>
          </button>
        ))}
      </div>

      <div className="menu-content">
        {TOMAS.map(toma => {
          const platos = dia.tomas[toma.key]
          if (!platos || !platos.length) return null
          return (
            <div key={toma.key}>
              <p className="section-label">{toma.label}</p>
              {platos.map(plato => (
                <div
                  key={plato.id}
                  className="meal-card"
                  onClick={() => setSelectedPlato(plato)}
                >
                  <div className="meal-icon">
                    <i className={`ti ${toma.icon}`} />
                  </div>
                  <div className="meal-info">
                    <h4>{plato.nombre}</h4>
                    <p>{plato.ingredientes?.split(',').slice(0, 3).join(' · ')}</p>
                  </div>
                  <i className="ti ti-chevron-right" />
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {selectedPlato && (
        <RecipeModal plato={selectedPlato} onClose={() => setSelectedPlato(null)} />
      )}

      <BottomNav />
    </div>
  )
}