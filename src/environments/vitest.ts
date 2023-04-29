import { TestFrameworkSelector } from "./testEnvironmentTypes";

declare interface VitestModule {
  afterEach: (callback: () => void) => void;
  beforeEach: (callback: () => void) => void;
}

declare const __vitest_index__: VitestModule | undefined;

export const selectVitestEnvironment: TestFrameworkSelector = () => {
  if (typeof __vitest_index__ === "undefined") {
    return undefined;
  }

  const vitest = __vitest_index__;

  let afterEachCallback: (() => void) | undefined;
  let beforeEachCallback: (() => void) | undefined;

  vitest.afterEach(() => {
    afterEachCallback?.();
  });

  vitest.beforeEach(() => {
    beforeEachCallback?.();
  });

  return {
    afterEach: (callback) => {
      afterEachCallback = callback;
    },
    beforeEach: (callback) => {
      beforeEachCallback = callback;
    },
  };
};
