import { Tested } from "../types/helpers";
import { BadRequestError } from "../types/errors";

export function requireOnePropertyPasses<T>(object: T, tests: Tested<T>): void {
  for (const key in object) if (tests[key].test(object[key])) return;
  throw new BadRequestError("NO_PROPERTIES_PASS");
}

export function requireOnePropertyPassesInPartial<T>(object: Partial<T>, tests: Tested<T>): void {
  for (const key in object) if (tests[key].test(object[key] as T[Extract<keyof T, string>])) return;
  throw new BadRequestError("NO_PROPERTIES_PASS");
}
