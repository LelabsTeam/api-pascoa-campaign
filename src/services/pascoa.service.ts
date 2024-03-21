import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { randomUUID } from 'crypto';
import {
  CoupomUnvailable,
  UserAlreadyGetCoupom,
  UserAlreadyRegisteredInForm,
  UserNotRegisteredInForm,
} from '../errors';
import { IStorageRepository } from '../repositories/istorage.repository';
import { GetClientCouponsInput } from '../controllers/inputs/GetClientCouponsInput';
import { RedisCacheProvider } from '../gateways/database/cache-gateway';

export namespace PascoaService {
  export type RedeemCoupomProps = {
    clientEmail: string;
  };
  export type RedeemCoupomRes = null | { coupomCode: string };

  export type RegisterClientProps = {
    email: string;
    cell: string;
    cpf: string;
    acceptedTerms: boolean;
    birthday: string
  };
  export type RegisterClientRes = void;

  export type GetClientCoupons = {
    clientEmail: string;
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

@Injectable()
export class PascoaService {
  constructor(
    @Inject('IStorageRepository')
    private readonly storageService: IStorageRepository,

    @Inject('RedisCacheProvider')
    private cacheClient: RedisCacheProvider,

    @Inject(REQUEST) request?: Request,
  ) {}

  async redeemCoupom({
    clientEmail,
  }: PascoaService.RedeemCoupomProps): Promise<PascoaService.RedeemCoupomRes> {
    const userNotRegisteredInForm = await this.storageService.verifyUserAlreadyRegisteredForm({
      email: clientEmail,
    });
    if (!userNotRegisteredInForm) throw new UserNotRegisteredInForm();

    const userAlreadyGetCoupom = await this.storageService.verifyUserCoupom(
      clientEmail,
    );

    if (userAlreadyGetCoupom) throw new UserAlreadyGetCoupom();

    const coupomCode = await this.redeemCouponRaceCondition(clientEmail);

    return { coupomCode: coupomCode.code };
  }

  private async redeemCouponRaceCondition(clientEmail: string) {
    const key = 'semaphore';
    const id = randomUUID();

    const currentDateTime = new Date();
    const currentDateInBrasila = new Date(currentDateTime.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const cacheValue = { id, created_at: currentDateInBrasila.toISOString() };
    await this.cacheClient
      .saveArray({ key, value: cacheValue });

    try {
      await this.waitTurn(key, id, cacheValue);

      const coupomCode = await this.storageService.getCoupom();

      if (!coupomCode) throw new CoupomUnvailable();

      const currentDate = new Date(new Date().toISOString().split('T')[0]).getTime();
      const couponExpireDate = new Date(coupomCode.expireDate.toISOString().split('T')[0]).getTime();

      if (currentDate > couponExpireDate) throw new CoupomUnvailable();

      await this.storageService.saveCoupomInUser(clientEmail, coupomCode.code);

      await this.cacheClient.removeArrayItem({ key, value: cacheValue });

      return coupomCode;
    } catch (e) {
      await this.cacheClient.removeArrayItem({
        key, value: cacheValue,
      });

      throw new Error(e.message);
    }
  }

  private async waitTurn(key: string, id: string, cacheValue: {
    id: string;
    created_at: string;
  }) {
    let myTurn = false;
    let waitingTime = 0;

    while (!myTurn) {
      // eslint-disable-next-line no-await-in-loop
      const oldestRequest = await this.cacheClient.getArrayValue({
        key, index: 0,
      });

      const oldestRequestId = oldestRequest?.id;
      myTurn = id === oldestRequestId;
      if (!myTurn) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(300);
        waitingTime += 300;
        if (waitingTime >= 2400) {
          // eslint-disable-next-line no-await-in-loop
          await this.cacheClient.removeArrayItem({ key, value: cacheValue });
          throw new Error('Tente novamente amanhã');
        }
      }
    }
  }

  async registerClient(
    props: PascoaService.RegisterClientProps,
  ): Promise<PascoaService.RegisterClientRes> {
    const { acceptedTerms, ...verifyUserProps } = props;
    const user = await this.storageService.verifyUserAlreadyRegisteredForm(
      verifyUserProps,
    );

    if (user) throw new UserAlreadyRegisteredInForm();
    await this.storageService.saveUserForm(props);
  }

  async getClientCoupons(input: GetClientCouponsInput) {
    const { clientEmail } = input;
    const coupons = await this.storageService.getCouponsByEmail(clientEmail);
    return coupons;
  }

  async saveCoupons(input: string[]) {
    await this.storageService.saveCoupons(input);
  }
}
