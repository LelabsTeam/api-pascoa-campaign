export class FieldIsEmpty extends Error {
  constructor(fields: string[]) {
    super();
    this.message = `required fields: ${fields.join(', ')}`;
  }
}
