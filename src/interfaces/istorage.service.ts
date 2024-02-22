export interface IStorageService {
    getCoupom(): Promise<null | string>
    saveCoupomInUser(email: string, coupomId: string): Promise<void>
    saveUserForm(props: {email: string, cpf: string, cell: string, acceptedTerms: boolean}): Promise<void>
    verifyUserCoupom(email: string): Promise<true | false>
    verifyUserAlreadyRegisteredForm(props: {email: string, cpf?: string, cell?: string}): Promise<{email: string, cpf: string, cell: string} | null>
}