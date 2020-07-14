import { LocalDocumentClient, TableConfigs } from "../../../../lib";

describe("LocalDocumentClient", () => {
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
      TableName: "MyTable-123123",
      BillingMode: "PAY_PER_REQUEST",
      // TimeToLiveSpecification is not supported when creating a table with the JS sdk
      TimeToLiveSpecification: {
        AttributeName: "EXPIRESAT",
        Enabled: true,
      },
    },
  };

  const localDocumentClient = new LocalDocumentClient({
    tableConfigs,
  });

  it("should exist", () => {
    expect(LocalDocumentClient).toBeTruthy();
  });

  it("should take in a config with an unsupported property", async () => {
    expect.assertions(1);

    try {
      const response = await localDocumentClient
        .put({
          Item: {
            PRIMARYHK: "test",
            myKey: "value",
          },
          TableName: tableConfigs.MyTable.TableName,
        })
        .promise();

      expect(response.$response.httpResponse.statusCode).toBe(200);
    } catch (e) {}
  });

  it("should be able to retrieve a put item", async () => {
    const response = await localDocumentClient
      .get({
        Key: {
          PRIMARYHK: "test",
        },
        TableName: tableConfigs.MyTable.TableName,
      })
      .promise();

    expect(response.Item?.myKey).toBe("value");
  });

  // If we pass in the same prefix as TableName, the same config is used. But a different table is used.
  it("should not clash if similar TableName is provided, but still work", async () => {
    const similarTableName = tableConfigs.MyTable.TableName + "123";

    await localDocumentClient
      .put({
        Item: {
          PRIMARYHK: "test",
          myKey: "value2",
        },
        TableName: similarTableName,
      })
      .promise();

    const response = await localDocumentClient
      .get({
        Key: {
          PRIMARYHK: "test",
        },
        TableName: similarTableName,
      })
      .promise();

    expect(response.Item?.myKey).toBe("value2");
  });

  it("should support queries", async () => {
    const response = await localDocumentClient
      .query({
        KeyConditionExpression: "PRIMARYHK = :PRIMARYHK",
        ExpressionAttributeValues: {
          ":PRIMARYHK": "test",
        },
        TableName: tableConfigs.MyTable.TableName,
      })
      .promise();

    expect(response.Items?.[0].myKey).toBe("value");
  });

  it("should support updates", async () => {
    await localDocumentClient
      .update({
        Key: {
          PRIMARYHK: "test",
        },
        UpdateExpression: "SET myKey = :myVal",
        ExpressionAttributeValues: {
          ":myVal": "other",
        },
        TableName: tableConfigs.MyTable.TableName,
      })
      .promise();

    const response = await localDocumentClient
      .get({
        TableName: tableConfigs.MyTable.TableName,
        Key: {
          PRIMARYHK: "test",
        },
      })
      .promise();

    expect(response.Item?.myKey).toBe("other");
  });
});
