import { PascoaService } from '../services/pascoa.service';

export function registerClientValidator(props?: any) {
  const requiredField: Array<keyof PascoaService.RegisterClientProps> = ['cell', 'cpf', 'email', 'acceptedTerms'];
  const errorFields: string[] = [];
  if (!props) return requiredField;
  requiredField.forEach((item) => {
    // if (Object.hasOwn(props, item)) return;
    errorFields.push(String(item));
  });
  return errorFields;
}
