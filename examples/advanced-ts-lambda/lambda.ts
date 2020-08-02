import { v4 as uuidv4 } from "uuid";
import {
  apiGatewayLambda,
  ApiGatewayEvent,
  ApiGatewayResponse,
  ApiGatewayBusinessResponseBody,
  Tested,
} from "../../lib";
import { Given, given } from "../../lib/utils/body-validation";
import { decodeBody } from "../../lib/utils/decode-body";
import { documentClient } from "./documentClient";
import { success } from "../../lib/utils/success";

/**
 * What a successful payload contains
 */
export type MyLambdaResponseSuccessPayload = {
  id: string;
};

/**
 * Imported by the frontend and used to type the second argument of Axios.post<any>
 */
export type MyLambdaRequestBody = {
  content: string;
  author: string;
};

/**
 * Use union type to encode possible business failure types (|)
 */
export type MyLambdaPossibleErrorData = Given<MyLambdaRequestBody>;

/**
 * This type is imported by the frontend and passed to Axios.post<T>
 */
export type MyLambdaResponseBody = ApiGatewayBusinessResponseBody<
  MyLambdaResponseSuccessPayload,
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
 * @throws {BadRequestError<Given<MyLambdaRequestBody>>}
 * @throws {... other possible errors}
 */
export async function main(event: ApiGatewayEvent): Promise<ApiGatewayResponse | void> {
  const body = decodeBody<MyLambdaRequestBody>(event.body);
  if (given<MyLambdaRequestBody>(body, tested)) {
    const { content, author } = body;
    const id = await saveTodoToTable({ content, author });
    return success<MyLambdaResponseSuccessPayload>({ id });
  }
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
