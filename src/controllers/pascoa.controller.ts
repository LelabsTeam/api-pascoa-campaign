import { Body, Controller, Post } from '@nestjs/common';
import { PascoaService } from '../services';
import { ControllerResponse } from './types';
import { POSSIBLE_APLICATION_ERRORS, FieldIsEmpty } from '../errors';
import { registerClientValidator } from '../validators/register-client.validator';


@Controller('/pascoa-api')
export class PascoaController {
  constructor(private readonly pascoaService: PascoaService) {}

  @Post('/redeem-coupom')
 async redeemCoupom(@Body() props?: PascoaService.RedeemCoupomProps): Promise<ControllerResponse> {
   try{
      if(!props?.clientEmail) throw new FieldIsEmpty(['clientEmail']);
      const res = await this.pascoaService.redeemCoupom({clientEmail: props.clientEmail});
      return {
        data: res,
        status: "success",
        message: "coupom redeemed with success"
      }
    }catch(err ){
      const isApplicationError = POSSIBLE_APLICATION_ERRORS.some(item => err instanceof item)
        return {
          data: null,
          status: "error",
          message: isApplicationError ? err.message : "internal server error"
        }
    }
  }

  @Post('/register-client')
  async registerClient(@Body() props?: any){

    try{
      const fieldsAreExist = registerClientValidator(props);
      if(fieldsAreExist.length){
        throw new FieldIsEmpty(fieldsAreExist)
      }
      await this.pascoaService.registerClient(props);
      return {
        data: null,
        status: "success",
        message: "user registered with success"
      }
    }catch(err){
      const isApplicationError = POSSIBLE_APLICATION_ERRORS.some(item => err instanceof item)
      return {
        data: null,
        status: "error",
        message: isApplicationError ? err.message : "internal server error"
      }
    }
    
  }
}
