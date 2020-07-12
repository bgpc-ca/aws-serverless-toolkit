export class BusinessError {
  business = true;
  constructor(public statusCode: number, public body: string) {}
}

export class BadRequestError extends BusinessError {
  constructor(body: string) {
    super(400, body);
  }
}
