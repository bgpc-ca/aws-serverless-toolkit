export type HttpHeaders = { [key: string]: string };

export type ApiGatewayEvent = {
  headers: HttpHeaders;
  body: string;
};

export type BaseApiGatewayResponse = {
  statusCode: number;
  headers: HttpHeaders;
};

export type BaseApiGatewaySuccessResponse = BaseApiGatewayResponse & {
  statusCode: 200;
};

export type ApiGatewayErrorResponse = BaseApiGatewayResponse & {
  headers: HttpHeaders & {
    "Content-Type": "text/plain";
  };
  body: string;
};

export type ApiGatewayPlainSuccessResponse = BaseApiGatewaySuccessResponse & {
  headers: HttpHeaders & {
    "Content-Type": "text/plain";
  };
  body: "OK";
};

export type ApiGatewayJsonSuccessResponse<B = Record<string, any>> = BaseApiGatewaySuccessResponse & {
  headers: HttpHeaders & {
    "Content-Type": "application/json";
  };
  body: B;
};

export type ApiGatewayResponse<S extends BaseApiGatewaySuccessResponse> = ApiGatewayErrorResponse | S;
