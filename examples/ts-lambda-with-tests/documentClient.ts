import { DynamoDB } from "aws-sdk";
import { LocalDocumentClient, MockDocumentClient, TableConfigs } from "../../lib/providers";

export const tableConfigs: TableConfigs = {
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
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
};

export const documentClient =
  process.env.NODE_ENV === "production"
    ? new DynamoDB.DocumentClient()
    : process.env.NODE_ENV === "test" && process.env.TEST_SUITE === "unit"
    ? new MockDocumentClient()
    : new LocalDocumentClient({ tableConfigs });
