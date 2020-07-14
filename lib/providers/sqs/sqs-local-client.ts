/**
 * Map of queue names to Lambda handlers which take an SQS event as its parameter
 */
type FunctionMapType = {
  [key: string]: (a: EventType) => Promise<void>;
};

type EventType = {
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

const newQueue = (): Queue => ({
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
    // eslint-disable-next-line
    for await (const _ of this);
  },
});

export class SqsLocalClient {
  queues: { [key: string]: Queue };
  /**
   * Send message to SQS queue to invoke Lambda handler.
   * @param params Standard SQS.sendMessage() parameters, only supports QueueUrl and MessageBody.
   */
  async sendMessage(params: SendMessageParams): Promise<void> {
    const QueueUrlArray = params.QueueUrl.split("/");
    const fn = QueueUrlArray[QueueUrlArray.length - 1] as string;
    const event: EventType = JSON.parse(params.MessageBody);
    if (!event) throw new Error();
    if (!this.queues[fn]) {
      this.queues[fn] = newQueue();
      this.queues[fn].runner();
    }

    this.queues[fn].calls.push(() => this.functionMap[fn](event));
  }
  /**
   * Instantiate a local sqs provider to lock calls to sendMessage in a local environment.
   * @param functionMap Map of queue name to function which is invoked on message.
   */
  constructor(public functionMap: FunctionMapType) {
    this.queues = <{ [key: string]: Queue }>{};
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
