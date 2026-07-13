import { MENUS, CITA, POSTS } from '../data/menus'
import BottomNav from '../components/BottomNav'
import './Tablon.css'

const TIP_COLORS = ['#3d6b8a', '#7a5c3d', '#5a3d7a', '#3d7a5c']

export default function Tablon({ menuActivo, setMenuActivo }) {
  const curso = POSTS.find(p => p.tipo === 'curso')
  const tips = POSTS.filter(p => p.tipo === 'tip')
  const evento = POSTS.find(p => p.tipo === 'evento')

  return (
    <div className="tablon" style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      {/* resto del contenido igual */}
      ...
      <BottomNav />
    </div>
  )
}