import { ApiGatewaySuccessResponse } from "../types/aws";

export const success = <B>(body: B): ApiGatewaySuccessResponse => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
