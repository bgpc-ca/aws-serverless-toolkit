import { plainSuccess, ApiGatewayEvent, ApiGatewayResponse } from "../../lib";
import { apiGatewayLambda } from "../../lib/lambda";

async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
  return plainSuccess;
}

export const handler = apiGatewayLambda(main);
