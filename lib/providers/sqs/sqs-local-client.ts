import { v4 as uuidv4 } from "uuid";

/**
 * Map of queue names to Lambda handlers which take an SQS event as its parameter
 */
type FunctionMapType = {
  [key: string]: (a: EventType) => Promise<void>;
};

export type EventType = {
  Records: SqsMessage[];
};

type Call = () => Promise<void>;

type Queue = {
  calls: Call[];
  [Symbol.asyncIterator]: () => AsyncGenerator<void, void, unknown>;
  continueRunning: boolean;
  stop: () => void;
  runner: () => Promise<void>;
};

const delay = () => new Promise<null>((resolve) => setTimeout(() => resolve(), 1));

type SendMessageParams = {
  MessageBody: string;
  QueueUrl: string;
};

type SqsMessage = {
  messageId: string;
  receiptHandle: string;
  body: string;
  attributes: {
    ApproximateReceiveCount: string;
    SentTimestamp: string;
    SenderId: string;
    ApproximateFirstReceiveTimestamp: string;
  };
  messageAttributes: {
    [key: string]: string;
  };
  md5OfBody: string;
  eventSource: string;
  eventSourceARN: string;
  awsRegion: string;
};

const newQueue = (): Queue => {
  return {
    calls: [],
    continueRunning: true,
    async *[Symbol.asyncIterator]() {
      while (this.continueRunning) {
        const call = this.calls.shift();
        if (call) {
          yield await call();
        } else {
          await delay();
        }
      }
      return;
    },
    stop(): void {
      this.continueRunning = false;
    },
    async runner(): Promise<void> {
      //eslint-disable-next-line
      for await (const _ of this);
    },
  };
};
export class SqsLocalClient {
  queues: { [key: string]: Queue };
  functionMap: FunctionMapType;
  /**
   * Instantiate a local sqs provider to lock calls to sendMessage in a local environment.
   * @param functionMap Map of queue name to function which is invoked on message.
   */
  constructor(functionMap: FunctionMapType) {
    this.queues = <{ [key: string]: Queue }>{};
    this.functionMap = functionMap;
  }
  /**
   * Send message to SQS queue to invoke Lambda handler.
   * @param params Standard SQS.sendMessage() parameters, only supports QueueUrl and MessageBody.
   */
  sendMessage(params: SendMessageParams): { promise: () => void } {
    return {
      promise: async () => {
        const QueueUrlArray = params.QueueUrl.split("/");
        const fn = QueueUrlArray[QueueUrlArray.length - 1] as string;
        const event: EventType = {
          Records: [
            {
              messageId: uuidv4(),
              receiptHandle: uuidv4(),
              body: params.MessageBody,
              attributes: {
                ApproximateReceiveCount: uuidv4(),
                SentTimestamp: (Date.now() + 10).toString(),
                SenderId: uuidv4(),
                ApproximateFirstReceiveTimestamp: Date.now().toString(),
              },
              messageAttributes: {},
              md5OfBody: uuidv4(),
              eventSource: uuidv4(),
              eventSourceARN: uuidv4(),
              awsRegion: "test",
            },
          ],
        };
        if (!this.queues[fn]) {
          this.queues[fn] = newQueue();
          this.queues[fn].runner();
        }
        this.queues[fn].calls.push(() => this.functionMap[fn](event));
      },
    };
  }
  /**
   * Stop all queue runners.
   * @description Use this in your test teardown phase
   */
  stopAllQueues(): void {
    for (const queue in this.queues) {
      this.queues[queue].stop();
    }
  }
}
