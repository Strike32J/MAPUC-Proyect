import { AlertTriangle, ChevronLeft, ExternalLink } from 'lucide-react'
import { EstadoAforo } from '../../components/ui/EstadoAforo'
import type { VistaAplicacion } from '../../app/router'

export function AlertsPage({ navegar }: { navegar: (vista: VistaAplicacion) => void }) {
  const alertas = [{ titulo: 'Comedor Central: aforo al límite', nivel: 'alto' as const, detalle: '98% de capacidad. Considera la Cafetería Central o espera 20 minutos.' }, { titulo: 'Cafetería Central: completamente llena', nivel: 'lleno' as const, detalle: 'No hay mesas disponibles en este momento.' }, { titulo: 'Biblioteca Central: impresión suspendida', nivel: 'medio' as const, detalle: 'Servicio en mantenimiento hasta las 17:00.' }]
  return <main className="pagina-secundaria"><div className="encabezado-secundario"><button type="button" className="volver" onClick={() => navegar('mapa')}><ChevronLeft size={20} /> Mapa</button><div><p className="eyebrow">MAPUC</p><h1>Alertas activas</h1><p>Información relevante para tu recorrido</p></div></div><div className="lista-alertas">{alertas.map((alerta) => <article className="alerta" key={alerta.titulo}><span className={`icono-alerta aforo-${alerta.nivel}`}><AlertTriangle size={20} /></span><div><div className="fila-estado"><h2>{alerta.titulo}</h2><EstadoAforo nivel={alerta.nivel} /></div><p>{alerta.detalle}</p><small>Fuente oficial · hace pocos minutos</small></div><button type="button" aria-label={`Ver ${alerta.titulo} en el mapa`} onClick={() => navegar('mapa')}><ExternalLink size={18} /></button></article>)}</div></main>
}
