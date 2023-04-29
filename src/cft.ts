import { createComplaint } from "./complaining";
import { consoleMethodNames } from "./console";
import { setDefaults } from "./defaults";
import { selectTestFramework as selectTestFramework } from "./environments/selectTestFramework";
import { TestComplaint } from "./environments/testEnvironmentTypes";
import { selectSpyFactory } from "./spies/selectSpyFactory";
import { SpyCallArgs, MethodSpy } from "./spies/spyTypes";
import { CftRequest } from "./types";

const defaultReportComplaint = ({ error }: TestComplaint) => {
  throw error;
};

export const cft = (rawRequest?: Partial<CftRequest>) => {
  const request = setDefaults(rawRequest);
  const spyFactory = selectSpyFactory(request);
  const testFramework = selectTestFramework(request);
  const methodSpies: Record<string, MethodSpy> = {};
  const relevantMethodNames = consoleMethodNames.filter((name) => !request.console[name]);

  // Before each test, we spy on the console's methods
  testFramework.beforeEach(() => {
    for (const methodName of relevantMethodNames) {
      methodSpies[methodName] = spyFactory(console, methodName);
    }
  });

  // After each test, we collect the spied method calls, reporting on any found
  testFramework.afterEach(({ reportComplaint = defaultReportComplaint } = {}) => {
    const methodsWithCalls: [keyof Console, SpyCallArgs[]][] = [];

    for (const methodName of relevantMethodNames) {
      const spy = methodSpies[methodName];
      const methodCalls = spy.getCalls();
      const filteredCalls = testFramework.mapSpyCalls?.({ methodCalls, methodName }) ?? methodCalls;

      spy.restore();

      if (filteredCalls.length !== 0) {
        methodsWithCalls.push([methodName, filteredCalls]);
      }
    }

    if (methodsWithCalls.length === 0) {
      return;
    }

    reportComplaint(createComplaint(methodsWithCalls));
  });
};
