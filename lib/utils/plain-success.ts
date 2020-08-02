import { ApiGatewayResponse } from "../types/aws";

export const plainSuccess: ApiGatewayResponse = {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    payload: "OK",
  }),
};

export type PlainSuccessResponsePayload = "OK";
