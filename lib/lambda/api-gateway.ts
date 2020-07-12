import { ApiGatewayResponse, BaseApiGatewaySuccessResponse, ApiGatewayEvent } from "../types";
import { errorHelper } from "../utils/error-helper";

export function apiGatewayLambda<S extends BaseApiGatewaySuccessResponse>(
  main: (event: ApiGatewayEvent) => Promise<ApiGatewayResponse<S>>,
): (event: ApiGatewayEvent) => Promise<ApiGatewayResponse<S>> {
  return async function (event: ApiGatewayEvent) {
    try {
      return await main(event);
    } catch (e) {
      return errorHelper(e);
    }
  };
}
