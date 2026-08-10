import { Bookmark, ChevronLeft, MapPinned } from 'lucide-react'
import { EstadoAforo } from '../../components/ui/EstadoAforo'
import { lugaresDemo } from '../../features/mapa/model/lugares-demo'
import type { VistaAplicacion } from '../../app/router'

export function SavedPlacesPage({ navegar }: { navegar: (vista: VistaAplicacion) => void }) {
  return <main className="pagina-secundaria"><div className="encabezado-secundario"><button type="button" className="volver" onClick={() => navegar('mapa')}><ChevronLeft size={20} /> Mapa</button><div><p className="eyebrow">MAPUC</p><h1>Lugares guardados</h1><p>Accesos rápidos a tus espacios frecuentes</p></div></div><div className="cuadricula-lugares">{lugaresDemo.slice(0, 4).map((lugar) => <article key={lugar.id}><Bookmark size={19} /><h2>{lugar.nombre}</h2><p>{lugar.edificio}</p><EstadoAforo nivel={lugar.aforo} /><button type="button" className="secundario" onClick={() => navegar('mapa')}>Ver en el mapa <MapPinned size={17} /></button></article>)}</div></main>
}
