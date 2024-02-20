
import { UserAlreadyGetCoupom, CoupomUnvailable, UserAlreadyRegisteredInForm } from "../errors";
import { PascoaService } from "./pascoa.service";
import { MasterDataService } from "./masterdata.service";

describe("PascoaService", () => {
    let pascoaService: PascoaService
    let storageService: MasterDataService

    beforeEach(async () => {
        storageService = {
          getCoupom: jest.fn(),
          verifyUser: jest.fn(),
          saveCoupomInUser: jest.fn(),
          saveUserForm: jest.fn(),
          verifyUserAlreadyRegisteredForm: jest.fn()
        }
        pascoaService = new PascoaService(storageService);
      });

    it("Should be return redeemed coupom with success", async () => {
        const mockClientEmail = "wellingtonrufino@lelabs.com.br"
        const mockCoupomName = "TEST123"
        
        jest.spyOn(storageService, "verifyUser").mockImplementation(() =>  Promise.resolve(false))
        jest.spyOn(storageService, "getCoupom").mockImplementation(() => Promise.resolve(mockCoupomName))
        jest.spyOn(storageService, "saveCoupomInUser").mockImplementation(() => Promise.resolve())
        
        const res = await pascoaService.redeemCoupom({clientEmail: mockClientEmail});        
        expect(storageService.verifyUser).toHaveBeenCalledWith(mockClientEmail);
        expect(storageService.getCoupom).toHaveBeenCalled();
        expect(storageService.saveCoupomInUser).toHaveBeenCalledWith(mockClientEmail, mockCoupomName, );
        expect(res).toStrictEqual({coupomCode: mockCoupomName})
    })

    it("Should be return redeemed coupom withut sucess because coupom unvailable", async () => {
        const mockClientEmail = "wellingtonrufino@lelabs.com.br"

        jest.spyOn(storageService, "verifyUser").mockImplementation(() =>  Promise.resolve(false))
        jest.spyOn(storageService, "getCoupom").mockImplementation(() => Promise.resolve(null))
        expect(pascoaService.redeemCoupom({clientEmail: mockClientEmail})).rejects.toThrow(CoupomUnvailable)
        expect(storageService.verifyUser).toHaveBeenCalledWith(mockClientEmail);
        expect(storageService.getCoupom).toHaveBeenCalled();
    })

    it("Should not be return coupom, because user already get coupom", async () => {
        const mockClientEmail = "wellingtonrufino@lelabs.com.br"

        jest.spyOn(storageService, "verifyUser").mockImplementation(() =>  Promise.resolve(true))     
        expect(pascoaService.redeemCoupom({clientEmail: mockClientEmail})).rejects.toThrow(UserAlreadyGetCoupom)
        expect(storageService.verifyUser).toHaveBeenCalledWith(mockClientEmail);
    })

    it("should be register client with success", async () => {
        const mockClientData = {
            cpf: "53060329827",
            cell: "11968639473",
            email: "wellingtonrufino@lelabs.com",
            acceptedTerms: true,
        }

        jest.spyOn(storageService, 'saveUserForm').mockImplementation(() => Promise.resolve())
        const res = await pascoaService.registerClient(mockClientData);
        expect(storageService.saveUserForm).toHaveBeenCalledWith(mockClientData)
        expect(res).toBe(undefined)
    })

    it("should NOT be register client, because user already registered", async () => {
        const mockClientData = {
            cpf: "53060329827",
            cell: "11968639473",
            email: "wellingtonrufino@lelabs.com",
            acceptedTerms: true,
        }

        const {acceptedTerms, ...mockClientProps} = mockClientData

        jest.spyOn(storageService, 'verifyUserAlreadyRegisteredForm').mockImplementation(() => Promise.resolve(mockClientProps))
        expect(pascoaService.registerClient(mockClientData)).rejects.toThrow(UserAlreadyRegisteredInForm)
        expect(storageService.verifyUserAlreadyRegisteredForm).toHaveBeenCalledWith(mockClientProps)
    })
})