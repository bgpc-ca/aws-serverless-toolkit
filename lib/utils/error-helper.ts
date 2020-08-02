import { ApiGatewayResponse } from "../types/aws";
import { BusinessError } from "../types/errors";
import { internalError } from "./internal-error";

export function errorHelper(e: Error | BusinessError): ApiGatewayResponse {
  if ("business" in e)
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: e.statusCode,
      body: JSON.stringify({
        error: e.errorData,
      }),
    };

  console.log(e);
  return internalError;
}
