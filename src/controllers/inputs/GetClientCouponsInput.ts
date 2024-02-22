import { IsEmail, IsString } from 'class-validator';

export class GetClientCouponsInput {
  @IsEmail()
  @IsString()
    clientEmail: string;
}
