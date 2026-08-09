import { Link } from 'react-router-dom'
import { PreviewSwitcher } from './PreviewSwitcher'
import './ChooserPage.css'

export function ChooserPage() {
  return (
    <div className="chooser-page">
      <PreviewSwitcher />
      <div className="chooser-page__content">
        <p className="chooser-page__eyebrow">MAPUC · Comparación temporal</p>
        <h1>¿Qué styles.md usamos?</h1>
        <p className="chooser-page__lead">
          Dos versiones de la misma home, cada una implementando un documento de estilo
          distinto. Estas rutas son temporales: solo existen para decidir qué guía visual
          adoptar como base del frontend.
        </p>
        <div className="chooser-page__cards">
          <Link to="/preview/google-maps" className="chooser-card">
            <span className="chooser-card__badge">styles-google-maps.md</span>
            <h2>Maps Edition</h2>
            <p>
              Superficies planas, sombras contenidas, jerarquía por color sólido. El mapa
              manda, la UI sirve.
            </p>
            <span className="chooser-card__cta">Ver home →</span>
          </Link>
          <Link to="/preview/liquid-glass" className="chooser-card chooser-card--glass">
            <span className="chooser-card__badge">styles-liquid-glass.md</span>
            <h2>Liquid Glass Edition</h2>
            <p>
              Paneles de vidrio traslúcido que refractan el color del dato debajo. El
              vidrio informa, no decora.
            </p>
            <span className="chooser-card__cta">Ver home →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
