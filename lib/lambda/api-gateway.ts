import { ApiGatewayResponse, ApiGatewayEvent } from "../types";
import { errorHelper } from "../utils/error-helper";
import { internalError } from "../utils/internal-error";

// This thing uses Given 100% of the time
export function apiGatewayLambda(
  main: (event: ApiGatewayEvent) => Promise<ApiGatewayResponse | void>,
): (event: ApiGatewayEvent) => Promise<ApiGatewayResponse> {
  return async function (event: ApiGatewayEvent) {
    try {
      const result = await main(event);
      // NOTE: internalError here is actually never hit, just removing red squigly
      // Also in the worst case you still get a nicely formatted response
      return result || internalError;
    } catch (e) {
      return errorHelper(e);
    }
  };
}
