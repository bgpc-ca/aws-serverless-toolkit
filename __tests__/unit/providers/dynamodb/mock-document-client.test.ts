import { MockDocumentClient } from "../../../../lib/providers";
import { DynamoDB } from "aws-sdk";
describe("MockDocumentClient", () => {
  const mockDocumentClient = new MockDocumentClient();

  it("should implement all DynamoDB.DocumentClient functions", async () => {
    type RealDocumentClientCall = keyof DynamoDB.DocumentClient;

    const calls: RealDocumentClientCall[] = [
      "createSet",
      "batchGet",
      "batchWrite",
      "delete",
      "get",
      "put",
      "query",
      "scan",
      "update",
      "transactGet",
      "transactWrite",
    ];

    await Promise.all(
      calls.map(async (call) => {
        expect(await mockDocumentClient[call]().promise()).toBe(undefined);
      }),
    );
  });
});
