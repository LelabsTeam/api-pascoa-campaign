import { IStorageService } from "src/interfaces/istorage.service";
import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class MasterDataService implements IStorageService {
    constructor(@Inject(REQUEST) private request?: Request){
        header
    }
    verifyUserCoupom(email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    verifyUserAlreadyRegisteredForm(props: { email: string; cpf?: string; cell?: string; }): Promise<{ email: string; cpf: string; cell: string; } | null> {
        throw new Error("Method not implemented.");
    }
    saveUserForm(props: { email: string; cpf: string; cell: string; acceptedTerms: boolean; }): Promise<void> {
        throw new Error("Method not implemented.");
    }
    saveCoupomInUser(email: string, coupomId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getCoupom(): Promise<string | null> {
        throw new Error("Method not implemented.");
    }
}