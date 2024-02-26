export class UserAlreadyGetCoupom extends Error {
  constructor() {
    super();
    this.message = "user already get coupon"
  }
}
