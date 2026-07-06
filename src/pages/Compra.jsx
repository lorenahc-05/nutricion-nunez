import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import './Compra.css'

export default function Compra() {
  const [items, setItems] = useState([])
  const [checked, setChecked] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompra()
  }, [])

  async function fetchCompra() {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: asignacion } = await supabase
      .from('asignaciones')
      .select('menu_id')
      .eq('cliente_id', user.id)
      .eq('activo', true)
      .single()

    if (!asignacion) { setLoading(false); return }

    const { data: dias } = await supabase
      .from('menu_dias')
      .select('id')
      .eq('menu_id', asignacion.menu_id)

    if (!dias) { setLoading(false); return }

    const diaIds = dias.map(d => d.id)

    const { data: tomas } = await supabase
      .from('tomas')
      .select('id')
      .in('dia_id', diaIds)

    if (!tomas) { setLoading(false); return }

    const tomaIds = tomas.map(t => t.id)

    const { data: platos } = await supabase
      .from('platos')
      .select('ingredientes')
      .in('toma_id', tomaIds)

    if (!platos) { setLoading(false); return }

    // Extrae y agrupa ingredientes únicos
    const todos = platos
      .flatMap(p => p.ingredientes?.split(',').map(i => i.trim()).filter(Boolean) || [])

    const unicos = [...new Set(todos)]
    setItems(unicos)
    setLoading(false)
  }

  function toggle(item) {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }))
  }

  const total = items.length
  const checkedCount = Object.values(checked).filter(Boolean).length
  const pct = total > 0 ? Math.round((checkedCount / total) * 100) : 0

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="compra-page">
      <div className="compra-header">
        <h1>Lista de la compra</h1>
        <p>Semana activa</p>
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
        {items.length === 0 ? (
          <div className="compra-empty">
            <i className="ti ti-shopping-cart" />
            <p>No hay ingredientes disponibles aún.</p>
          </div>
        ) : (
          items.map(item => (
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
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}