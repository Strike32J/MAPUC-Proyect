import { useEffect } from 'react'
import logo from '../../assets/logo/mapuc-logo.png'

export function SplashPage({ continuar }: { continuar: () => void }) {
  useEffect(() => { const timer = window.setTimeout(continuar, 1800); return () => window.clearTimeout(timer) }, [continuar])
  return <main className="splash"><div className="splash-contenido"><img src={logo} alt="MAPUC" /><h1>MAPUC</h1><p>Explora el campus PUCP</p><span className="cargando" aria-label="Cargando" /></div><small>Pontificia Universidad Católica del Perú</small></main>
}
