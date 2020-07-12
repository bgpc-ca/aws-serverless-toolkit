import { ApiGatewayErrorResponse } from "../types/aws";
import { BusinessError } from "../types/errors";

export function errorHelper(e: Error | BusinessError): ApiGatewayErrorResponse {
  if ("business" in e)
    return {
      headers: {
        "Content-Type": "text/plain",
      },
      statusCode: e.statusCode,
      body: e.body,
    };

  console.log(e);
  return {
    headers: {
      "Content-Type": "text/plain",
    },
    statusCode: 500,
    body: "Internal Server Error",
  };
}
