import { SqsLocalClient, EventType } from "../../../../lib/providers/sqs";

const delay = () => new Promise<null>((resolve) => setTimeout(() => resolve(), 2000));

describe("sample test", () => {
  it("should exist", () => {
    expect(SqsLocalClient).toBeTruthy();
  });
  it("should work", async () => {
    const testPayload = JSON.stringify({ test: "test" });
    const testFn = async (a: EventType): Promise<void> => {
      expect(a.Records[0].body).toBe(testPayload);
    };
    const testFnMock = jest.fn(testFn);
    const fnMap = {
      testQueue: testFnMock,
    };
    const sqs = new SqsLocalClient(fnMap);
    const params = {
      QueueUrl: "https://bruh/testQueue",
      MessageBody: testPayload,
    };
    await sqs.sendMessage(params).promise();
    await delay();
    sqs.queues["testQueue"].stop();
    expect(testFnMock).toHaveBeenCalledTimes(1);
  });
});
