import { Body, Controller, Post } from '@nestjs/common';
import { PascoaService } from '../services';
import { ControllerResponse } from './types';

@Controller('/pascoa-api')
export class PascoaController {
  constructor(private readonly pascoaService: PascoaService) {}

  @Post('/redeem-coupom')
 async redeemCoupom(@Body() props?: PascoaService.RedeemCoupomProps): Promise<ControllerResponse> {
    if(!props?.clientEmail) {
        return {
            data: null,
            status: "error"
        }
    }
    const res = await this.pascoaService.redeemCoupom(props);
    return {
        data: res,
        status: res ? "success" : "error"
    }
  }

  @Post('/register-client')
  async registerClient(@Body() props?: any){
    
  }
}
