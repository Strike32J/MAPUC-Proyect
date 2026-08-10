import { useState } from 'react'
import { Bell, Bookmark, CircleUserRound, DoorOpen, Menu, ShieldCheck } from 'lucide-react'
import logo from '../../assets/logo/mapuc-logo.png'
import { BotonIcono } from '../ui/BotonIcono'
import type { VistaAplicacion } from '../../app/router'

export function EncabezadoAplicacion({ navegar }: { navegar: (vista: VistaAplicacion) => void }) {
  const [abierto, setAbierto] = useState(false)
  return <header className="barra-superior"><button className="marca" type="button" onClick={() => navegar('mapa')} aria-label="Ir al mapa de MAPUC"><img src={logo} alt="" /><span>MAPUC</span></button><div className="barra-estado"><span className="punto-activo" /> Campus PUCP <span aria-hidden="true">/</span> San Miguel</div><div className="acciones-superior"><BotonIcono etiqueta="Ver alertas" onClick={() => navegar('alertas')}><Bell size={19} /><b className="contador">3</b></BotonIcono><div className="menu-usuario"><button type="button" className="usuario" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}><span className="avatar">MG</span><span className="nombre-usuario">María García</span><Menu size={17} /></button>{abierto && <div className="menu-flotante"><button type="button" onClick={() => navegar('perfil')}><CircleUserRound size={17} /> Mi perfil</button><button type="button" onClick={() => navegar('guardados')}><Bookmark size={17} /> Lugares guardados</button><button type="button" onClick={() => navegar('admin')}><ShieldCheck size={17} /> Administración</button><button type="button" className="salir" onClick={() => navegar('login')}><DoorOpen size={17} /> Cerrar sesión</button></div>}</div></div></header>
}
