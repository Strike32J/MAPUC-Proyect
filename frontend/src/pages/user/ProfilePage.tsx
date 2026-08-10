import { ChevronLeft, Settings } from 'lucide-react'
import type { VistaAplicacion } from '../../app/router'

export function ProfilePage({ navegar }: { navegar: (vista: VistaAplicacion) => void }) {
  return <main className="pagina-secundaria"><div className="encabezado-secundario"><button type="button" className="volver" onClick={() => navegar('mapa')}><ChevronLeft size={20} /> Mapa</button><div><p className="eyebrow">MAPUC</p><h1>Mi perfil</h1><p>Preferencias y accesibilidad</p></div></div><section className="perfil"><span className="avatar grande">MG</span><div><h2>María García</h2><p>a20195432@pucp.edu.pe</p></div><hr /><h3>Preferencias</h3><label><input type="checkbox" defaultChecked /> Recibir alertas del campus</label><label><input type="checkbox" defaultChecked /> Priorizar rutas accesibles</label><label><input type="checkbox" /> Modo de alto contraste</label><button type="button" className="secundario"><Settings size={17} /> Guardar preferencias</button></section></main>
}
