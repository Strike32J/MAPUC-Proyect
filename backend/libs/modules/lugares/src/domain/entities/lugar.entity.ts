import { Entity } from '../../../../../core';

export interface PropiedadesLugar {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  capacidadEstimada: number | null;
  accesible: boolean;
  actualizadoEn: Date;
}

export class Lugar extends Entity<PropiedadesLugar> {
  constructor(id: string, props: PropiedadesLugar) {
    super(id, props);
  }

  get codigo(): string {
    return this.props.codigo;
  }

  get nombre(): string {
    return this.props.nombre;
  }

  get descripcion(): string | null {
    return this.props.descripcion;
  }

  get capacidadEstimada(): number | null {
    return this.props.capacidadEstimada;
  }

  get accesible(): boolean {
    return this.props.accesible;
  }

  get actualizadoEn(): Date {
    return this.props.actualizadoEn;
  }
}
