import {
  requireAllPropertiesPassGetAllFails,
  requireAllPropertiesPassThrowAtFirstFail,
  RequireAllPropertiesPassGetAllFailsErrorData,
  Tested,
  // BusinessError,
  BadRequestError,
  RequireAllPropertiesPassThrowAtFirstErrorData,
} from "../../../lib";

type Complex = {
  type: "object";
  nested: number[];
};
type TestRequestBody = {
  key: string;
  complex: Complex;
};

const badIncomingBody: TestRequestBody = {
  key: "doesn't matter",
  complex: {
    type: "object",
    nested: [1, 2, 3],
  },
};

const badTested: Tested<TestRequestBody> = {
  key: /bad/,
  complex: {
    test(val: Complex): boolean {
      return val.nested.length < 3 && val.type === "object";
    },
  },
};

const goodIncomingBody: TestRequestBody = {
  key: "good",
  complex: {
    type: "object",
    nested: [1, 2, 3],
  },
};

const goodTested: Tested<TestRequestBody> = {
  key: /good/,
  complex: {
    test(val: Complex): boolean {
      return val.nested.length === 3 && val.type === "object";
    },
  },
};

describe("requireAllPropertiesPassGetAllFails", () => {
  it("should throw given a failing test", () => {
    try {
      requireAllPropertiesPassGetAllFails<TestRequestBody>(badIncomingBody, badTested);
    } catch (e) {
      const error = e as BadRequestError<RequireAllPropertiesPassGetAllFailsErrorData<TestRequestBody>>;
      expect("business" in error).toBe(true);
      expect(error.errorData?.code).toBe("PROPERTIES_FAIL");
      expect(error.errorData?.FAILED).toContain("key");
      expect(error.errorData?.FAILED).toContain("complex");
      expect(error.errorData?.object).toMatchObject(badIncomingBody);
    }
  });

  it("should pass given valid properties", () => {
    expect(() => requireAllPropertiesPassGetAllFails<TestRequestBody>(goodIncomingBody, goodTested)).not.toThrow();
  });
});

describe("requireAllPropertiesPassThrowAtFirstFail", () => {
  it("should throw given a failing test", () => {
    try {
      requireAllPropertiesPassThrowAtFirstFail<TestRequestBody>(badIncomingBody, badTested);
    } catch (e) {
      const error = e as BadRequestError<RequireAllPropertiesPassThrowAtFirstErrorData<TestRequestBody>>;
      expect("business" in error).toBe(true);
      expect(error.errorData?.code).toBe("PROPERTY_FAILS");
      expect(["key", "complex"].includes(error.errorData?.FAILED || "")).toBe(true);
      expect(error.errorData?.object).toMatchObject(badIncomingBody);
    }
  });

  it("should pass given valid properties", () => {
    expect(() => requireAllPropertiesPassThrowAtFirstFail<TestRequestBody>(goodIncomingBody, goodTested)).not.toThrow();
  });
});
