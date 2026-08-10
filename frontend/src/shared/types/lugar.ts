export type NivelAforo = 'vacio' | 'bajo' | 'medio' | 'alto' | 'lleno'

export type Lugar = {
  id: string
  nombre: string
  categoria: string
  aforo: NivelAforo
  actual: number
  capacidad: number
  minutos: number
  accesible: boolean
  edificio: string
  horario: string
  descripcion: string
  posicion: { left: string; top: string }
}
