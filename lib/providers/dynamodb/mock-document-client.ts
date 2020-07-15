import { DynamoDB } from "aws-sdk";

/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockDocumentClient {
  batchGet(_?: DynamoDB.DocumentClient.BatchGetItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  batchWrite(_?: DynamoDB.DocumentClient.BatchWriteItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  createSet(
    _?: number[] | string[] | DynamoDB.DocumentClient.binaryType[],
    _2?: DynamoDB.DocumentClient.CreateSetOptions | undefined,
  ): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  get(_?: DynamoDB.DocumentClient.GetItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  put(_?: DynamoDB.DocumentClient.PutItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  delete(_?: DynamoDB.DocumentClient.DeleteItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  query(_?: DynamoDB.DocumentClient.QueryInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  scan(_?: DynamoDB.DocumentClient.ScanInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  transactGet(_?: DynamoDB.DocumentClient.TransactGetItemsInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  transactWrite(_?: DynamoDB.DocumentClient.TransactWriteItemsInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  update(_?: DynamoDB.DocumentClient.UpdateItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
}
export const mockDocumentClient = {};

/* eslint-enable @typescript-eslint/no-unused-vars */
