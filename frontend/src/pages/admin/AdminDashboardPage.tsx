import { ChevronLeft } from 'lucide-react'
import type { VistaAplicacion } from '../../app/router'

export function AdminDashboardPage({ navegar }: { navegar: (vista: VistaAplicacion) => void }) {
  return <main className="pagina-secundaria"><div className="encabezado-secundario"><button type="button" className="volver" onClick={() => navegar('mapa')}><ChevronLeft size={20} /> Mapa</button><div><p className="eyebrow">Administración</p><h1>Panel de administración</h1><p>Resumen operativo del campus</p></div></div><section className="admin"><div className="metricas-admin"><article><span>Alertas activas</span><b>3</b></article><article><span>Reportes por revisar</span><b>12</b></article><article><span>Chats activos</span><b>2</b></article><article><span>Lugares monitoreados</span><b>16</b></article></div><div className="tabla-admin"><h2>Reportes recientes</h2>{['Aforo incorrecto · Cafetería Central', 'Acceso bloqueado · Pabellón H', 'Servicio no disponible · Biblioteca Central'].map((fila) => <div key={fila}><span>{fila}</span><button type="button">Revisar</button></div>)}</div></section></main>
}
