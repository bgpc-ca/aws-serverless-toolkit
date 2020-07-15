import { ApiGatewayErrorResponse } from "../types/aws";
import { BusinessError } from "../types/errors";

export function errorHelper(e: Error | BusinessError): ApiGatewayErrorResponse {
  if ("business" in e)
    return {
      headers: {
        "Content-Type": "text/plain",
      },
      statusCode: e.statusCode,
      body: JSON.stringify({
        error: e.errorData,
      }),
    };

  console.log(e);
  return {
    headers: {
      "Content-Type": "text/plain",
    },
    statusCode: 500,
    body: JSON.stringify({
      error: {
        code: "Internal Server Error",
      },
    }),
  };
}
