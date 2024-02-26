export class UserAlreadyRegisteredInForm extends Error {
  constructor() {
    super();
    this.message = "user already registered in form"
  }
}
