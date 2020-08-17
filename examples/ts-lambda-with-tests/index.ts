import {
  given,
  Given,
  apiGatewayLambda,
  ApiGatewayEvent,
  ApiGatewayResponse,
  decodeBody,
  Tested,
  success,
  makePost,
  ApiGatewayBusinessResponseBody,
} from "../../lib";
import { documentClient, tableConfigs } from "./documentClient";

const baseUrl = "http://localhost:3002";
export const call = makePost<RequestBody, ResponsePayload>(`${baseUrl}/test-fn`);

export type RequestBody = {
  email: string;
};

export const tested: Tested<RequestBody> = {
  email: {
    test: (value?: string): boolean => {
      if (value !== undefined) return value.length > 10;
      return false;
    },
  },
};

export type SuccessfulResponsePayload = {
  PRIMARYHK: string;
  STATUS: boolean;
};

export type PossibleErrorPayloads = Given<RequestBody>;

export type ResponsePayload = ApiGatewayBusinessResponseBody<SuccessfulResponsePayload, PossibleErrorPayloads>;

export async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
  const body = decodeBody<RequestBody>(event.body);
  if (given<RequestBody>(body, tested)) {
    const { email } = body;
    await documentClient
      .put({
        Item: {
          PRIMARYHK: email,
          STATUS: true,
        },
        TableName: tableConfigs.MyTable.TableName,
      })
      .promise();
    return success<SuccessfulResponsePayload>({
      PRIMARYHK: email,
      STATUS: true,
    });
  }
}

export const handler = apiGatewayLambda(main);
