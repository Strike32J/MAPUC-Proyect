import { NavLink } from 'react-router-dom'
import './PreviewSwitcher.css'

const enlaces = [
  { to: '/preview', label: 'Elegir estilo' },
  { to: '/preview/google-maps', label: 'Google Maps' },
  { to: '/preview/liquid-glass', label: 'Liquid Glass' },
]

// Barra utilitaria solo para esta comparación temporal de styles.md.
// No pertenece al diseño final de ninguna de las dos propuestas.
export function PreviewSwitcher() {
  return (
    <nav className="preview-switcher" aria-label="Cambiar de preview">
      <span className="preview-switcher__tag">Preview temporal</span>
      <div className="preview-switcher__links">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            end
            className={({ isActive }) =>
              isActive ? 'preview-switcher__link is-active' : 'preview-switcher__link'
            }
          >
            {enlace.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
