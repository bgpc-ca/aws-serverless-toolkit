export class BusinessError<D = void> {
  business = true;
  constructor(public statusCode: number, public errorData?: D) {}
}

export class BadRequestError<D> extends BusinessError<D> {
  constructor(errorData?: D) {
    super(400, errorData);
  }
}

export type BusinessErrorData = { code: string };
