export class CreateCatDto {
  constructor(
    public readonly name: string,
    public readonly age: number,
    public readonly breed: string,
  ) {}
}
