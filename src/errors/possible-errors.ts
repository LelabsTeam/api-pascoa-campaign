import { AcceptedTermsIsFalse } from './accepted-terms-is-false';
import { CoupomUnvailable } from './cupom-unvailable';
import { FieldIsEmpty } from './field-empty';
import { UserAlreadyGetCoupom } from './user-already-get-coupom';
import { UserAlreadyRegisteredInForm } from './user-already-registered-in-form';
import { WrongTennantId } from './wrong-tennant-id';

export const POSSIBLE_APLICATION_ERRORS = [CoupomUnvailable, UserAlreadyGetCoupom, UserAlreadyRegisteredInForm, FieldIsEmpty, AcceptedTermsIsFalse, WrongTennantId];
