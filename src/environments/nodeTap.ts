import { formatComplaintCall } from "../complaining";
import { CftRequest } from "../types";

import { TestAfterHooks, TestEnvironmentGetter } from "./testEnvironmentTypes";

declare type NodeTap = {
    afterEach(callback: Function): void;
    beforeEach(callback: Function): void;
    fail(message: string): void;
    jobs: number;
    pool: {};
    name: "TAP";
};

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

export const getNodeTapEnvironment: TestEnvironmentGetter = ({ testFramework }: CftRequest) => {
    if (!isNodeTap(testFramework)) {
        return undefined;
    }

    return {
        after(callback: (afterHooks: TestAfterHooks) => void) {
            testFramework.afterEach((onFinishAfterEach: () => void) => {
                callback({
                    reportComplaint({ methodComplaints }) {
                        for (const { methodName, methodCalls } of methodComplaints) {
                            for (const methodCall of methodCalls) {
                                testFramework.fail(`console.${methodName} was called with: ${formatComplaintCall(methodCall)}`);
                            }
                        }
                    },
                });
                onFinishAfterEach();
            });
        },
        before(callback: () => void) {
            testFramework.beforeEach((onFinishBeforeEach: () => void) => {
                callback();
                onFinishBeforeEach();
            });
        },
        filterMethodCalls: ({ methodCalls }) => methodCalls,
    };
};
