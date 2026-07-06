import { useState, useMemo } from 'react'
import { MENUS } from '../data/menus'
import BottomNav from '../components/BottomNav'
import './Compra.css'

export default function Compra({ menuActivo }) {
  const [checked, setChecked] = useState({})

  const items = useMemo(() => {
    const menu = MENUS[menuActivo]
    const todos = menu.dias.flatMap(dia =>
      Object.values(dia.tomas).flatMap(platos =>
        platos.flatMap(p => p.ingredientes?.split(',').map(i => i.trim()).filter(Boolean) || [])
      )
    )
    return [...new Set(todos)]
  }, [menuActivo])

  function toggle(item) {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }))
  }

  const total = items.length
  const checkedCount = Object.values(checked).filter(Boolean).length
  const pct = total > 0 ? Math.round((checkedCount / total) * 100) : 0

  return (
    <div className="compra-page">
      <div className="compra-header">
        <h1>Lista de la compra</h1>
        <p>{MENUS[menuActivo].nombre}</p>
      </div>

      <div className="compra-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-labels">
          <span>{checkedCount} de {total} productos</span>
          <span>{pct}%</span>
        </div>
      </div>

      <div className="compra-content">
        {items.map(item => (
          <div
            key={item}
            className={`compra-item ${checked[item] ? 'checked' : ''}`}
            onClick={() => toggle(item)}
          >
            <div className={`check-circle ${checked[item] ? 'done' : ''}`}>
              {checked[item] && <i className="ti ti-check" />}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}