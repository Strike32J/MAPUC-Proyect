import { useState } from 'react'
import { PreviewSwitcher } from './PreviewSwitcher'
import { CampusMapBackdrop } from './CampusMapBackdrop'
import { chipsPreview, estadoTexto, lugaresPreview, type NivelAforo } from './preview-data'
import './GoogleMapsHome.css'

type SheetState = 'peek' | 'medio' | 'expandido'

const busquedasRecientes = ['Aula 204', 'Biblioteca Central', 'Laboratorio de Ingeniería 3']

const nivelClase: Record<NivelAforo, string> = {
  DISPONIBLE: 'gm-pin--disponible',
  PARCIAL: 'gm-pin--parcial',
  OCUPADO: 'gm-pin--ocupado',
  SIN_INFORMACION: 'gm-pin--sin-info',
}

export function GoogleMapsHome() {
  const [chipActivo, setChipActivo] = useState<string | null>(null)
  const [vista, setVista] = useState<'mapa' | 'lista'>('mapa')
  const [seleccionId, setSeleccionId] = useState<string>(lugaresPreview[0].id)
  const [sheetState, setSheetState] = useState<SheetState>('peek')
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [textoBusqueda, setTextoBusqueda] = useState('')

  const seleccionado = lugaresPreview.find((l) => l.id === seleccionId) ?? lugaresPreview[0]

  function seleccionarLugar(id: string) {
    setSeleccionId(id)
    setSheetState('peek')
    setVista('mapa')
  }

  function ciclarSheet() {
    setSheetState((actual) =>
      actual === 'peek' ? 'medio' : actual === 'medio' ? 'expandido' : 'peek',
    )
  }

  return (
    <div className="gm-home">
      <PreviewSwitcher />

      <header className="gm-searchbar-wrap">
        <div className="gm-searchbar">
          <button type="button" className="gm-icon-btn" aria-label="Abrir menú">
            <IconMenu />
          </button>
          <input
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            onFocus={() => setBuscadorAbierto(true)}
            placeholder="Buscar aula, piso o facultad"
            aria-label="Buscar en el campus"
          />
          <button type="button" className="gm-avatar" aria-label="Perfil de usuario">
            MA
          </button>
        </div>

        {buscadorAbierto && (
          <div className="gm-recientes">
            <div className="gm-recientes__header">
              <span>Búsquedas recientes</span>
              <button type="button" onClick={() => setBuscadorAbierto(false)} aria-label="Cerrar">
                <IconClose />
              </button>
            </div>
            <ul>
              {busquedasRecientes.map((texto) => (
                <li key={texto}>
                  <button
                    type="button"
                    onClick={() => {
                      setTextoBusqueda(texto)
                      setBuscadorAbierto(false)
                    }}
                  >
                    <IconHistorial />
                    {texto}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="gm-chips" role="group" aria-label="Filtros de categoría">
          {chipsPreview.map((chip) => (
            <button
              key={chip}
              type="button"
              className={chip === chipActivo ? 'gm-chip is-active' : 'gm-chip'}
              onClick={() => setChipActivo(chip === chipActivo ? null : chip)}
              aria-pressed={chip === chipActivo}
            >
              {chip}
            </button>
          ))}
          <button
            type="button"
            className="gm-chip gm-chip--vista"
            onClick={() => setVista(vista === 'mapa' ? 'lista' : 'mapa')}
          >
            {vista === 'mapa' ? 'Ver como lista' : 'Ver mapa'}
          </button>
        </div>
      </header>

      {vista === 'mapa' ? (
        <div className="gm-map">
          <CampusMapBackdrop className="gm-map__backdrop" />

          <svg className="gm-map__rutas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <line
              x1="50" y1="88" x2={pct(seleccionado.posicion.left)} y2={pct(seleccionado.posicion.top)}
              className="gm-ruta gm-ruta--principal"
            />
            <line
              x1="50" y1="88" x2={pct(seleccionado.posicion.left) + 4} y2={pct(seleccionado.posicion.top) + 3}
              className="gm-ruta gm-ruta--alterna"
            />
          </svg>

          <div className="gm-pin gm-pin--yo" style={{ top: '88%', left: '50%' }} aria-label="Tu ubicación">
            <span className="gm-pin__nucleo" />
          </div>

          {lugaresPreview.map((lugar) => (
            <button
              key={lugar.id}
              type="button"
              className={`gm-pin ${nivelClase[lugar.nivelAforo]} ${lugar.id === seleccionId ? 'is-selected' : ''}`}
              style={{ top: lugar.posicion.top, left: lugar.posicion.left }}
              onClick={() => seleccionarLugar(lugar.id)}
              aria-label={`${lugar.nombre} · ${estadoTexto[lugar.nivelAforo]}`}
              aria-pressed={lugar.id === seleccionId}
            />
          ))}

          <button type="button" className="gm-fab" aria-label="Centrar en mi ubicación">
            <IconCompass />
          </button>
        </div>
      ) : (
        <div className="gm-lista">
          {lugaresPreview.map((lugar) => (
            <button
              key={lugar.id}
              type="button"
              className="gm-lista__item"
              onClick={() => seleccionarLugar(lugar.id)}
            >
              <span className={`gm-lista__icono ${nivelClase[lugar.nivelAforo]}`}>
                {lugar.categoria.slice(0, 1)}
              </span>
              <span className="gm-lista__texto">
                <strong>{lugar.nombre}</strong>
                <span>{lugar.piso} · {lugar.facultad}</span>
              </span>
              <span className={`gm-badge ${nivelClase[lugar.nivelAforo]}`}>
                {estadoTexto[lugar.nivelAforo]}
              </span>
              <IconChevron />
            </button>
          ))}
        </div>
      )}

      {vista === 'mapa' && (
        <section className={`gm-sheet gm-sheet--${sheetState}`} aria-label="Detalle del lugar seleccionado">
          <button type="button" className="gm-sheet__grabber" onClick={ciclarSheet} aria-label="Cambiar altura del panel" />

          <div className="gm-sheet__header">
            <div>
              <h2>{seleccionado.nombre}</h2>
              <p className="gm-sheet__sub">{seleccionado.piso} · {seleccionado.facultad}</p>
            </div>
            <span className={`gm-badge ${nivelClase[seleccionado.nivelAforo]}`}>
              {estadoTexto[seleccionado.nivelAforo]}
            </span>
          </div>

          <div className="gm-sheet__stats">
            <div>
              <span className="gm-sheet__stat-label">Aforo</span>
              <span className="gm-sheet__stat-valor">
                {seleccionado.nivelAforo === 'SIN_INFORMACION'
                  ? '—'
                  : `${seleccionado.capacidadActual}/${seleccionado.capacidadTotal}`}
              </span>
            </div>
            <div>
              <span className="gm-sheet__stat-label">Distancia</span>
              <span className="gm-sheet__stat-valor">{seleccionado.distanciaMetros} m</span>
            </div>
            <div>
              <span className="gm-sheet__stat-label">Horario</span>
              <span className="gm-sheet__stat-valor gm-sheet__stat-valor--texto">{seleccionado.horario}</span>
            </div>
            <div>
              <span className="gm-sheet__stat-label">Accesibilidad</span>
              <span className="gm-sheet__stat-valor gm-sheet__stat-valor--texto">
                {seleccionado.accesible ? 'Ruta accesible' : 'Sin ruta accesible'}
              </span>
            </div>
          </div>

          {sheetState === 'expandido' && (
            <div className="gm-sheet__extra">
              <h3>Servicios cercanos</h3>
              <ul>
                <li>Casilleros · Piso 1</li>
                <li>Impresión y fotocopias · Piso 1</li>
                <li>Baño accesible · Piso 2</li>
              </ul>
            </div>
          )}

          <div className="gm-sheet__acciones">
            <button type="button" className="gm-btn gm-btn--primario">Cómo llegar</button>
            <button type="button" className="gm-btn gm-btn--secundario">Ver detalles</button>
            <button type="button" className="gm-btn gm-btn--destructivo">Reportar</button>
          </div>
        </section>
      )}
    </div>
  )
}

function pct(value: string): number {
  return parseFloat(value)
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function IconHistorial() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5L10.8 13.2 9.5 14.5l3.7-1.3 1.3-3.7z" fill="currentColor" stroke="none" />
    </svg>
  )
}
