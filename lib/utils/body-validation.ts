import { Tested } from "../types/helpers";
import { BadRequestError, BusinessErrorData } from "../types/errors";

export type RequireOnePropertyPassesErrorData<T> = BusinessErrorData & {
  object: T;
};
export function requireOnePropertyPasses<T>(object: T, tests: Tested<T>): void {
  for (const key in object) if (tests[key].test(object[key])) return;
  throw new BadRequestError<RequireOnePropertyPassesErrorData<T>>({ object, code: "NO_PROPERTIES_PASS" });
}

export type RequireOnePropertyPassesInPartialErrorData<T> = BusinessErrorData & {
  object: T;
};
export function requireOnePropertyPassesInPartial<T>(object: Partial<T>, tests: Tested<T>): void {
  for (const key in object) if (tests[key].test(object[key] as T[Extract<keyof T, string>])) return;
  throw new BadRequestError<RequireOnePropertyPassesInPartialErrorData<Partial<T>>>({
    code: "NO_PROPERTIES_PASS",
    object,
  });
}

export type RequireAllPropertiesPassThrowAtFirstErrorData<T> = BusinessErrorData & {
  object: T;
  FAILED: keyof T;
};
export function requireAllPropertiesPassThrowAtFirstFail<T>(object: T, tests: Tested<T>): void {
  for (const key in object)
    if (!tests[key].test(object[key]))
      throw new BadRequestError<RequireAllPropertiesPassThrowAtFirstErrorData<T>>({
        code: "PROPERTY_FAILS",
        object,
        FAILED: key,
      });
}

export type RequireAllPropertiesPassGetAllFailsErrorData<T> = BusinessErrorData & {
  object: T;
  FAILED: (keyof T)[];
};
export function requireAllPropertiesPassGetAllFails<T>(object: T, tests: Tested<T>): void {
  const fails: (keyof T)[] = [];
  for (const key in object) if (!tests[key].test(object[key])) fails.push(key);
  if (fails.length)
    throw new BadRequestError<RequireAllPropertiesPassGetAllFailsErrorData<T>>({
      code: "PROPERTIES_FAIL",
      object,
      FAILED: fails,
    });
}
