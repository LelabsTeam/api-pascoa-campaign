export class InvalidEmail extends Error {
  constructor() {
    super();
    this.message = 'coupom unvailable';
  }
}
