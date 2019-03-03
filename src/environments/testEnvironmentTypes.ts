import { MethodCall } from "../spies/spyTypes";
import { CftRequest } from "../types";

export type TestEnvironmentGetter = (request: CftRequest) => TestEnvironment | undefined;

export type TestEnvironment = {
    after: (callback: (hooks: TestAfterHooks) => void) => void;
    before: (callback: () => void) => void;
    filterMethodCalls: (filter: MethodCallsAndName) => MethodCall[];
};

export type TestAfterHooks = {
    reportComplaint: (complaint: TestComplaint) => void;
};

export type MethodCallsAndName = {
    methodCalls: MethodCall[];
    methodName: string;
};

/**
 * @remarks
 * It is preferred for test frameworks to directly throw `error`, as it contains a friendly call stack.
 * However, if the test framework doesn't format multiline error messages well, it might instead
 * log a separate failure for each of the `methodComplaints`.
 */
export type TestComplaint = {
    error: Error;
    methodComplaints: MethodCallsAndName[];
};
