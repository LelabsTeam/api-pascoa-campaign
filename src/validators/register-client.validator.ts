import { PascoaController } from "src/controllers/pascoa.controller";
import { PascoaService } from "../services";

export function registerClientValidator(props?: any){
    const requiredField: Array<keyof PascoaService.RegisterClientProps> = ["cell", "cpf", "email", "acceptedTerms"]
    let errorFields: string[] = []
    if(!props) return requiredField
    requiredField.forEach((item) => {  
        if(Object.hasOwn(props, item)) return
        errorFields.push(item)
    })
    return errorFields
}