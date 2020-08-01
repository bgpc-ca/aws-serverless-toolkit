import { BadRequestError } from "../types/errors";

export type DecodeBodyErrorData = { code: "BAD_BODY" };

/**
 * Decode JSON string body into an object of a given type
 * @throws {BadRequestError("BAD_BODY")}
 * @param body - Event body string which should JSON.parse into <B>
 */
export function decodeBody<B>(body: string | null): Partial<B> {
  try {
    if (!body) throw new Error();
    return JSON.parse(body);
  } catch (e) {
    throw new BadRequestError({ code: "BAD_BODY" });
  }
}
