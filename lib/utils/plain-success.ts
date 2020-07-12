import { ApiGatewayPlainSuccessResponse } from "../types/aws";

export const plainSuccess: ApiGatewayPlainSuccessResponse = {
  statusCode: 200,
  headers: {
    "Content-Type": "text/plain",
  },
  body: "OK",
};
