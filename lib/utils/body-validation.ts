import { Tested } from "../types/helpers";
import { BadRequestError, BusinessErrorData } from "../types/errors";

export type RequireOnePropertyPassesErrorData<T> = BusinessErrorData & {
  object: T;
};
export function requireOnePropertyPasses<T>(object: T, tests: Tested<T>): void {
  for (const key in tests) if (tests[key].test(object[key])) return;
  throw new BadRequestError<RequireOnePropertyPassesErrorData<T>>({ object, code: "NO_PROPERTIES_PASS" });
}

export type RequireOnePropertyPassesInPartialErrorData<T> = BusinessErrorData & {
  object: T;
};
export function requireOnePropertyPassesInPartial<T>(object: Partial<T>, tests: Tested<T>): void {
  for (const key in tests) if (tests[key].test(object[key] as T[Extract<keyof T, string>])) return;
  throw new BadRequestError<RequireOnePropertyPassesInPartialErrorData<Partial<T>>>({
    code: "NO_PROPERTIES_PASS",
    object,
  });
}

export type RequireAllPropertiesPassThrowAtFirstErrorData<T> = BusinessErrorData & {
  object: Partial<T>;
  FAILED: keyof T;
};
export function requireAllPropertiesPassThrowAtFirstFail<T>(object: Partial<T>, tests: Tested<T>): object is T {
  for (const key in tests) {
    try {
      const valid = !!object[key] && tests[key].test(object[key] as T[Extract<keyof T, string>]);
      if (!valid)
        throw new BadRequestError<RequireAllPropertiesPassThrowAtFirstErrorData<T>>({
          code: "PROPERTY_FAILS",
          object,
          FAILED: key,
        });
    } catch (e) {
      throw new BadRequestError<RequireAllPropertiesPassThrowAtFirstErrorData<T>>({
        code: "PROPERTY_FAILS",
        object,
        FAILED: key,
      });
    }
  }
  return true;
}

export type RequireAllPropertiesPassGetAllFailsErrorData<T> = BusinessErrorData & {
  object: T;
  FAILED: (keyof T)[];
};
export function requireAllPropertiesPassGetAllFails<T>(object: T, tests: Tested<T>): void {
  const fails: (keyof T)[] = [];
  for (const key in tests) {
    try {
      const valid = tests[key]?.test(object[key]);
      if (!valid) fails.push(key);
    } catch (e) {
      fails.push(key);
    }
  }
  if (fails.length)
    throw new BadRequestError<RequireAllPropertiesPassGetAllFailsErrorData<T>>({
      code: "PROPERTIES_FAIL",
      object,
      FAILED: fails,
    });
}
