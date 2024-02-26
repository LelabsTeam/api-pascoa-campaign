import {
  Body, Controller, Get, Param, Post,
} from '@nestjs/common';
import { GetClientCouponsInput } from './inputs/GetClientCouponsInput';
import { PascoaService } from '../services/pascoa.service';
import { ControllerResponse } from './types';
import { POSSIBLE_APLICATION_ERRORS, FieldIsEmpty } from '../errors';
import { registerClientValidator } from '../validators/register-client.validator';

import DataSource from '../gateways/database/ormconfig'
import { EasterCoupon } from '../gateways/database/model/EasterCoupon.model';

@Controller('/pascoa-api')
export class PascoaController {
  constructor(private readonly pascoaService: PascoaService) {}

  @Post('/redeem-coupon')
  async redeemCoupom(@Body() props?: PascoaService.RedeemCoupomProps): Promise<ControllerResponse> {
    try {
      if (!props?.clientEmail) throw new FieldIsEmpty(['clientEmail']);
      const res = await this.pascoaService.redeemCoupom({ clientEmail: props.clientEmail });
      return {
        data: res,
        status: 'success',
        message: 'coupom redeemed with success',
      };
    } catch (err) {
      console.log(err)
      const isApplicationError = POSSIBLE_APLICATION_ERRORS.some((item) => err instanceof item);
      return {
        data: null,
        status: 'error',
        message: isApplicationError ? err.message : 'internal server error',
      };
    }
  }

  @Post('/register-client')
  async registerClient(@Body() props?: any) {
    try {
      const fieldsAreExist = registerClientValidator(props) as string[];
      if (fieldsAreExist.length) {
        throw new FieldIsEmpty(fieldsAreExist);
      }
      await this.pascoaService.registerClient(props);
      return {
        data: null,
        status: 'success',
        message: 'user registered with success',
      };
    } catch (err) {
      const isApplicationError = POSSIBLE_APLICATION_ERRORS.some((item) => err instanceof item);
      console.log(err)
      return {
        data: null,
        status: 'error',
        message: isApplicationError ? err.message : 'internal server error',
      };
    }
  }

  @Get('/coupons/:clientEmail')
  async getUserCoupons(@Param() input: GetClientCouponsInput) {
    try{
      const res = await this.pascoaService.getClientCoupons(input);
      return {
        data: res,
        status: "success",
        message: "get coupon user with success"
      }
    }catch(err){
      const isApplicationError = POSSIBLE_APLICATION_ERRORS.some((item) => err instanceof item);
      return {
        data: null,
        status: 'error',
        message: isApplicationError ? err.message : 'internal server error',
      };
    }
  }

  // @Post("/coupons")
  // async addCoupons(@Body() input: any){
  //   try{
  //       await this.pascoaService.saveCoupons(input.coupons)
  //   }catch(err){
  //     console.log(err)
  //   }
  //   return
  // }

  @Get('/test')
  healthcheck(): string {
    return 'ok';
  }
}
