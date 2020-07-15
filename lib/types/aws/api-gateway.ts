export type HttpHeaders = { [key: string]: string };
export type MultiValueHttpHeaders = { [key: string]: string[] };
type pathParameters = { [key: string]: string };
type queryStringParameters = { [key: string]: string };
type multiValueQueryStringParameters = { [key: string]: string[] };

export type ApiGatewayEvent = {
  resource: string;
  path: string;
  httpMethod: string;
  requestContext: {
    resourcePath: string;
    httpMethod: string;
    path: string;
  } | null;
  headers: HttpHeaders | null;
  multiValueHeaders: MultiValueHttpHeaders | null;
  queryStringParameters: queryStringParameters | null;
  multiValueQueryStringParameters: multiValueQueryStringParameters | null;
  pathParameters: pathParameters | null;
  stageVariables: string | null;
  body: string | null;
  isBase64Encoded: boolean;
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
