/* eslint-disable max-len */
import { IStorageRepository } from 'src/repositories/istorage.repository';
import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IsNull } from 'typeorm';
import DataSource from '../gateways/database/ormconfig';
import { EasterUser } from '../gateways/database/model/EasterUser.model';
import { EasterCoupon } from '../gateways/database/model/EasterCoupon.model';
import { CoupomUnvailable, UserNotRegisteredInForm } from '../errors';

@Injectable({ scope: Scope.REQUEST })

export class StorageRepository implements IStorageRepository {
  banderName: 'CV' | 'LB';

  constructor(@Inject(REQUEST) request?: Request) {
    this.banderName = request.headers['bander-name'];
  }

  async verifyUserAlreadyRegisteredForm(_props: { email: string; cpf?: string; cell?: string; }): Promise<{ email: string; cpf: string; cell: string; } | null> {
    const userTable = DataSource.getRepository(EasterUser);
    const res = await userTable.findOneBy({ email: _props.email, tenant_id: this.banderName });
    if (res) return { cell: res.phone, cpf: res.cpf, email: res.email };
    return null;
  }

  async saveUserForm(_props: { email: string; cpf: string; cell: string; acceptedTerms: boolean; }): Promise<void> {
    const userTable = DataSource.getRepository(EasterUser);
    await userTable.save({
      accepted_terms: _props.acceptedTerms, cpf: _props.cpf, email: _props.email, phone: _props.cell, tenant_id: this.banderName,
    });
  }

  async saveCoupomInUser(_email: string, _coupomId: string): Promise<void> {
    const coumpomTable = DataSource.getRepository(EasterCoupon);
    const userTable = DataSource.getRepository(EasterUser);
    const user = await userTable.findOneBy({ email: _email, tenant_id: this.banderName });
    const coupon = await coumpomTable.findOneBy({ coupon_number: _coupomId, tenant_id: this.banderName });
    if (!user) throw new UserNotRegisteredInForm();
    if (!coupon) throw new CoupomUnvailable();
    coupon.user_email = user.email;
    coupon.user = user;
    coupon.redeemed_date = new Date().toISOString();
    await coumpomTable.save(coupon);
  }

  async verifyUserCoupom(_email: string): Promise<boolean> {
    const userTable = DataSource.getRepository(EasterUser);
    const res = await userTable.findOne({ relations: ['coupon'], where: { email: _email, tenant_id: this.banderName } });
    if (res && res.coupon) {
      return true;
    }
    return false;
  }

  async getCoupom(): Promise<{ expireDate: Date, code: string } | null> {
    const coumpomTable = DataSource.getRepository(EasterCoupon);
    const res = await coumpomTable.findOne({ where: { user_email: IsNull(), tenant_id: this.banderName } });
    if (res) {
      return {
        code: res.coupon_number,
        expireDate: res.created_at,
      };
    }
    return null;
  }

  async getCouponsByEmail(email: string): Promise<string | null> {
    const userTable = DataSource.getRepository(EasterUser);
    const res = await userTable.findOne({ relations: ['coupon'], where: { email, tenant_id: this.banderName } });

    if (!res) throw new UserNotRegisteredInForm();
    if (res && res.coupon) {
      return res.coupon.coupon_number;
    }
    return null;
  }

  async saveCoupons(coupons: string[]): Promise<void> {
    const coumpomTable = DataSource.getRepository(EasterCoupon);
    const formatCoupons = coupons.map((item) => ({ coupon_number: item, tenant_id: this.banderName }));
    coumpomTable.save(formatCoupons);
  }
}
