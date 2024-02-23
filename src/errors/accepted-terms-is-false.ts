export class AcceptedTermsIsFalse extends Error {
  constructor() {
    super();
    this.message = 'required accepted terms';
  }
}
