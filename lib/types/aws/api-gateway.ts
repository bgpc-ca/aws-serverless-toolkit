import { BusinessErrorData } from "../errors";
import { Request, Response } from "express";

export type HttpHeaders = { [key: string]: string };
export type MultiValueHttpHeaders = { [key: string]: string[] };
type pathParameters = { [key: string]: string };
type queryStringParameters = { [key: string]: string };
type multiValueQueryStringParameters = { [key: string]: string[] };
export type Default = { [key: string]: string };
export type BetterRequest = Request<Default, unknown, Default, Default>;
export type BetterResponse = Response<Default>;

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
  body: Default;
};

export type ApiGatewayErrorResponse = BaseApiGatewayResponse & {
  headers: HttpHeaders & {
    "Content-Type": "text/plain";
  };
  body: string;
};

export type ApiGatewaySuccessResponse = {
  statusCode: 200;
  headers: HttpHeaders & {
    "Content-Type": "application/json";
  };
  body: string;
};

export type ApiGatewayResponse = ApiGatewayErrorResponse | ApiGatewaySuccessResponse;

/**
 * For each possibly thrown error, E needs to include that error's errorData type as an intersection type
 */
export type ApiGatewayBusinessResponseBody<S, E extends BusinessErrorData> =
  | {
      payload: S;
      error: null;
    }
  | {
      payload: null;
      error: E;
    };

// type MyBusinessResponseBody = ApiGatewayBusinessResponseBody<
//   { good: "truetrue" },
//   | RequireAllPropertiesPassGetAllFailsErrorData<{ key: "value" }>
//   | RequireAllPropertiesPassThrowAtFirstErrorData<{ key: "value" }>
// >;

// Axios.post<MyBusinessResponseBody>("").then((res) => {
//   if (res.data.error)
//     switch (res.data.error.code) {
//     }
//   else res.data.payload.good;
// });
