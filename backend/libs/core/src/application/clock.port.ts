export const CLOCK = Symbol('CLOCK');

export interface Reloj {
  ahora(): Date;
}
