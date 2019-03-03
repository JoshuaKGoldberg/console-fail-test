import { TestAfterHooks, TestEnvironmentGetter } from "./testEnvironmentTypes";

declare const afterEach: (callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const jasmine: {
    Spec: unknown;
};

export const getJasmineEnvironment: TestEnvironmentGetter = () => {
    if (
        typeof afterEach === "undefined" ||
        typeof beforeEach === "undefined" ||
        typeof jasmine === "undefined" ||
        typeof jasmine.Spec === "undefined"
    ) {
        return undefined;
    }

    return {
        after(callback: (afterHooks: TestAfterHooks) => void) {
            afterEach(() => {
                callback({
                    reportComplaint(error: Error) {
                        throw error;
                    },
                });
            });
        },
        before: (callback: () => void) => {
            beforeEach(callback);
        },
        filterMethodCalls: ({ methodCalls }) => methodCalls,
        formatComplaint: (complaint: Error) => {
            // Jasmine prints the error stack along with its message, resulting in a duplicate message
            // tslint:disable-next-line:no-non-null-assertion
            complaint.stack = complaint.stack!.substring(complaint.message.length);
            return complaint;
        },
    };
};
