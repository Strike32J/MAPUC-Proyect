import type { NivelAforo } from '../types/lugar'

export const metaAforo: Record<NivelAforo, { texto: string; clase: string }> = {
  vacio: { texto: 'Vacío', clase: 'aforo-vacio' },
  bajo: { texto: 'Poca afluencia', clase: 'aforo-bajo' },
  medio: { texto: 'Afluencia media', clase: 'aforo-medio' },
  alto: { texto: 'Alta afluencia', clase: 'aforo-alto' },
  lleno: { texto: 'Lleno', clase: 'aforo-lleno' },
}
