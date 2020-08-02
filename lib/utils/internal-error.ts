import { ApiGatewayResponse } from "../types";

export const internalError: ApiGatewayResponse = {
  headers: {
    "Content-Type": "application/json",
  },
  statusCode: 500,
  body: JSON.stringify({
    error: {
      code: "Internal Server Error",
    },
  }),
};
