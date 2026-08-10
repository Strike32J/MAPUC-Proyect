import { useState } from 'react'
import { EncabezadoAplicacion } from '../components/layout/EncabezadoAplicacion'
import { VistaMapa } from '../features/mapa'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AuthPage } from '../pages/public/AuthPage'
import { SplashPage } from '../pages/public/SplashPage'
import { AlertsPage } from '../pages/user/AlertsPage'
import { ProfilePage } from '../pages/user/ProfilePage'
import { SavedPlacesPage } from '../pages/user/SavedPlacesPage'
import type { VistaAplicacion } from './router'

export default function App() {
  const [vista, setVista] = useState<VistaAplicacion>('splash')
  if (vista === 'splash') return <SplashPage continuar={() => setVista('login')} />
  if (vista === 'login' || vista === 'registro' || vista === 'recuperar' || vista === 'verificar') return <AuthPage vista={vista} navegar={setVista} />
  return <div className="app"><EncabezadoAplicacion navegar={setVista} />{vista === 'mapa' && <VistaMapa />}{vista === 'alertas' && <AlertsPage navegar={setVista} />}{vista === 'guardados' && <SavedPlacesPage navegar={setVista} />}{vista === 'perfil' && <ProfilePage navegar={setVista} />}{vista === 'admin' && <AdminDashboardPage navegar={setVista} />}</div>
}
