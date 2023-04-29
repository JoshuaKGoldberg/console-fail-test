import { formatComplaintCall } from "../complaining";

import { TestFrameworkSelector } from "./testEnvironmentTypes";

declare interface NodeTap {
  afterEach(callback: (onFinishAfterEach: () => void) => void): void;
  beforeEach(callback: (onFinishBeforeEach: () => void) => void): void;
  fail(message: string): void;
  jobs: number;
  pool: {};
  name: "TAP";
}

const isNodeTap = (testFramework: unknown): testFramework is NodeTap => {
  return (
    typeof testFramework !== "undefined" &&
    typeof (testFramework as Partial<NodeTap>).afterEach === "function" &&
    typeof (testFramework as Partial<NodeTap>).beforeEach === "function" &&
    typeof (testFramework as Partial<NodeTap>).fail === "function" &&
    typeof (testFramework as Partial<NodeTap>).jobs === "number" &&
    typeof (testFramework as Partial<NodeTap>).pool === "object" &&
    (testFramework as Partial<NodeTap>).name === "TAP"
  );
};

export const selectNodeTapEnvironment: TestFrameworkSelector = ({ testFramework }) => {
  if (!isNodeTap(testFramework)) {
    return undefined;
  }

  return {
    afterEach: (callback) => {
      testFramework.afterEach((onFinishAfterEach) => {
        callback({
          reportComplaint({ methodComplaints }) {
            for (const { methodName, methodCalls } of methodComplaints) {
              for (const methodCall of methodCalls) {
                testFramework.fail(
                  `console.${methodName} was called with: ${formatComplaintCall(methodCall)}`,
                );
              }
            }
          },
        });
        onFinishAfterEach();
      });
    },
    beforeEach: (callback) => {
      testFramework.beforeEach((onFinishBeforeEach) => {
        callback();
        onFinishBeforeEach();
      });
    },
  };
};
