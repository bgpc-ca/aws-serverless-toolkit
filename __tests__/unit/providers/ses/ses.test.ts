import { SESLocalClient, SendEmailParams } from "../../../../lib/providers/ses";

describe("sample test", () => {
  it("should exist", () => {
    expect(SESLocalClient).toBeTruthy();
  });
  it("should work", async () => {
    const ses = new SESLocalClient();
    const params: SendEmailParams = {
      Destination: {
        ToAddresses: ["test@gmail.com"],
      },
      Message: {
        Body: {
          Html: { Data: "<p>test</p>" },
          Text: {
            Data: "test",
          },
        },
        Subject: {
          Data: "Subject",
        },
      },
      Source: "source@gmail.com",
    };
    const emailId = await ses.sendEmail(params);
    const result = ses.getEmail(emailId);
    expect(result).toMatchObject(params);
  });
});
