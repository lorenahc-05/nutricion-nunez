import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import Splash from './pages/Splash'
import Tablon from './pages/Tablon'
import Menu from './pages/Menu'
import Compra from './pages/Compra'
import Evolucion from './pages/Evolucion'
import Perfil from './pages/Perfil'

export default function App() {
  const [menuActivo, setMenuActivo] = useState(0) // 0 = febrero, 1 = abril

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/tablon" element={<Tablon menuActivo={menuActivo} setMenuActivo={setMenuActivo} />} />
        <Route path="/menu" element={<Menu menuActivo={menuActivo} />} />
        <Route path="/compra" element={<Compra menuActivo={menuActivo} />} />
        <Route path="/evolucion" element={<Evolucion />} />
        <Route path="/perfil" element={<Perfil menuActivo={menuActivo} />} />
        <Route path="*" element={<Navigate to="/tablon" replace />} />
      </Routes>
    </BrowserRouter>
  )
}