import { Test, TestingModule } from '@nestjs/testing';
import { PascoaController } from './pascoa.controller';
import { MasterDataService, PascoaService } from '../services';

describe('PascoaController', () => {
  let pascoaController: PascoaController;
  let pascoaService: PascoaService
  
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [PascoaController],
      providers: [PascoaService, MasterDataService],
    }).compile();

    pascoaController = app.get<PascoaController>(PascoaController);
    pascoaService = app.get<PascoaService>(PascoaService);
  });
  
      it('coupom number redeemed with SUCCESS"', async () => {
        const coupomReedemed = {
            data: {
                coupomCode: "TESTE123"
            },
            status: "success",
            message: "coupom redeemed with success"
        }
        const mockEmail = "wellingtonrufino@lelabs.com"


        jest.spyOn(pascoaService, 'redeemCoupom').mockImplementation(() => Promise.resolve(coupomReedemed.data));
        const res = await pascoaController.redeemCoupom({clientEmail: mockEmail})
        expect(pascoaService.redeemCoupom).toHaveBeenCalledWith({clientEmail: mockEmail})
        expect(res).toStrictEqual(coupomReedemed);
      });

      it('coupom number redeemed WITHOUT success"', async () => {
        const coupomReedemed = {
            data: null,
            status: "error",
            message: "Coupom "
        }
        const mockEmail = "wellingtonrufino@lelabs.com"


        jest.spyOn(pascoaService, 'redeemCoupom').mockImplementation(() => Promise.resolve(null));
        const res = await pascoaController.redeemCoupom({clientEmail: mockEmail})


        expect(pascoaService.redeemCoupom).toHaveBeenCalledWith({clientEmail: mockEmail})
        expect(res).toStrictEqual(coupomReedemed);
      });

      it('coupom number redeemed WITHOUT success because email is empty"', async () => {
        const coupomReedemed = {
            data: null,
            status: "error"
        }
        const res = await pascoaController.redeemCoupom()
        expect(res).toStrictEqual(coupomReedemed);
      });

      it('coupom number redeemed WITHOUT success coupom unvailable"', async () => {
        const coupomReedemed = {
            data: null,
            status: "error"
        }
        const res = await pascoaController.redeemCoupom()
        expect(res).toStrictEqual(coupomReedemed);
      });
      it("should be post form with SUCCESS" , async () => {
        const mockUserForm = {
            clientEmail: "",
            cpf: "",
            cell: "",
            acceptedTerms: "",            
        };

        jest.spyOn(pascoaService, 'registerClient');
        const res =  await pascoaController.registerClient(mockUserForm);


      })
});
