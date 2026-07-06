import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import './Tablon.css'

export default function Tablon() {
  const [posts, setPosts] = useState([])
  const [cita, setCita] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: postsData } = await supabase
      .from('tablon_posts')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    const { data: { user } } = await supabase.auth.getUser()

    const { data: citaData } = await supabase
      .from('citas')
      .select('*')
      .eq('cliente_id', user.id)
      .gte('fecha', new Date().toISOString().split('T')[0])
      .order('fecha', { ascending: true })
      .limit(1)
      .single()

    if (postsData) setPosts(postsData)
    if (citaData) setCita(citaData)
    setLoading(false)
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="tablon">
      <div className="tablon-header">
        <h1>Novedades</h1>
        <p>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="tablon-content">

        {/* PRÓXIMA CITA */}
        {cita && (
          <div className="cita-card">
            <span className="cita-label">
              <i className="ti ti-calendar" /> Próxima cita
            </span>
            <div className="cita-date">
              {new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              <br />a las {cita.hora}h
            </div>
            <div className="cita-sub">{cita.notas || 'Consulta de seguimiento'}</div>
            <div className="cita-footer">
              <span className="cita-chip">
                <i className={`ti ${cita.modalidad === 'online' ? 'ti-video' : 'ti-map-pin'}`} />
                {cita.modalidad === 'online' ? 'Videollamada' : 'Presencial'}
              </span>
              <div className="cita-avatar">VP</div>
            </div>
          </div>
        )}

        {/* POSTS */}
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}

      </div>

      <BottomNav />
    </div>
  )
}

function PostCard({ post }) {
  const icons = {
    curso: 'ti-school',
    tip: 'ti-bulb',
    evento: 'ti-calendar-event',
    cita: 'ti-calendar',
  }

  const colors = {
    curso: { bg: '#e8f4ee', icon: '#2d5a3d' },
    tip: { bg: '#fdeee4', icon: '#e8824a' },
    evento: { bg: '#fdeee4', icon: '#e8824a' },
    cita: { bg: '#e8f4ee', icon: '#2d5a3d' },
  }

  const c = colors[post.tipo] || colors.tip

  return (
    <div className="post-card">
      <div className="post-icon" style={{ background: c.bg }}>
        <i className={`ti ${icons[post.tipo] || 'ti-news'}`} style={{ color: c.icon }} />
      </div>
      <div className="post-body">
        <span className="post-tag">{post.tipo}</span>
        <h3>{post.titulo}</h3>
        {post.descripcion && <p>{post.descripcion}</p>}
        {post.fecha && (
          <span className="post-date">
            <i className="ti ti-clock" />
            {new Date(post.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            {post.hora && ` · ${post.hora}h`}
          </span>
        )}
      </div>
    </div>
  )
}