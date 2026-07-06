import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import Splash from './pages/Splash'
import Login from './pages/Login'
import Tablon from './pages/Tablon'
import Menu from './pages/Menu'
import Compra from './pages/Compra'
import Evolucion from './pages/Evolucion'
import Perfil from './pages/Perfil'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/admin/Dashboard'
import Clientes from './pages/admin/Clientes'
import Menus from './pages/admin/Menus'
import TablonAdmin from './pages/admin/TablonAdmin'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [role, setRole] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchRole(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchRole(session.user.id)
      else setRole(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchRole(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (data) setRole(data.role)
  }

  // Cargando sesión
  if (session === undefined) return null

  return (
    <BrowserRouter>
      <Routes>
        {/* Splash siempre accesible */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={
          session ? <Navigate to={role === 'admin' ? '/admin' : '/tablon'} replace /> : <Login />
        } />

        {/* Rutas cliente */}
        <Route path="/tablon" element={<ProtectedRoute session={session}><Tablon /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute session={session}><Menu /></ProtectedRoute>} />
        <Route path="/compra" element={<ProtectedRoute session={session}><Compra /></ProtectedRoute>} />
        <Route path="/evolucion" element={<ProtectedRoute session={session}><Evolucion /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute session={session}><Perfil /></ProtectedRoute>} />

        {/* Rutas admin */}
        <Route path="/admin" element={<ProtectedRoute session={session} adminOnly role={role}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/clientes" element={<ProtectedRoute session={session} adminOnly role={role}><Clientes /></ProtectedRoute>} />
        <Route path="/admin/menus" element={<ProtectedRoute session={session} adminOnly role={role}><Menus /></ProtectedRoute>} />
        <Route path="/admin/tablon" element={<ProtectedRoute session={session} adminOnly role={role}><TablonAdmin /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}