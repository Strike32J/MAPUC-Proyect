import { useState } from 'react'
import { PreviewSwitcher } from './PreviewSwitcher'
import { CampusMapBackdrop } from './CampusMapBackdrop'
import { chipsPreview, estadoTexto, lugaresPreview, type NivelAforo } from './preview-data'
import './LiquidGlassHome.css'

type SheetState = 'peek' | 'medio' | 'expandido'

const tabs = [
  { id: 'explorar', label: 'Explorar', icon: <IconMapa /> },
  { id: 'guardados', label: 'Guardados', icon: <IconGuardado /> },
  { id: 'alertas', label: 'Alertas', icon: <IconAlerta /> },
  { id: 'perfil', label: 'Perfil', icon: <IconPerfil /> },
]

const nivelClase: Record<NivelAforo, string> = {
  DISPONIBLE: 'lg-bubble--disponible',
  PARCIAL: 'lg-bubble--parcial',
  OCUPADO: 'lg-bubble--ocupado',
  SIN_INFORMACION: 'lg-bubble--sin-info',
}

export function LiquidGlassHome() {
  const [chipActivo, setChipActivo] = useState<string | null>('Disponible ahora')
  const [seleccionId, setSeleccionId] = useState<string>(lugaresPreview[0].id)
  const [sheetState, setSheetState] = useState<SheetState>('peek')
  const [tabActivo, setTabActivo] = useState('explorar')

  const seleccionado = lugaresPreview.find((l) => l.id === seleccionId) ?? lugaresPreview[0]

  function seleccionarLugar(id: string) {
    setSeleccionId(id)
    setSheetState('medio')
  }

  function ciclarSheet() {
    setSheetState((actual) =>
      actual === 'peek' ? 'medio' : actual === 'medio' ? 'expandido' : 'peek',
    )
  }

  return (
    <div className="lg-home">
      <PreviewSwitcher />

      <div className="lg-home__ambient" aria-hidden="true" />

      <div className="lg-map">
        <CampusMapBackdrop className="lg-map__backdrop" />
      </div>

      <header className="lg-top">
        <div className="lg-search glass glass--3">
          <IconBuscar />
          <input placeholder="Buscar aula, piso o facultad" aria-label="Buscar en el campus" />
        </div>

        <div className="lg-chips" role="group" aria-label="Filtros de categoría">
          {chipsPreview.map((chip) => (
            <button
              key={chip}
              type="button"
              className={chip === chipActivo ? 'lg-chip glass glass--1 is-active' : 'lg-chip glass glass--1'}
              onClick={() => setChipActivo(chip === chipActivo ? null : chip)}
              aria-pressed={chip === chipActivo}
            >
              {chip}
            </button>
          ))}
        </div>
      </header>

      {lugaresPreview.map((lugar) => (
        <button
          key={lugar.id}
          type="button"
          className={`lg-bubble ${nivelClase[lugar.nivelAforo]} ${lugar.id === seleccionId ? 'is-selected' : ''}`}
          style={{ top: lugar.posicion.top, left: lugar.posicion.left }}
          onClick={() => seleccionarLugar(lugar.id)}
          aria-label={`${lugar.nombre} · ${estadoTexto[lugar.nivelAforo]}`}
          aria-pressed={lugar.id === seleccionId}
        >
          <span className="lg-bubble__liquido" />
          <span className="lg-bubble__brillo" />
        </button>
      ))}

      <button
        type="button"
        className={`lg-fab lg-fab--${sheetState} glass glass--4`}
        aria-label="Reportar disponibilidad"
      >
        <IconMas />
      </button>

      <section className={`lg-sheet glass glass--3 lg-sheet--${sheetState}`} aria-label="Detalle del lugar seleccionado">
        <button type="button" className="lg-sheet__grabber" onClick={ciclarSheet} aria-label="Cambiar altura del panel" />

        <div className="lg-sheet__header">
          <div>
            <h2>{seleccionado.nombre}</h2>
            <p className="lg-sheet__sub">{seleccionado.piso} · {seleccionado.facultad}</p>
          </div>
          <span className={`lg-badge ${nivelClase[seleccionado.nivelAforo]}`}>
            {estadoTexto[seleccionado.nivelAforo]}
          </span>
        </div>

        <div className="lg-sheet__stats">
          <div className="lg-stat glass glass--1">
            <span className="lg-stat__label">Aforo</span>
            <span className="lg-stat__valor">
              {seleccionado.nivelAforo === 'SIN_INFORMACION'
                ? '—'
                : `${seleccionado.capacidadActual}/${seleccionado.capacidadTotal}`}
            </span>
          </div>
          <div className="lg-stat glass glass--1">
            <span className="lg-stat__label">Distancia</span>
            <span className="lg-stat__valor">{seleccionado.distanciaMetros} m</span>
          </div>
          <div className="lg-stat glass glass--1">
            <span className="lg-stat__label">Horario</span>
            <span className="lg-stat__valor lg-stat__valor--texto">{seleccionado.horario}</span>
          </div>
          <div className="lg-stat glass glass--1">
            <span className="lg-stat__label">Accesibilidad</span>
            <span className="lg-stat__valor lg-stat__valor--texto">
              {seleccionado.accesible ? 'Ruta accesible' : 'Sin ruta accesible'}
            </span>
          </div>
        </div>

        {sheetState === 'expandido' && (
          <div className="lg-sheet__extra">
            <h3>Servicios cercanos</h3>
            <ul>
              <li>Casilleros · Piso 1</li>
              <li>Impresión y fotocopias · Piso 1</li>
              <li>Baño accesible · Piso 2</li>
            </ul>
          </div>
        )}

        <div className="lg-sheet__acciones">
          <button type="button" className="lg-btn lg-btn--primario">Cómo llegar</button>
          <button type="button" className="lg-btn lg-btn--secundario glass glass--1">Ver detalles</button>
        </div>
      </section>

      <nav className="lg-tabbar glass glass--1" aria-label="Navegación principal">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === tabActivo ? 'lg-tab is-active' : 'lg-tab'}
            onClick={() => setTabActivo(tab.id)}
            aria-current={tab.id === tabActivo}
          >
            <span className="lg-tab__icono">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

function IconBuscar() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

function IconMas() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function IconMapa() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
    </svg>
  )
}

function IconGuardado() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v16l-6-4-6 4V4z" />
    </svg>
  )
}

function IconAlerta() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l9 16H3l9-16z" />
      <path d="M12 10v3M12 16h.01" />
    </svg>
  )
}

function IconPerfil() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" />
    </svg>
  )
}
