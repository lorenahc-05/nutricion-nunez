import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Actualiza el perfil con nombre y apellidos
    if (data.user) {
      await supabase.from('profiles').update({ nombre, apellidos }).eq('id', data.user.id)
    }

    setLoading(false)
  }

  return (
    <div className="login">
      <div className="login-top">
        <div className="login-logo">
          <span className="logo-text">Nutrición Núñez</span>
          <span className="logo-sub">DIETISTA · NUTRICIONISTA</span>
        </div>
      </div>

      <div className="login-card">
        <h1>{mode === 'login' ? 'Bienvenida' : 'Crear cuenta'}</h1>
        <p>{mode === 'login' ? 'Accede a tu plan personalizado' : 'Rellena tus datos para registrarte'}</p>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {mode === 'register' && (
            <>
              <div className="field">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Apellidos</label>
                <input
                  type="text"
                  placeholder="Tus apellidos"
                  value={apellidos}
                  onChange={e => setApellidos(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <button className="btn-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}>
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  )
}