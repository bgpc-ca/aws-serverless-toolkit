import { AWSError, Request, DynamoDB } from "aws-sdk";

type TableConfigs = { [key: string]: CfDynamoDBTable };

type CfDynamoDBTable = {
  AttributeDefinitions: DynamoDB.AttributeDefinition[];
  KeySchema: DynamoDB.KeySchema;
  TableName: string;
  BillingMode?: string;
  GlobalSecondaryIndexes?: DynamoDB.GlobalSecondaryIndex[];
  LocalSecondaryIndexes?: DynamoDB.LocalSecondaryIndex[];
  PointInTimeRecoverySpecification?: DynamoDB.PointInTimeRecoverySpecification;
  ProvisionedThroughput?: DynamoDB.ProvisionedThroughput;
  SSESpecification?: DynamoDB.SSESpecification;
  StreamSpecification?: DynamoDB.StreamSpecification;
  Tags?: DynamoDB.Tag[];
  TimeToLiveSpecification?: DynamoDB.TimeToLiveSpecification;
};

type LocalDocumentClientParams = {
  endpoint?: string;
  region?: string;
  tableConfigs: TableConfigs;
};

export class LocalDocumentClient {
  private tableConfigs: TableConfigs;
  private dynamoDb: DynamoDB;
  private documentClient: DynamoDB.DocumentClient;

  constructor({ endpoint = "http://localhost:8000", region = "local", tableConfigs }: LocalDocumentClientParams) {
    this.tableConfigs = tableConfigs;
    this.dynamoDb = new DynamoDB({ endpoint, region });
    this.documentClient = new DynamoDB.DocumentClient({ endpoint, region });
  }

  tables: { [key: string]: boolean | undefined } = {};

  batchGet(
    params: DynamoDB.DocumentClient.BatchGetItemInput,
  ): Partial<Request<DynamoDB.DocumentClient.BatchGetItemOutput, AWSError>> {
    return {
      promise: async () => {
        await this.createMultipleTables(Object.keys(params.RequestItems));
        return this.documentClient.batchGet(params).promise();
      },
    };
  }

  put(params: DynamoDB.DocumentClient.PutItemInput): Partial<Request<DynamoDB.DocumentClient.PutItemOutput, AWSError>> {
    return {
      promise: async () => {
        await this.createTable(params.TableName);
        return this.documentClient.put(params).promise();
      },
    };
  }

  get(params: DynamoDB.DocumentClient.GetItemInput): Partial<Request<DynamoDB.DocumentClient.GetItemOutput, AWSError>> {
    return {
      promise: async () => {
        await this.createTable(params.TableName);
        return this.documentClient.get(params).promise();
      },
    };
  }

  query(params: DynamoDB.DocumentClient.QueryInput): Partial<Request<DynamoDB.DocumentClient.QueryOutput, AWSError>> {
    return {
      promise: async () => {
        await this.createTable(params.TableName);
        return this.documentClient.query(params).promise();
      },
    };
  }

  update(
    params: DynamoDB.DocumentClient.UpdateItemInput,
  ): Partial<Request<DynamoDB.DocumentClient.UpdateItemOutput, AWSError>> {
    return {
      promise: async () => {
        await this.createTable(params.TableName);
        return this.documentClient.update(params).promise();
      },
    };
  }

  async createMultipleTables(tableNames: string[]): Promise<void> {
    await Promise.all(tableNames.map((tableName) => this.createTable(tableName)));
  }

  async createTable(tableName: string): Promise<void> {
    type UnwantedKey = "TimeToLiveSpecification";

    if (this.tables[tableName]) return;

    const canonicalName = tableName.split("-")[0];

    const config = this.tableConfigs[canonicalName];

    const notSupportedKeys: UnwantedKey[] = ["TimeToLiveSpecification"];

    for (const notSupportedKey of notSupportedKeys) {
      if (notSupportedKey in config) delete config[notSupportedKey];
    }

    await this.dynamoDb
      .createTable(config)
      .promise()
      .catch((e) => {
        console.log(e);
      });

    this.tables[tableName] = true;
  }
}
