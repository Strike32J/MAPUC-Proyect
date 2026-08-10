import type { ReactNode } from 'react'

export function BotonIcono({ etiqueta, children, onClick, activo = false }: { etiqueta: string; children: ReactNode; onClick?: () => void; activo?: boolean }) {
  return <button type="button" className={`boton-icono${activo ? ' activo' : ''}`} onClick={onClick} aria-label={etiqueta} title={etiqueta}>{children}</button>
}
