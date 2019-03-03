import { CftRequest } from "../types";

import { TestAfterHooks, TestEnvironmentGetter } from "./testEnvironmentTypes";

declare type Lab = {
    afterEach(callback: Function): void;
    beforeEach(callback: Function): void;
    setOnly: Function;
    _current: {
        tests: unknown[];
    };
};

const isLab = (testFramework: unknown): testFramework is Lab => {
    return (
        typeof testFramework !== "undefined" &&
        typeof (testFramework as Partial<Lab>).afterEach !== "undefined" &&
        typeof (testFramework as Partial<Lab>).beforeEach !== "undefined" &&
        typeof (testFramework as Partial<Lab>).setOnly !== "undefined" &&
        typeof (testFramework as Partial<Lab>)._current === "object" &&
        typeof (testFramework as Lab)._current.tests === "object"
    );
};

export const getLabEnvironment: TestEnvironmentGetter = ({ testFramework }: CftRequest) => {
    if (!isLab(testFramework)) {
        return undefined;
    }

    return {
        after(callback: (afterHooks: TestAfterHooks) => void) {
            testFramework.afterEach(() => {
                callback({
                    reportComplaint({ error }) {
                        throw error;
                    },
                });
            });
        },
        before: testFramework.beforeEach,
        filterMethodCalls: ({ methodCalls }) => methodCalls,
    };
};
