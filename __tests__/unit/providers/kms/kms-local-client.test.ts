import { KMSLocalClient } from "../../../../lib/providers/kms";
describe("KMSLocalClient tests", () => {
  it("should work", async () => {
    const aliases = ["test"];
    const kms = new KMSLocalClient(aliases);
    const result = await kms.encrypt({ KeyId: "test", Plaintext: "test" }).promise();
    // expect(result.CiphertextBlob).toBeInstanceOf(String);
    if (typeof result.CiphertextBlob !== "string") throw new Error();
    const decrypted = await kms.decrypt({ CiphertextBlob: result.CiphertextBlob, KeyId: "test" }).promise();
    expect(decrypted.Plaintext).toBe("test");
  });
});
