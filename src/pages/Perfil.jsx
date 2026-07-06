import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import './Perfil.css'

export default function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: perfilData }, { data: asignacion }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('asignaciones').select('*, menus(nombre)').eq('cliente_id', user.id).eq('activo', true).single()
    ])

    if (perfilData) setPerfil(perfilData)
    if (asignacion) setMenu(asignacion.menus)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  const iniciales = perfil ? `${perfil.nombre?.[0] || ''}${perfil.apellidos?.[0] || ''}`.toUpperCase() : '?'

  return (
    <div className="perfil-page">

      <div className="perfil-header">
        <div className="perfil-avatar">{iniciales}</div>
        <div className="perfil-info">
          <h2>{perfil?.nombre} {perfil?.apellidos}</h2>
          <p>Cliente desde {perfil?.fecha_inicio ? new Date(perfil.fecha_inicio).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : '—'}</p>
          <span className="badge-nutri">
            <i className="ti ti-user-check" />
            Victoria Pérez Núñez
          </span>
        </div>
      </div>

      <div className="perfil-content">

        <p className="section-title">Mis datos</p>
        <div className="info-card">
          <InfoRow icon="ti-cake" label="Edad" value={perfil?.fecha_nacimiento ? calcEdad(perfil.fecha_nacimiento) : '—'} />
          <InfoRow icon="ti-ruler" label="Altura" value={perfil?.altura_cm ? `${perfil.altura_cm} cm` : '—'} />
          <InfoRow icon="ti-weight" label="Peso inicial" value={perfil?.peso_inicial ? `${perfil.peso_inicial} kg` : '—'} />
          <InfoRow icon="ti-target" label="Peso objetivo" value={perfil?.peso_objetivo ? `${perfil.peso_objetivo} kg` : '—'} />
          <InfoRow icon="ti-run" label="Actividad física" value={perfil?.actividad_fisica || '—'} last />
        </div>

        <p className="section-title">Menú activo</p>
        <div className="menu-card-perfil">
          <div className="menu-card-icon">
            <i className="ti ti-clipboard-list" />
          </div>
          <div className="menu-card-info">
            <h4>{menu?.nombre || 'Sin menú asignado'}</h4>
            <p>7 días · 5 tomas diarias</p>
          </div>
          {menu && <span className="menu-badge-activo">Activo</span>}
        </div>

        <p className="section-title">Cuenta</p>
        <div className="info-card">
          <ActionRow icon="ti-mail" label={perfil?.email || '—'} />
          <ActionRow icon="ti-bell" label="Notificaciones" />
          <ActionRow icon="ti-lock" label="Cambiar contraseña" last />
        </div>

        <div className="info-card" style={{ marginBottom: 20 }}>
          <button className="logout-row" onClick={handleLogout}>
            <i className="ti ti-logout" />
            <span>Cerrar sesión</span>
          </button>
        </div>

        {/* FOOTER VICKI */}
        <div className="vicki-footer">
          <p className="footer-logo">Nutrición Núñez</p>
          <p className="footer-colegiada">Dietista-Nutricionista · Nº col. CV01319</p>
          <p className="footer-desc">Especializada en pérdida de peso, patología digestiva y trastornos de la conducta alimentaria. Alicante y online.</p>
          <hr className="footer-divider" />
          <div className="footer-row"><i className="ti ti-map-pin" /><span>C/ Arzobispo Loaces 30, entlo. dcha. 03003 Alicante</span></div>
          <div className="footer-row"><i className="ti ti-phone" /><span>618 087 594</span></div>
          <div className="footer-row"><i className="ti ti-mail" /><span>nutricionvictoriapereznunez@gmail.com</span></div>
          <div className="footer-row"><i className="ti ti-brand-instagram" /><span>@victricion</span></div>
          <div className="footer-row"><i className="ti ti-world" /><span>nutricionnunez.com</span></div>
          <div className="footer-social">
            <button className="social-btn"><i className="ti ti-brand-instagram" /></button>
            <button className="social-btn"><i className="ti ti-brand-tiktok" /></button>
            <button className="social-btn"><i className="ti ti-brand-facebook" /></button>
          </div>
          <div className="footer-legal">
            <div className="footer-legal-links">
              <a href="#">Aviso legal</a>
              <a href="#">Privacidad</a>
              <a href="#">Cookies</a>
            </div>
            <p className="footer-copy">© 2026 Nutrición Núñez · CIF 48675657K</p>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}

function InfoRow({ icon, label, value, last }) {
  return (
    <div className={`info-row ${last ? 'last' : ''}`}>
      <div className="info-row-left">
        <i className={`ti ${icon}`} />
        <span className="info-label">{label}</span>
      </div>
      <span className="info-value">{value}</span>
    </div>
  )
}

function ActionRow({ icon, label, last }) {
  return (
    <div className={`info-row ${last ? 'last' : ''}`}>
      <div className="info-row-left">
        <i className={`ti ${icon}`} />
        <span className="info-label">{label}</span>
      </div>
      <i className="ti ti-chevron-right" style={{ color: '#ccc' }} />
    </div>
  )
}

function calcEdad(fechaNac) {
  const hoy = new Date()
  const nac = new Date(fechaNac)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return `${edad} años`
}