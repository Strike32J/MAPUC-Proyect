import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ChooserPage } from './pages/preview/ChooserPage'
import { GoogleMapsHome } from './pages/preview/GoogleMapsHome'
import { LiquidGlassHome } from './pages/preview/LiquidGlassHome'

// Rutas temporales: solo sirven para comparar styles-google-maps.md vs
// styles-liquid-glass.md antes de fijar la guía visual definitiva de MAPUC.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/preview" replace />} />
        <Route path="/preview" element={<ChooserPage />} />
        <Route path="/preview/google-maps" element={<GoogleMapsHome />} />
        <Route path="/preview/liquid-glass" element={<LiquidGlassHome />} />
        <Route path="*" element={<Navigate to="/preview" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
