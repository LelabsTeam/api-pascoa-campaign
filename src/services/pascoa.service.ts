import { Injectable } from '@nestjs/common';
import { CoupomUnvailable, UserAlreadyGetCoupom, UserAlreadyRegisteredInForm, UserNotRegisteredInForm } from '../errors';
import { MasterDataService } from '../repositories/masterdata.repository';

export namespace PascoaService {
    export type RedeemCoupomProps = {
        clientEmail: string
    }
    export type RedeemCoupomRes = null | {coupomCode: string}

    export type RegisterClientProps = {
      email: string,
      cell: string,
      cpf: string,
      acceptedTerms: boolean
  }
  export type RegisterClientRes = void
};


@Injectable()
export class PascoaService {
  constructor(private readonly storageService: MasterDataService){}
  async redeemCoupom(props: PascoaService.RedeemCoupomProps): Promise<PascoaService.RedeemCoupomRes> {
    const userNotRegisteredInForm = await this.storageService.verifyUserAlreadyRegisteredForm({email: props.clientEmail})
    if(!userNotRegisteredInForm) throw new UserNotRegisteredInForm()
    const userAlreadyGetCoupom = await this.storageService.verifyUserCoupom(props.clientEmail)
    if(userAlreadyGetCoupom) throw new UserAlreadyGetCoupom()
    const coupomCode = await this.storageService.getCoupom();
    if(!coupomCode) throw new CoupomUnvailable()

    await this.storageService.saveCoupomInUser(props.clientEmail, coupomCode)

    return {coupomCode}
  }

  async registerClient(props: PascoaService.RegisterClientProps): Promise<PascoaService.RegisterClientRes>{
    const {acceptedTerms, ...verifyUserProps} = props
    const user = await this.storageService.verifyUserAlreadyRegisteredForm(verifyUserProps);
    if(user) throw new UserAlreadyRegisteredInForm()
    await this.storageService.saveUserForm(props)
    return
  }
}
