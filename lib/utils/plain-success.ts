import { ApiGatewaySuccessResponse } from "../types/aws";

export const plainSuccess: ApiGatewaySuccessResponse = {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    payload: "OK",
  }),
};

export type PlainSuccessResponsePayload = "OK";
