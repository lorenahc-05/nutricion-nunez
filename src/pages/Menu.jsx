import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
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

function useUserName() {
  const [name, setName] = useState('')
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      supabase.from('profiles').select('nombre').eq('id', user.id).single()
        .then(({ data }) => { if (data) setName(data.nombre || '') })
    })
  }, [])
  return name
}

export default function Menu() {
  const [dias, setDias] = useState([])
  const [diaActivo, setDiaActivo] = useState(0)
  const [platos, setPlatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlato, setSelectedPlato] = useState(null)
  const userName = useUserName()

  useEffect(() => {
    fetchMenu()
  }, [])

  async function fetchMenu() {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: asignacion } = await supabase
      .from('asignaciones')
      .select('menu_id')
      .eq('cliente_id', user.id)
      .eq('activo', true)
      .single()

    if (!asignacion) { setLoading(false); return }

    const { data: diasData } = await supabase
      .from('menu_dias')
      .select('*')
      .eq('menu_id', asignacion.menu_id)
      .order('numero_dia')

    if (diasData) {
      setDias(diasData)
      fetchPlatos(diasData[0].id)
    }

    setLoading(false)
  }

  async function fetchPlatos(diaId) {
    const { data } = await supabase
      .from('tomas')
      .select(`*, platos(*)`)
      .eq('dia_id', diaId)
      .order('tipo')

    if (data) setPlatos(data)
  }

  function handleDia(index, diaId) {
    setDiaActivo(index)
    fetchPlatos(diaId)
  }

  const diasLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  if (loading) return <div className="loading"><div className="spinner" /></div>

  if (dias.length === 0) return (
    <div className="menu-empty">
      <i className="ti ti-clipboard-list" />
      <p>Aún no tienes ningún menú asignado.<br />Victoria te lo asignará pronto.</p>
      <BottomNav />
    </div>
  )

  return (
    <div className="menu-page">

      <div className="menu-topbar">
        <div className="menu-avatar">LH</div>
        <div className="menu-topbar-text">
          <p>Hola,</p>
          <h2>{userName}</h2>
        </div>
        <i className="ti ti-bell" />
      </div>

      <div className="week-strip">
        {dias.map((dia, i) => (
          <button
            key={dia.id}
            className={`day-pill ${diaActivo === i ? 'active' : ''}`}
            onClick={() => handleDia(i, dia.id)}
          >
            <span>{diasLabels[i] || `D${i + 1}`}</span>
            <span>{dia.numero_dia}</span>
          </button>
        ))}
      </div>

      <div className="menu-content">
        {TOMAS.map(toma => {
          const tomaData = platos.find(t => t.tipo === toma.key)
          if (!tomaData || !tomaData.platos.length) return null
          return (
            <div key={toma.key}>
              <p className="section-label">{toma.label}</p>
              {tomaData.platos.map(plato => (
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
        <RecipeModal
          plato={selectedPlato}
          onClose={() => setSelectedPlato(null)}
        />
      )}

      <BottomNav />
    </div>
  )
}