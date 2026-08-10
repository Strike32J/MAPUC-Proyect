export abstract class Entity<Props extends object> {
  protected constructor(
    public readonly id: string,
    protected readonly props: Readonly<Props>,
  ) {}

  equals(otra: Entity<Props>): boolean {
    return this.id === otra.id;
  }
}
