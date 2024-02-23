import { PascoaController } from './pascoa.controller';
import { PascoaService } from '../services/pascoa.service';
import { StorageRepository } from '../repositories/storage.repository';
import { AcceptedTermsIsFalse, CoupomUnvailable, UserAlreadyRegisteredInForm } from '../errors';

describe('PascoaController', () => {
  let pascoaController: PascoaController;
  let pascoaService: PascoaService;

  beforeEach(async () => {
    const headers = new Headers();
    headers.append('bander-name', 'cv');

    // @ts-ignore
    const storageService = new StorageRepository({ headers });
    pascoaService = new PascoaService(storageService);
    pascoaController = new PascoaController(pascoaService);
  });

  it('coupom number redeemed WITH success"', async () => {
    const coupomReedemed = {
      data: {
        coupomCode: 'TESTE123',
      },
      status: 'success',
      message: 'coupom redeemed with success',
    };
    const mockEmail = 'wellingtonrufino@lelabs.com';

    jest.spyOn(pascoaService, 'redeemCoupom').mockImplementation(() => Promise.resolve(coupomReedemed.data));
    const res = await pascoaController.redeemCoupom({ clientEmail: mockEmail });

    expect(pascoaService.redeemCoupom).toHaveBeenCalledWith({ clientEmail: mockEmail });
    expect(res).toStrictEqual(coupomReedemed);
  });

  it('coupom number redeemed WITHOUT success', async () => {
    const coupomReedemed = {
      data: null,
      status: 'error',
      message: 'internal server error',
    };
    const mockEmail = 'wellingtonrufino@lelabs.com';

    jest.spyOn(pascoaService, 'redeemCoupom').mockImplementation(() => { throw new Error(); });
    const res = await pascoaController.redeemCoupom({ clientEmail: mockEmail });

    expect(pascoaService.redeemCoupom).toHaveBeenCalledWith({ clientEmail: mockEmail });
    expect(res).toStrictEqual(coupomReedemed);
  });

  it('coupom number redeemed WITHOUT success coupom unvailable"', async () => {
    const mockUserForm = {
      clientEmail: 'wellingtonrufino@lelabs.com',
      cpf: '530.603.298-26',
      cell: '11968639473',
      acceptedTerms: true,
    };
    const expectedResponse = {
      data: null,
      status: 'error',
      message: new CoupomUnvailable().message,
    };

    jest.spyOn(pascoaService, 'redeemCoupom').mockImplementation(() => { throw new CoupomUnvailable(); });
    const res = await pascoaController.redeemCoupom(mockUserForm);

    expect(pascoaService.redeemCoupom).toHaveBeenCalledWith({ clientEmail: mockUserForm.clientEmail });
    expect(res).toStrictEqual(expectedResponse);
  });
  it('should be post form with SUCCESS', async () => {
    const mockUserForm = {
      email: 'wellingtonrufino@lelabs.com',
      cpf: '53060329826',
      cell: '11968639473',
      acceptedTerms: true,
    };

    const expectedResponse = {
      data: null,
      status: 'success',
      message: 'user registered with success',
    };

    jest.spyOn(pascoaService, 'registerClient').mockImplementation(() => Promise.resolve());
    const res = await pascoaController.registerClient(mockUserForm);
    expect(pascoaService.registerClient).toHaveBeenCalledWith(mockUserForm);
    expect(res).toStrictEqual(expectedResponse);
  });

  it('should NOT be post form with SUCCESS, because accepted terms is false', async () => {
    const mockUserForm = {
      email: 'wellingtonrufino@lelabs.com',
      cpf: '53060329826',
      cell: '11968639473',
      acceptedTerms: false,
    };
    const expectedResponse = {
      data: null,
      status: 'error',
      message: 'required accepted terms',
    };

    jest.spyOn(pascoaService, 'registerClient').mockImplementation(() => { throw new AcceptedTermsIsFalse(); });
    const res = await pascoaController.registerClient(mockUserForm);
    expect(res).toStrictEqual(expectedResponse);
    expect(pascoaService.registerClient).toHaveBeenCalledWith(mockUserForm);
  });
  it('should NOT be post form with SUCCESS, because user already registered', async () => {
    const mockUserForm = {
      email: 'wellingtonrufino@lelabs.com',
      cpf: '53060329826',
      cell: '11968639473',
      acceptedTerms: false,
    };
    const expectedResponse = {
      data: null,
      status: 'error',
      message: new UserAlreadyRegisteredInForm().message,
    };

    jest.spyOn(pascoaService, 'registerClient').mockImplementation(() => { throw new UserAlreadyRegisteredInForm(); });
    const res = await pascoaController.registerClient(mockUserForm);
    expect(res).toStrictEqual(expectedResponse);
    expect(pascoaService.registerClient).toHaveBeenCalledWith(mockUserForm);
  });

  it('should NOT be post form with SUCCESS, because few field is empty', async () => {
    const mockUserForm = {
    };

    const expectedResponse = {
      data: null,
      status: 'error',
      message: 'required fields: cell, cpf, email, acceptedTerms',
    };
    const res = await pascoaController.registerClient(mockUserForm);
    expect(res).toStrictEqual(expectedResponse);
  });

  it('should NOT be post form with SUCCESS, because one field is empty', async () => {
    const mockUserForm = {
      email: 'wellingtonrufino@lelabs.com',
      cpf: '53060329826',
      acceptedTerms: true,
    };

    const expectedResponse = {
      data: null,
      status: 'error',
      message: 'required fields: cell',
    };
    const res = await pascoaController.registerClient(mockUserForm);
    expect(res).toStrictEqual(expectedResponse);
  });

  it('should NOT be post form with SUCCESS, because any field is registered', async () => {
    const mockUserForm = {
      email: 'wellingtonrufino@lelabs.com',
      cpf: '53060329826',
      acceptedTerms: true,
    };

    const expectedResponse = {
      data: null,
      status: 'error',
      message: 'required fields: cell',
    };

    const res = await pascoaController.registerClient(mockUserForm);
    expect(res).toStrictEqual(expectedResponse);
  });
});
