import { v4 as uuidv4 } from "uuid";
export type SendEmailParams = {
  Destination: {
    /* required */
    BccAddresses?: string[];
    CcAddresses?: string[];
    ToAddresses: string[];
  };
  Message: {
    /* required */
    Body: {
      /* required */
      Html: {
        Data: string /* required */;
      };
      Text: {
        Data: string /* required */;
      };
    };
    Subject: {
      /* required */ Data: string /* required */;
    };
  };
  Source: string /* required */;
  ConfigurationSetName?: string;
  ReplyToAddresses?: string[];
  ReturnPath?: string;
  ReturnPathArn?: string;
  SourceArn?: string;
  Tags?: { Name: string; Value: string }[];
};
export class SESLocalClient {
  constructor() {
    this.sentEmails = {};
  }
  sentEmails: { [key: string]: SendEmailParams };
  async sendEmail(params: SendEmailParams): Promise<string> {
    const messageId = uuidv4();
    this.sentEmails[messageId] = params;
    return messageId;
  }
  getEmail(messageId: string): SendEmailParams {
    return this.sentEmails[messageId];
  }
}
