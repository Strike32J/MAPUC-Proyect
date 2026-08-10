import type { NivelAforo } from '../../shared/types/lugar'
import { metaAforo } from '../../shared/constants/aforo'

export function EstadoAforo({ nivel }: { nivel: NivelAforo }) {
  const meta = metaAforo[nivel]
  return <span className={`estado-aforo ${meta.clase}`}><span aria-hidden="true" />{meta.texto}</span>
}
