import { TestAfterHooks, TestEnvironmentGetter } from "./testEnvironmentTypes";

declare const afterEach: (callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const jest: unknown;

export const getJestEnvironment: TestEnvironmentGetter = () => {
    if (typeof afterEach === "undefined" || typeof beforeEach === "undefined" || typeof jest === "undefined") {
        return undefined;
    }

    return {
        after(callback: (afterHooks: TestAfterHooks) => void) {
            afterEach(() => {
                callback({
                    reportComplaint({ error }) {
                        throw error;
                    },
                });
            });
        },
        before: (callback: () => void) => {
            beforeEach(callback);
        },
        filterMethodCalls: ({ methodCalls }) => methodCalls,
    };
};
