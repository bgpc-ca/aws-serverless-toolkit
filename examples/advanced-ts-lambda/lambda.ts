import { v4 as uuidv4 } from "uuid";
import {
  apiGatewayLambda,
  ApiGatewayEvent,
  ApiGatewayResponse,
  ApiGatewayBusinessResponseBody,
  Tested,
} from "../../lib";
import {
  RequireAllPropertiesPassThrowAtFirstErrorData,
  requireAllPropertiesPassThrowAtFirstFail,
} from "../../lib/utils/body-validation";
import { decodeBody } from "../../lib/utils/decode-body";
import { documentClient } from "./documentClient";
import { success } from "../../lib/utils/success";

export type MyLambdaResponseSuccessBody = {
  id: string;
};
export type MyLambdaRequestBody = {
  content: string;
  author: string;
};

export type MyLambdaPossibleErrorData = RequireAllPropertiesPassThrowAtFirstErrorData<MyLambdaRequestBody>;

/**
 * This type is imported by the frontend and passed to Axios.post<T>
 */
export type MyLambdaResponseBody = ApiGatewayBusinessResponseBody<
  MyLambdaResponseSuccessBody,
  MyLambdaPossibleErrorData
>;

const tested: Tested<MyLambdaRequestBody> = {
  author: /\w*/,
  content: {
    test(value: string): boolean {
      return value.length > 10 && value.length < 500;
    },
  },
};

/**
 * Write todo to ddb and return generated id.
 * @param event
 * @throws {BadRequestError<RequireAllPropertiesPassThrowAtFirstErrorData<MyLambdaRequestBody>>}
 */
export async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse | never> {
  const body = decodeBody<MyLambdaRequestBody>(event.body);
  // below guarantees body is not a partial anymore
  requireAllPropertiesPassThrowAtFirstFail<MyLambdaRequestBody>(body, tested);
  const { content, author } = body as MyLambdaRequestBody;
  const id = await saveTodoToTable({ content, author });
  return success<MyLambdaResponseSuccessBody>({ id });
}

export type PSaveTodoToTable = {
  content: string;
  author: string;
};
export async function saveTodoToTable({ content, author }: PSaveTodoToTable): Promise<string> {
  const id = uuidv4();

  await documentClient
    .put({
      TableName:
        process.env.NODE_ENV === "production"
          ? "MyTable-Prod"
          : process.env.NODE_ENV === "development"
          ? "MyTable-Dev"
          : "MyTable-Test",
      Item: {
        id,
        content,
        author,
      },
    })
    .promise();

  return id;
}

export default apiGatewayLambda(main);
