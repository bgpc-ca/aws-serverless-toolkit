import { apiGatewayLambda } from "../lib/lambda";

describe("sample test", () => {
  it("should work well", () => {
    expect(apiGatewayLambda).toBeTruthy();
  });
});
