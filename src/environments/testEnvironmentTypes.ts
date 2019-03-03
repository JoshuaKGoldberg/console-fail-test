import { MethodCall } from "../spies/spyTypes";
import { CftRequest } from "../types";

export type TestEnvironmentGetter = (request: CftRequest) => TestEnvironment | undefined;

export type TestEnvironment = {
    after: (callback: (hooks: TestAfterHooks) => void) => void;
    before: (callback: () => void) => void;
    filterMethodCalls: (filter: TestMethodFilter) => MethodCall[];
    formatComplaint: (complaint: Error) => Error;
};

export type TestAfterHooks = {
    reportComplaint: (complaint: Error) => void;
};

export type TestMethodFilter = {
    methodCalls: MethodCall[];
    methodName: string;
};
