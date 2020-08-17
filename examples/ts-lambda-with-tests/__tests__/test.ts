import { call, handler } from "../index";
import { documentClient, tableConfigs } from "../documentClient";
import { ApiGatewayLocalClient } from "../../../lib/providers/index";

describe("should bruh", () => {
  it("should bruh", async () => {
    const api = new ApiGatewayLocalClient({
      "/test-fn": {
        fn: handler,
        method: "post",
      },
    });
    api.init(3002);
    const email = "test@gmail.com";
    const response = await call({
      email,
    });
    expect(response.payload).toStrictEqual({
      PRIMARYHK: email,
      STATUS: true,
    });
    const ddbresponse = await documentClient
      .get({
        Key: {
          PRIMARYHK: email,
        },
        TableName: tableConfigs.MyTable.TableName,
      })
      .promise();
    if (ddbresponse) {
      expect(ddbresponse.Item).toStrictEqual({
        PRIMARYHK: email,
        STATUS: true,
      });
    }
    api.server?.close();
  });
});
