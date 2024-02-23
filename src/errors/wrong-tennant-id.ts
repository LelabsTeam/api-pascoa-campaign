export class WrongTennantId extends Error {
  constructor() {
    super();
    this.message = 'user or cupon not exist in tennant id';
  }
}
