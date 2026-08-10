export class RecursoNoEncontradoError extends Error {
  constructor(recurso: string, id: string) {
    super(`${recurso} no encontrado: ${id}`);
    this.name = 'RecursoNoEncontradoError';
  }
}
