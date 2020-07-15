import { BusinessErrorData } from "../errors";

export type HttpHeaders = { [key: string]: string };

export type ApiGatewayEvent = {
  headers: HttpHeaders;
  body: string;
};

export type BaseApiGatewayResponse = {
  statusCode: number;
  headers: HttpHeaders;
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
