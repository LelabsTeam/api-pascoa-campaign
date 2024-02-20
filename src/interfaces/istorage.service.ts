export interface IStorageService {
    getCoupom(): Promise<null | string>
    verifyUser(email: string): Promise<true | false>
    saveCoupomInUser(email: string, coupomId: string): Promise<void>
    saveUserForm(props: {email: string, cpf: string, cell: string, acceptedTerms: boolean}): Promise<void>
    verifyUserAlreadyRegisteredForm(props: {email: string, cpf: string, cell: string}): Promise<{email: string, cpf: string, cell: string} | null>
}