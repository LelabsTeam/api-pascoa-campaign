import { Repository  } from 'typeorm';
import DataSource from '../gateways/database/ormconfig';
import { EasterUser } from '../gateways/database/model/EasterUser.model';
import { EasterCoupon } from '../gateways/database/model/EasterCoupon.model';
import { StorageRepository } from './storage.repository';
import { CoupomUnvailable, UserNotRegisteredInForm } from '../errors';
describe('StorageRepository', () => {
  let userTable: Repository<EasterUser>;
  let couponTable: Repository<EasterCoupon>;
  const DEFAULT_TENANT = 'CV';
  const headers = {
    'flag-name': DEFAULT_TENANT,
  };
  // @ts-ignore
  const storageService = new StorageRepository({ headers });
  beforeAll(async () => {
    await DataSource.initialize();
    userTable = DataSource.getRepository(EasterUser);
    couponTable = DataSource.getRepository(EasterCoupon);
  });

  afterEach(async () => {
    try {
      await userTable.clear();
      await couponTable.query(`SET FOREIGN_KEY_CHECKS = 0`);
      await couponTable.query(`TRUNCATE TABLE eastercoupon`);
      await couponTable.query(`SET FOREIGN_KEY_CHECKS = 1`);
    } catch (err) {
      console.log('error:', err);
    }
  });

  it('should be verify user WITH data', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: 'CV',
    };

    await userTable.save(mockUserData);
    const res = await storageService.verifyUserAlreadyRegisteredForm({ email: mockUserData.email, cell: mockUserData.phone, cpf: mockUserData.cpf });

    expect(res).toStrictEqual({ email: mockUserData.email, cell: mockUserData.phone, cpf: mockUserData.cpf });
  });

  it('should NOT be verify user data, because different tenant ID', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: 'LB',
    };

    await userTable.save(mockUserData);
    const res = await storageService.verifyUserAlreadyRegisteredForm({ email: mockUserData.email });

    expect(res).toStrictEqual(null);
  });

  it('should be verify user WITHOUT data', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: DEFAULT_TENANT,
    };
    const res = await storageService.verifyUserAlreadyRegisteredForm({ email: mockUserData.email, cell: mockUserData.phone, cpf: mockUserData.cpf });

    expect(res).toStrictEqual(null);
  });

  it('should be verify user coupon with data true', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: DEFAULT_TENANT,
    };
    const response = await userTable.save(mockUserData);
    await couponTable.save({
      coupon_number: 'TESTE', user_email: response.email, user: response, tenant_id: 'CV',
    });
    const res = await storageService.verifyUserCoupom(mockUserData.email);
    expect(res).toBe(true);
  });

  it('should NOT be verify user coupon with data true', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: 'LB',
    };
    const response = await userTable.save(mockUserData);
    await couponTable.save({
      coupon_number: 'TESTE', user_email: response.email, user: response, tenant_id: DEFAULT_TENANT,
    });
    const res = await storageService.verifyUserCoupom(mockUserData.email);
    expect(res).toBe(false);
  });

  it('should be verify user coupon with data false', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: 'CV',
    };

    await userTable.save(mockUserData);
    const res = await storageService.verifyUserCoupom(mockUserData.email);
    expect(res).toBe(false);
  });

  it('should be save user form', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: 'CV',
    };
    await storageService.saveUserForm({
      acceptedTerms: mockUserData.accepted_terms,
      cell: mockUserData.phone,
      cpf: mockUserData.cpf,
      email: mockUserData.email,
    });
    const res = await userTable.findOneBy({ email: mockUserData.email });
    expect(res.email).toBe(mockUserData.email);
  });

  it('should be save cupom in user', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: 'CV',
    };
    const mockCouponNumber = 'TESTE123';

    await userTable.save(mockUserData);
    await couponTable.save({ coupon_number: mockCouponNumber, tenant_id: mockUserData.tenant_id });

    await storageService.saveCoupomInUser(mockUserData.email, mockCouponNumber);

    const res = await userTable.findOne({ relations: ['coupon'], where: { email: mockUserData.email } });
    expect(res.coupon.coupon_number).toBe(mockCouponNumber);
  });

  it('should NOT be save cupom in user, because tennant id of user is different', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: 'LB',
    };
    const mockCouponNumber = 'TESTE123';

    await userTable.save(mockUserData);
    await couponTable.save({ coupon_number: mockCouponNumber, tenant_id: DEFAULT_TENANT });

    try {
      await storageService.saveCoupomInUser(mockUserData.email, mockCouponNumber);
    } catch (err) {
      expect(err).toBeInstanceOf(UserNotRegisteredInForm);
    }
  });

  it('should NOT be save cupom in user, because tennant id of coupon is different', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino@lelabs.com',
      tenant_id: DEFAULT_TENANT,
    };
    const mockCouponNumber = 'TESTE123';

    await userTable.save(mockUserData);
    await couponTable.save({ coupon_number: mockCouponNumber, tenant_id: 'LB' });

    try {
      await storageService.saveCoupomInUser(mockUserData.email, mockCouponNumber);
    } catch (err) {
      expect(err).toBeInstanceOf(CoupomUnvailable);
    }
  });

  it('should be user get coupon', async () => {
    const mockUserData1 = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino1@lelabs.com',
      tenant_id: 'CV',
    };
    const mockUserData2 = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino2@lelabs.com',
      tenant_id: 'CV',
    };
    const mockUserData3 = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino3@lelabs.com',
      tenant_id: 'CV',
    };

    const [mockCouponNumber1, mockCouponNumber2, mockCouponNumber3] = ['COUPONTEST1', 'COUPONTEST2', 'COUPONTEST3'];

    await userTable.save([mockUserData1, mockUserData2, mockUserData3]);
    const mockTenantId = 'CV';
    await couponTable.save(
      [{ coupon_number: 'COUPONTEST1', tenant_id: mockTenantId },
        { coupon_number: 'COUPONTEST2', tenant_id: mockTenantId },
        { coupon_number: 'COUPONTEST3', tenant_id: mockTenantId }],
    );

    const res = await storageService.getCoupom();
    expect(res.code).toBe(mockCouponNumber1);
  });

  it('should NOT be user get coupon', async () => {
    const mockUserData1 = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino1@lelabs.com',
      tenant_id: 'CV',
    };
    await userTable.save([mockUserData1]);

    const res = await storageService.getCoupom();
    expect(res).toBe(null);
  });

  it('should be get coupon by user', async () => {
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino3@lelabs.com',
      tenant_id: 'CV',
    };

    const mockCouponNumber = 'COUPONTEST1';

    const user = await userTable.save(mockUserData);
    const mockTenantId = 'CV';
    await couponTable.save({
      coupon_number: mockCouponNumber, tenant_id: mockTenantId, user, user_email: user.email, redeemed_date: new Date().toISOString(),
    });

    const res = await storageService.getCouponsByEmail(mockUserData.email);
    expect(res).toEqual(mockCouponNumber);
  });

  it('should NOT be get coupon by because different tenant ID', async () => {
    const mockTenantId = 'CV';
    const mockUserData = {
      cpf: '53060329826',
      phone: '11968639473',
      accepted_terms: true,
      email: 'wellingtonrufino3@lelabs.com',
      tenant_id: 'LB',
    };

    const mockCouponNumber = 'COUPONTEST1';

    const user = await userTable.save(mockUserData);
    await couponTable.save({
      coupon_number: mockCouponNumber, tenant_id: mockTenantId, user, user_email: user.email, redeemed_date: new Date().toISOString(),
    });

      try{
        await storageService.getCouponsByEmail(mockUserData.email);
      }catch(err){
        expect(err).toBeInstanceOf(UserNotRegisteredInForm);
      }
  });
});
