import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import BottomNav from '../components/BottomNav'
import './Evolucion.css'

export default function Evolucion() {
  const [registros, setRegistros] = useState([])
  const [perfil, setPerfil] = useState(null)
  const [nuevoP, setNuevoP] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: perfilData }, { data: registrosData }] = await Promise.all([
      supabase.from('profiles').select('nombre, peso_inicial, peso_objetivo').eq('id', user.id).single(),
      supabase.from('peso_registros').select('*').eq('cliente_id', user.id).order('fecha', { ascending: true })
    ])

    if (perfilData) setPerfil(perfilData)
    if (registrosData) setRegistros(registrosData)
    setLoading(false)
  }

  async function handleGuardar() {
    const val = parseFloat(nuevoP)
    if (isNaN(val) || val < 30 || val > 300) return

    const { data: { user } } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('peso_registros')
      .insert({ cliente_id: user.id, peso: val, fecha: new Date().toISOString().split('T')[0] })
      .select()
      .single()

    if (data) {
      setRegistros(prev => [...prev, data])
      setNuevoP('')
    }
  }

  const ultimo = registros[registros.length - 1]?.peso
  const primero = registros[0]?.peso || perfil?.peso_inicial
  const diferencia = ultimo && primero ? (ultimo - primero).toFixed(1) : null
  const restante = ultimo && perfil?.peso_objetivo ? (ultimo - perfil.peso_objetivo).toFixed(1) : null

  const chartData = registros.map(r => ({
    fecha: new Date(r.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    peso: r.peso
  }))

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="evolucion-page">

      <div className="evolucion-header">
        <h1>Mi evolución</h1>
        <p>Seguimiento de peso</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Peso actual</span>
          <span className="stat-value">{ultimo ? `${ultimo} kg` : '—'}</span>
          {diferencia && (
            <span className={`stat-delta ${parseFloat(diferencia) < 0 ? 'good' : 'bad'}`}>
              {parseFloat(diferencia) < 0 ? '▼' : '▲'} {Math.abs(diferencia)} kg desde el inicio
            </span>
          )}
        </div>
        <div className="stat-card">
          <span className="stat-label">Objetivo</span>
          <span className="stat-value">{perfil?.peso_objetivo ? `${perfil.peso_objetivo} kg` : '—'}</span>
          {restante && (
            <span className="stat-sub">
              {parseFloat(restante) > 0 ? `Quedan ${restante} kg` : '¡Objetivo alcanzado!'}
            </span>
          )}
        </div>
      </div>

      <div className="evolucion-content">

        {chartData.length > 1 && (
          <div className="chart-card">
            <h4>Evolución</h4>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10, fill: '#aaa' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}kg`}
                  width={40}
                />
                <Tooltip
                  formatter={v => [`${v} kg`, 'Peso']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #ede8e1' }}
                />
                {perfil?.peso_objetivo && (
                  <ReferenceLine y={perfil.peso_objetivo} stroke="#e8824a" strokeDasharray="4 4" />
                )}
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#2d5a3d"
                  strokeWidth={2}
                  dot={{ fill: '#e8824a', r: 4, strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="registro-card">
          <h4>Registrar peso de hoy</h4>
          <div className="registro-row">
            <input
              type="number"
              className="peso-input"
              value={nuevoP}
              onChange={e => setNuevoP(e.target.value)}
              placeholder="00.0"
              step="0.1"
              min="30"
              max="300"
            />
            <span className="peso-unit">kg</span>
            <button className="btn-guardar" onClick={handleGuardar}>Guardar</button>
          </div>
        </div>

        <div className="historial-card">
          <h4>Historial</h4>
          {registros.length === 0 ? (
            <p className="historial-empty">Aún no hay registros.</p>
          ) : (
            [...registros].reverse().map((r, i, arr) => {
              const prev = arr[i + 1]
              const diff = prev ? (r.peso - prev.peso).toFixed(1) : null
              return (
                <div key={r.id} className="historial-row">
                  <span className="historial-fecha">
                    {new Date(r.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="historial-peso">{r.peso} kg</span>
                  {diff && (
                    <span className={`historial-delta ${parseFloat(diff) < 0 ? 'down' : 'up'}`}>
                      {parseFloat(diff) < 0 ? '▼' : '▲'} {Math.abs(diff)} kg
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  )
}