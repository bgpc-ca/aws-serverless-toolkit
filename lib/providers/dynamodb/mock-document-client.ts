import {
  BatchGetItemInput,
  BatchWriteItemInput,
  DocumentClient,
  GetItemInput,
  PutItemInput,
  DeleteItemInput,
  QueryInput,
  ScanInput,
  TransactGetItemsInput,
  TransactWriteItemsInput,
  UpdateItemInput,
} from "aws-sdk/clients/dynamodb";

/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockDocumentClient {
  batchGet(_?: BatchGetItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  batchWrite(_?: BatchWriteItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  createSet(
    _?: number[] | string[] | DocumentClient.binaryType[],
    _2?: DocumentClient.CreateSetOptions | undefined,
  ): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  get(_?: GetItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  put(_?: PutItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  delete(_?: DeleteItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  query(_?: QueryInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  scan(_?: ScanInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  transactGet(_?: TransactGetItemsInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  transactWrite(_?: TransactWriteItemsInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  update(_?: UpdateItemInput): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
}
export const mockDocumentClient = {};

/* eslint-enable @typescript-eslint/no-unused-vars */
