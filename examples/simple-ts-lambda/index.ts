import { plainSuccess, ApiGatewayEvent, ApiGatewayResponse, ApiGatewayPlainSuccessResponse } from "../../lib";
import { apiGatewayLambda } from "../../lib/lambda";

async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse<ApiGatewayPlainSuccessResponse>> {
  return plainSuccess;
}

export const handler = apiGatewayLambda(main);
