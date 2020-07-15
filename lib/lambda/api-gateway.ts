import { ApiGatewayResponse, ApiGatewayEvent } from "../types";
import { errorHelper } from "../utils/error-helper";

export function apiGatewayLambda(
  main: (event: ApiGatewayEvent) => Promise<ApiGatewayResponse>,
): (event: ApiGatewayEvent) => Promise<ApiGatewayResponse> {
  return async function (event: ApiGatewayEvent) {
    try {
      return await main(event);
    } catch (e) {
      return errorHelper(e);
    }
  };
}
