import { BusinessErrorData } from "../errors";
import { Request, Response } from "express";
export type Default = { [key: string]: string };
export type HttpHeaders = Default;
export type MultiValueHttpHeaders = { [key: string]: string[] };
type pathParameters = { [key: string]: string };
type queryStringParameters = { [key: string]: string };
type multiValueQueryStringParameters = { [key: string]: string[] };

export type QueryType = { [key: string]: string | string[] };
export type BetterRequest = Request<Default, unknown, Default, QueryType>;
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

export type ApiGatewayResponse = {
  statusCode: number;
  headers: HttpHeaders & {
    "Content-Type": "application/json";
  };
  body: string;
} | void;

/**
 * For each possibly thrown error, E needs to include that error's errorData type as a union type
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
