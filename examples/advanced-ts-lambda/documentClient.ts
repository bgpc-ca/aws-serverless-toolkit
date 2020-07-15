import { DynamoDB } from "aws-sdk";
import { LocalDocumentClient, MockDocumentClient, TableConfigs } from "../../lib";

const tableConfigs: TableConfigs = {
  MyTable: {
    AttributeDefinitions: [
      {
        AttributeName: "PRIMARYHK",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "PRIMARYHK",
        KeyType: "HASH",
      },
    ],
    TableName: "MyTable-123",
  },
};

export const documentClient =
  process.env.NODE_ENV === "production"
    ? new DynamoDB.DocumentClient()
    : process.env.NODE_ENV === "test" && process.env.TEST_SUITE === "unit"
    ? new MockDocumentClient()
    : new LocalDocumentClient({ tableConfigs });
