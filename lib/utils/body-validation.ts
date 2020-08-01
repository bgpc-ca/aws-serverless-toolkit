import { Tested } from "../types/helpers";
import { BadRequestError, BusinessErrorData } from "../types/errors";

export type RequireAllPropertiesPassThrowAtFirstErrorData<T> = BusinessErrorData & {
  object: Partial<T>;
  FAILED: keyof T;
};
export function requireAllPropertiesPassThrowAtFirstFail<T>(object: Partial<T>, tests: Tested<T>): object is T {
  for (const key in tests) {
    try {
      const valid = object[key] !== undefined && tests[key].test(object[key] as T[Extract<keyof T, string>]);
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
  object: Partial<T>;
  FAILED: (keyof T)[];
};
export function requireAllPropertiesPassGetAllFails<T>(object: Partial<T>, tests: Tested<T>): object is T {
  const fails: (keyof T)[] = [];
  for (const key in tests) {
    try {
      const valid = object[key] !== undefined && tests[key].test(object[key] as T[Extract<keyof T, string>]);
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

  return true;
}
