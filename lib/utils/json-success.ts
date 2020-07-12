import { ApiGatewayJsonSuccessResponse } from "../types/aws";

export const jsonSuccess = (body: Record<string, any>): ApiGatewayJsonSuccessResponse => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body,
});
