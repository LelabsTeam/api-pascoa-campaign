import { registerClientValidator } from "./register-client.validator"

describe("RegisterClientValidator", () => {
    it("should be return empty array", () => {
        const res = registerClientValidator({acceptedTerms: true, cell: "11968639473", cpf: "53060329826", email: "wellingtonjr53@outlook.com.br"})
        expect(res).toEqual([])
    })

    it("should NOT be return empty array", () => {
        const res = registerClientValidator({cell: "11968639473", cpf: "53060329826", email: "wellingtonjr53@outlook.com.br"})
        expect(res).toEqual(["acceptedTerms"])
    })
})