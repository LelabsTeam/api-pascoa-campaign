import {
  UserAlreadyGetCoupom, CoupomUnvailable, UserAlreadyRegisteredInForm, UserNotRegisteredInForm,
} from '../errors';
import { PascoaService } from './pascoa.service';
import { StorageRepository } from '../repositories/storage.repository';

describe('PascoaService', () => {
  let pascoaService: PascoaService;
  let storageService: StorageRepository;
  const DEFAULT_TENANT = 'CV';

  beforeEach(async () => {
    storageService = {
      getCoupom: jest.fn(),
      verifyUserCoupom: jest.fn(),
      saveCoupomInUser: jest.fn(),
      saveUserForm: jest.fn(),
      verifyUserAlreadyRegisteredForm: jest.fn(),
      getCouponsByEmail: jest.fn(),
      banderName: 'CV',
      saveCoupons: jest.fn(),
    };
    const headers = {
      'bander-name': DEFAULT_TENANT,
    };
    // @ts-ignore
    pascoaService = new PascoaService(storageService, { headers });
  });

  const mockVerifyUserReturn = {
    email: 'wellingtonrufino@lelabs.com',
    cpf: '54060329826',
    cell: '11968639473',
  };

  it('Should be return redeemed coupom with success', async () => {
    const mockClientEmail = 'wellingtonrufino@lelabs.com.br';
    const mockCoupomName = 'TEST123';

    jest.spyOn(storageService, 'verifyUserAlreadyRegisteredForm').mockImplementation(() => Promise.resolve(mockVerifyUserReturn));
    jest.spyOn(storageService, 'verifyUserCoupom').mockImplementation(() => Promise.resolve(false));
    jest.spyOn(storageService, 'getCoupom').mockImplementation(() => Promise.resolve(mockCoupomName));
    jest.spyOn(storageService, 'saveCoupomInUser').mockImplementation(() => Promise.resolve());

    const res = await pascoaService.redeemCoupom({ clientEmail: mockClientEmail });
    expect(storageService.verifyUserCoupom).toHaveBeenCalledWith(mockClientEmail);
    expect(storageService.getCoupom).toHaveBeenCalled();
    expect(storageService.saveCoupomInUser).toHaveBeenCalledWith(mockClientEmail, mockCoupomName);
    expect(res).toStrictEqual({ coupomCode: mockCoupomName });
  });

  it('Should be return redeemed coupom withut success because coupom unvailable', async () => {
    const mockClientEmail = 'wellingtonrufino@lelabs.com.br';

    jest.spyOn(storageService, 'verifyUserAlreadyRegisteredForm').mockImplementation(() => Promise.resolve(mockVerifyUserReturn));
    jest.spyOn(storageService, 'verifyUserCoupom').mockImplementation(() => Promise.resolve(false));
    jest.spyOn(storageService, 'getCoupom').mockImplementation(() => Promise.resolve(null));

    try {
      await pascoaService.redeemCoupom({ clientEmail: mockClientEmail });
    } catch (err) {
      expect(err).toBeInstanceOf(CoupomUnvailable);
      expect(storageService.getCoupom).toHaveBeenCalled();
      expect(storageService.verifyUserCoupom).toHaveBeenCalledWith(mockClientEmail);
    }
  });

  it('Should not be return coupom, because user already get coupom', async () => {
    const mockClientEmail = 'wellingtonrufino@lelabs.com.br';

    jest.spyOn(storageService, 'verifyUserAlreadyRegisteredForm').mockImplementation(() => Promise.resolve(mockVerifyUserReturn));
    jest.spyOn(storageService, 'verifyUserCoupom').mockImplementation(() => Promise.resolve(true));

    try {
      await pascoaService.redeemCoupom({ clientEmail: mockClientEmail });
    } catch (err) {
      expect(err).toBeInstanceOf(UserAlreadyGetCoupom);
      expect(storageService.verifyUserCoupom).toHaveBeenCalledWith(mockClientEmail);
    }
  });
  it('Should not be return coupom, because user not registered in form', async () => {
    const mockClientEmail = 'wellingtonrufino@lelabs.com.br';
    jest.spyOn(storageService, 'verifyUserAlreadyRegisteredForm').mockImplementation(() => Promise.resolve(null));

    try {
      await pascoaService.redeemCoupom({ clientEmail: mockClientEmail });
    } catch (err) {
      expect(err).toBeInstanceOf(UserNotRegisteredInForm);
      expect(storageService.verifyUserAlreadyRegisteredForm).toHaveBeenCalledWith({ email: mockClientEmail });
    }
  });

  it('should be register client with success', async () => {
    const mockClientData = {
      cpf: '53060329827',
      cell: '11968639473',
      email: 'wellingtonrufino@lelabs.com',
      acceptedTerms: true,
    };

    jest.spyOn(storageService, 'verifyUserAlreadyRegisteredForm').mockImplementation(() => Promise.resolve(null));
    jest.spyOn(storageService, 'saveUserForm').mockImplementation(() => Promise.resolve());
    const res = await pascoaService.registerClient(mockClientData);
    expect(storageService.saveUserForm).toHaveBeenCalledWith(mockClientData);
    expect(res).toBe(undefined);
  });

  it('should NOT be register client, because user already registered', async () => {
    const mockClientData = {
      cpf: '53060329827',
      cell: '11968639473',
      email: 'wellingtonrufino@lelabs.com',
      acceptedTerms: true,
    };

    const { acceptedTerms, ...mockClientProps } = mockClientData;

    jest.spyOn(storageService, 'verifyUserAlreadyRegisteredForm').mockImplementation(() => Promise.resolve(mockClientProps));

    try {
      await pascoaService.registerClient(mockClientData);
    } catch (err) {
      expect(err).toBeInstanceOf(UserAlreadyRegisteredInForm);
      expect(storageService.verifyUserAlreadyRegisteredForm).toHaveBeenCalledWith(mockClientProps);
    }
  });
});
