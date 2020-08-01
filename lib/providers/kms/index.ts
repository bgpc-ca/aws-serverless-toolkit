import { KMS, AWSError } from "aws-sdk";
import crypto from "crypto";
export class KMSLocalClient {
  /**
   * @description Every alias is used as the key to encrypt or decrypt
   * We don't support multiple aliases for a single key
   * @param aliases
   */
  constructor(public aliases: string[]) {}
  encrypt(params: KMS.EncryptRequest): { promise: () => Promise<KMS.EncryptResponse> } {
    return {
      promise: async (): Promise<KMS.EncryptResponse> => {
        const { KeyId, Plaintext } = params;
        if (this.aliases.indexOf(KeyId) === -1) {
          const error = new AWSError(`Invalid keyId ${KeyId}`);
          error.code = "NotFoundException";
          error.statusCode = 404;
          throw error;
        }
        const cipher = crypto.createCipher("aes-128-cbc", KeyId);
        let encrypted = cipher.update(Plaintext.toString("utf8"), "utf8", "hex");
        encrypted += cipher.final("hex");

        return {
          CiphertextBlob: encrypted,
        };
      },
    };
  }
  decrypt(params: KMS.DecryptRequest): { promise: () => Promise<KMS.DecryptResponse> } {
    return {
      promise: async (): Promise<KMS.DecryptResponse> => {
        const { KeyId, CiphertextBlob } = params;
        if (!KeyId || this.aliases.indexOf(KeyId) === -1) {
          const error = new AWSError(`Invalid keyId ${KeyId}`);
          error.code = "NotFoundException";
          error.statusCode = 404;
          throw error;
        }
        const decipher = crypto.createDecipher("aes-128-cbc", KeyId);
        let decrypted = decipher.update(CiphertextBlob.toString("hex"), "hex", "utf8");
        decrypted += decipher.final("utf8");

        return {
          Plaintext: decrypted,
        };
      },
    };
  }
}
