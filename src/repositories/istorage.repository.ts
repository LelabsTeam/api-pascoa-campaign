export interface IStorageRepository {
  getCoupom(): Promise<null | {expireDate: Date, code: string}>
  saveCoupomInUser(email: string, coupomId: string): Promise<void>
  saveUserForm(
    props: { email: string, cpf: string, cell: string, acceptedTerms: boolean }
  ): Promise<void>
  verifyUserCoupom(email: string): Promise<true | false>
  verifyUserAlreadyRegisteredForm(
    props: { email: string, cpf?: string, cell?: string }
  ): Promise<{ email: string, cpf: string, cell: string } | null>
  getCouponsByEmail(email: string): Promise<string | null>;
  saveCoupons(input: string[]): Promise<void>
}
