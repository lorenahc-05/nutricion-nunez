import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Splash.css'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 3500)
    return () => clearTimeout(timer)
  }, [navigate])
  useEffect(() => {
  const dur = ms => new Promise(r => setTimeout(r, ms))
  const ease = t => 1 - Math.pow(1 - t, 3)

  function tween(ms, fn) {
    return new Promise(resolve => {
      const start = performance.now()
      function tick(now) {
        const t = Math.min((now - start) / ms, 1)
        fn(ease(t), t)
        if (t < 1) requestAnimationFrame(tick); else resolve()
      }
      requestAnimationFrame(tick)
    })
  }

  async function animate() {
    await dur(300)
    const carrot = document.getElementById('carrot')
    if (!carrot) return

    await tween(420, (e, t) => {
      const s = t < 0.8 ? e * 1.1 : 1 + (1 - e) * 0.1
      carrot.style.transform = `scale(${s})`
    })
    await dur(100)
    tween(480, e => { document.getElementById('crn').setAttribute('width', e * 190) })
    await dur(380)
    tween(320, e => { document.getElementById('clb').setAttribute('width', e * 180) })
    await dur(200)
    tween(380, e => {
      document.getElementById('cls').setAttribute('width', e * 145)
      document.getElementById('cnn').setAttribute('width', e * 145)
    })
  }

  animate()
}, [])

  return (
    <div className="splash">
      <div className="splash-logo">
        <svg width="260" height="100" viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" overflow="visible">
          <defs>
            <clipPath id="clip-nutricion"><rect id="crn" x="62" y="0" width="0" height="60"/></clipPath>
            <clipPath id="clip-lb"><rect id="clb" x="62" y="42" width="0" height="4"/></clipPath>
            <clipPath id="clip-ls"><rect id="cls" x="62" y="56" width="0" height="12"/></clipPath>
            <clipPath id="clip-nunez"><rect id="cnn" x="62" y="56" width="0" height="32"/></clipPath>
          </defs>

          <g id="carrot" style={{ transformOrigin: '30px 48px', transform: 'scale(0)' }}>
            <ellipse cx="30" cy="52" rx="24" ry="18" fill="#e8824a" transform="rotate(-10, 30, 52)"/>
            <ellipse cx="32" cy="58" rx="18" ry="11" fill="#d4723a" transform="rotate(-10, 32, 58)" opacity="0.5"/>
            <path d="M26,30 Q18,12 28,20 Q24,30 26,30Z" fill="#7ecfa0"/>
            <path d="M32,28 Q36,10 42,22 Q36,28 32,28Z" fill="#5ab07a"/>
            <path d="M20,34 Q8,22 18,28 Q20,34 20,34Z" fill="#9ddbb8"/>
          </g>

          <g clipPath="url(#clip-nutricion)">
            <text x="64" y="40" fontFamily="Georgia,'Times New Roman',serif" fontSize="36" fontStyle="italic" fontWeight="700" fill="#ffffff" letterSpacing="-0.5">Nutrición</text>
          </g>
          <g clipPath="url(#clip-lb)">
            <rect x="64" y="44" width="180" height="1.5" fill="rgba(255,255,255,0.6)"/>
          </g>
          <g clipPath="url(#clip-ls)">
            <rect x="64" y="58" width="140" height="10" fill="rgba(232,130,74,0.45)" rx="2"/>
          </g>
          <g clipPath="url(#clip-nunez)">
            <text x="66" y="70" fontFamily="Arial,sans-serif" fontSize="20" fontWeight="700" fill="#ffffff" letterSpacing="7">NÚÑEZ</text>
          </g>
        </svg>
      </div>
    </div>
  )
}