import { Accessibility, AlertTriangle, Bookmark, Building2, Clock3, Flag, Navigation, X } from 'lucide-react'
import { BotonIcono } from '../../../components/ui/BotonIcono'
import { EstadoAforo } from '../../../components/ui/EstadoAforo'
import type { Lugar } from '../../../shared/types/lugar'

export function PanelLugar({ lugar, cerrar }: { lugar: Lugar; cerrar: () => void }) {
  const porcentaje = Math.min(100, Math.round((lugar.actual / lugar.capacidad) * 100))
  const concurrido = lugar.aforo === 'alto' || lugar.aforo === 'lleno'
  return <aside className="panel-lugar" aria-label={`Detalle de ${lugar.nombre}`}>
    <div className="panel-titulo"><div><p>{lugar.categoria}</p><h2>{lugar.nombre}</h2></div><BotonIcono etiqueta="Cerrar detalle" onClick={cerrar}><X size={19} /></BotonIcono></div>
    <EstadoAforo nivel={lugar.aforo} />
    {concurrido && <div className="aviso-aforo"><AlertTriangle size={19} /><span><b>{lugar.aforo === 'lleno' ? 'Este lugar está lleno.' : 'Alta afluencia.'}</b> Considera una alternativa cercana.</span></div>}
    <div className="metricas"><div><Navigation size={17} /><b>{lugar.minutos} min</b><span>a pie</span></div><div><Building2 size={17} /><b>{porcentaje}%</b><span>de aforo</span></div><div><Accessibility size={17} /><b>{lugar.accesible ? 'Sí' : 'No'}</b><span>accesible</span></div></div>
    <div className="medidor"><div><span>Aforo estimado</span><b>{lugar.actual} / {lugar.capacidad}</b></div><div className="barra-aforo"><i style={{ width: `${porcentaje}%` }} /></div><small>Actualizado hace 2 minutos</small></div>
    <dl className="datos-lugar"><div><dt><Building2 size={16} /> Edificio</dt><dd>{lugar.edificio}</dd></div><div><dt><Clock3 size={16} /> Horario</dt><dd>{lugar.horario}</dd></div><div><dt><Accessibility size={16} /> Accesibilidad</dt><dd>{lugar.accesible ? 'Ruta accesible disponible' : 'Sin ruta documentada'}</dd></div></dl>
    <p className="descripcion">{lugar.descripcion}</p>
    <div className="acciones-lugar"><button type="button" className="primario"><Navigation size={18} /> Cómo llegar</button><button type="button" className="secundario"><Bookmark size={18} /> Guardar</button><button type="button" className="terciario"><Flag size={18} /> Reportar estado</button></div>
  </aside>
}
