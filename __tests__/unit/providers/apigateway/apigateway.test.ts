import { ApiGatewayLocalClient, FunctionMapType } from "../../../../lib/providers/apigateway/index";
import { ApiGatewayEvent, ApiGatewayResponse } from "../../../../lib/types/aws/api-gateway";
import axios from "axios";

describe("sample test", () => {
  it("should exist", () => {
    expect(ApiGatewayLocalClient).toBeTruthy();
  });
  it("should work", async () => {
    const testFn = async (event: ApiGatewayEvent): Promise<ApiGatewayResponse> => {
      expect(event.body).toBe(null);
      const response: ApiGatewayResponse = {
        body: JSON.stringify({
          bruh: "bruh",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
      };
      return response;
    };
    const fnMap: FunctionMapType = {
      "/home": {
        method: "get",
        fn: testFn,
      },
    };
    const api = new ApiGatewayLocalClient(fnMap);
    api.init(8080);
    const response = await axios.get("http://localhost:8080/home");
    expect(response.data?.bruh).toBe("bruh");
    expect(response.status).toBe(200);
    api.server?.close();
  });
});
