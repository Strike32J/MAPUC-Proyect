export interface EventoDominio<Contenido extends object = object> {
  id: string;
  nombre: string;
  version: number;
  ocurridoEn: Date;
  correlationId: string;
  contenido: Contenido;
}
