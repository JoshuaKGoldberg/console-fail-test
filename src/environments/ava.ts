import { CftRequest } from "../types";

import { TestAfterHooks, TestEnvironmentGetter } from "./testEnvironmentTypes";

declare type Ava = {
    afterEach(callback: Function): void;
    beforeEach(callback: Function): void;
    cb: Function;
    failing: Function;
    meta: {
        file: string;
    };
    serial: Function & {
        cb: Function;
    };
};

const isAva = (testFramework: unknown): testFramework is Ava => {
    return (
        typeof testFramework !== "undefined" &&
        typeof (testFramework as Partial<Ava>).afterEach !== "undefined" &&
        typeof (testFramework as Partial<Ava>).beforeEach !== "undefined" &&
        typeof (testFramework as Partial<Ava>).failing !== "undefined" &&
        typeof (testFramework as Partial<Ava>).meta === "object" &&
        typeof (testFramework as Ava).meta.file === "string" &&
        typeof (testFramework as Partial<Ava>).serial !== "undefined" &&
        typeof (testFramework as Ava).serial.cb !== "undefined"
    );
};

export const getAvaEnvironment: TestEnvironmentGetter = ({ testFramework }: CftRequest) => {
    if (!isAva(testFramework)) {
        return undefined;
    }

    return {
        after(callback: (afterHooks: TestAfterHooks) => void) {
            testFramework.afterEach(() => {
                callback({
                    reportComplaint: (complaint: Error) => {
                        throw complaint;
                    },
                });
            });
        },
        before: testFramework.beforeEach,
        filterMethodCalls: ({ methodCalls }) => methodCalls,
        formatComplaint: (error: Error): Error => {
            error.message = error.message.replace(/\n/g, "\n  ");
            return error;
        },
    };
};
