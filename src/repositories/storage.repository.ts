/* eslint-disable max-len */
import { IStorageRepository } from 'src/repositories/istorage.repository';
import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class StorageRepository implements IStorageRepository {
  constructor(@Inject(REQUEST) private request?: Request) {

  }

  verifyUserCoupom(_email: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  verifyUserAlreadyRegisteredForm(_props: { email: string; cpf?: string; cell?: string; }): Promise<{ email: string; cpf: string; cell: string; } | null> {
    throw new Error('Method not implemented.');
  }

  saveUserForm(_props: { email: string; cpf: string; cell: string; acceptedTerms: boolean; }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  saveCoupomInUser(_email: string, _coupomId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getCoupom(): Promise<string | null> {
    throw new Error('Method not implemented.');
  }

  getCouponsByEmail(email: string) {
    return [email];
  }
}
