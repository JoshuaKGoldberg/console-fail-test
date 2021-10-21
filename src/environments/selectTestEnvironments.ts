import { CftRequest, SupportedTestFramework } from "../types";

import { getAvaEnvironment } from "./ava";
import { getJasmineEnvironment } from "./jasmine";
import { getJestEnvironment } from "./jest";
import { getLabEnvironment } from "./lab";
import { getMochaEnvironment } from "./mocha";
import { getNodeTapEnvironment } from "./nodeTap";
import { TestEnvironmentGetter } from "./testEnvironmentTypes";

const testEnvironmentsByName = new Map<SupportedTestFramework, TestEnvironmentGetter>([
  ["mocha", getMochaEnvironment],
  ["jest", getJestEnvironment],
  ["jasmine", getJasmineEnvironment],
]);

const detectableTestEnvironmentGetters: TestEnvironmentGetter[] = [
  // These environments only work with received modules, so they should come first
  getAvaEnvironment,
  getLabEnvironment,
  getNodeTapEnvironment,

  // Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
  getJestEnvironment,
  getJasmineEnvironment,

  // Mocha should be last because it's difficult to accurately detect
  // See https://github.com/RyzacInc/console-fail-test/issues/10
  getMochaEnvironment,
];

export const selectTestEnvironment = (request: CftRequest) => {
  // If a test environment is requested by name, it must exist
  if (typeof request.testFramework === "string") {
    const getter = testEnvironmentsByName.get(request.testFramework);
    if (getter === undefined) {
      throw new Error(
        `Requested test framework '${request.testFramework}' not known by name in console-fail-test.`,
      );
    }

    const environment = getter(request);
    if (environment === undefined) {
      throw new Error(
        `Requested test framework '${request.testFramework}' does not seem to be active.`,
      );
    }

    return environment;
  }

  // Otherwise, attempt to auto-detect an active one
  for (const testEnvironmentGetter of detectableTestEnvironmentGetters) {
    const environment = testEnvironmentGetter(request);

    if (environment !== undefined) {
      return environment;
    }
  }

  throw new Error("Could not auto-detect test environment; consider passing it directly to cft.");
};
