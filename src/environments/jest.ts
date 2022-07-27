import { TestAfterHooks, TestEnvironmentGetter } from "./testEnvironmentTypes";

declare const afterEach: (callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const jest: unknown;

export const getJestEnvironment: TestEnvironmentGetter = () => {
  if (
    typeof afterEach === "undefined" ||
    typeof beforeEach === "undefined" ||
    typeof jest === "undefined"
  ) {
    return undefined;
  }
  let afterEachCallback = () => {};
  let beforeEachCallback = () => {};

  afterEach(() => {
    afterEachCallback();
  });

  beforeEach(() => {
    beforeEachCallback();
  });

  return {
    after(callback: (afterHooks: TestAfterHooks) => void) {
      afterEachCallback = () => callback({
        reportComplaint({ error }) {
          throw error;
        },
      });
    },
    before: (callback: () => void) => {
      beforeEachCallback = callback
    },
    filterMethodCalls: ({ methodCalls }) => methodCalls,
  };
};
