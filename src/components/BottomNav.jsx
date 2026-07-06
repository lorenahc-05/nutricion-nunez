import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNav.css'

const items = [
  { path: '/tablon', icon: 'ti-layout-board', label: 'Tablón' },
  { path: '/menu', icon: 'ti-calendar', label: 'Menú' },
  { path: '/compra', icon: 'ti-shopping-cart', label: 'Compra' },
  { path: '/evolucion', icon: 'ti-chart-line', label: 'Evolución' },
  { path: '/perfil', icon: 'ti-user', label: 'Perfil' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <i className={`ti ${item.icon}`} aria-hidden="true" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}