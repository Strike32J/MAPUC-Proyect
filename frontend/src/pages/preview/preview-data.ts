// Datos de muestra solo para comparar styles-google-maps.md vs styles-liquid-glass.md.
// No representa datos reales del campus ni contratos de la API.

export type NivelAforo = 'DISPONIBLE' | 'PARCIAL' | 'OCUPADO' | 'SIN_INFORMACION'

export interface LugarPreview {
  id: string
  nombre: string
  categoria: string
  facultad: string
  piso: string
  nivelAforo: NivelAforo
  capacidadActual: number
  capacidadTotal: number
  distanciaMetros: number
  horario: string
  accesible: boolean
  posicion: { top: string; left: string }
}

export const lugaresPreview: LugarPreview[] = [
  {
    id: 'biblioteca-central',
    nombre: 'Biblioteca Central',
    categoria: 'Biblioteca',
    facultad: 'Servicios académicos',
    piso: 'Piso 2',
    nivelAforo: 'PARCIAL',
    capacidadActual: 118,
    capacidadTotal: 160,
    distanciaMetros: 180,
    horario: 'Abre hasta las 22:00',
    accesible: true,
    posicion: { top: '38%', left: '46%' },
  },
  {
    id: 'aula-204-cs',
    nombre: 'Aula 204 · Estudios Generales Ciencias',
    categoria: 'Aula',
    facultad: 'Estudios Generales Ciencias',
    piso: 'Piso 2',
    nivelAforo: 'DISPONIBLE',
    capacidadActual: 8,
    capacidadTotal: 40,
    distanciaMetros: 90,
    horario: 'Libre hasta las 14:00',
    accesible: true,
    posicion: { top: '58%', left: '30%' },
  },
  {
    id: 'lab-ing-3',
    nombre: 'Laboratorio de Ingeniería 3',
    categoria: 'Laboratorio',
    facultad: 'Ingeniería',
    piso: 'Piso 1',
    nivelAforo: 'OCUPADO',
    capacidadActual: 30,
    capacidadTotal: 30,
    distanciaMetros: 260,
    horario: 'Ocupado hasta las 16:00',
    accesible: false,
    posicion: { top: '24%', left: '66%' },
  },
  {
    id: 'sala-estudio-coworking',
    nombre: 'Sala de estudio Coworking',
    categoria: 'Sala de estudio',
    facultad: 'Servicios académicos',
    piso: 'Piso 1',
    nivelAforo: 'DISPONIBLE',
    capacidadActual: 4,
    capacidadTotal: 24,
    distanciaMetros: 140,
    horario: 'Abre hasta las 20:00',
    accesible: true,
    posicion: { top: '70%', left: '58%' },
  },
  {
    id: 'cafeteria-central',
    nombre: 'Cafetería Central',
    categoria: 'Cafetería',
    facultad: 'Servicios',
    piso: 'Nivel calle',
    nivelAforo: 'SIN_INFORMACION',
    capacidadActual: 0,
    capacidadTotal: 0,
    distanciaMetros: 210,
    horario: 'Sin información de aforo',
    accesible: true,
    posicion: { top: '50%', left: '78%' },
  },
]

export const chipsPreview = [
  'Disponible ahora',
  'Aulas',
  'Laboratorios',
  'Salas de estudio',
  'Baños',
  'Cafeterías',
]

export const estadoTexto: Record<NivelAforo, string> = {
  DISPONIBLE: 'Libre',
  PARCIAL: 'Ocupación parcial',
  OCUPADO: 'Ocupado',
  SIN_INFORMACION: 'Sin información',
}
