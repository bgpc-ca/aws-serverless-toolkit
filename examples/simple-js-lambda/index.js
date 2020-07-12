import { apiGatewayLambda } from "../../lib/lambda/api-gateway";

export const handler = apiGatewayLambda(async (event) => {
  return jsonSuccess({ key: "value" });
});
