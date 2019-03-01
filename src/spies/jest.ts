import { createStack } from "../stack";

import { MethodCall, SpyFactory } from "./spyTypes";

export type JestMockMethod = Function & {
    mockRestore(): void;
};

declare const jest: {
    spyOn(container: any, methodName: string, implementation?: Function): JestMockMethod;
};

export const jestSpyFactory: SpyFactory = {
    canSpy() {
        return typeof jest !== "undefined" && typeof jest.spyOn !== "undefined";
    },
    spyOn(container: any, methodName: string) {
        const methodCalls: MethodCall[] = [];
        const originalMethod = container[methodName];

        const methodSpy = function(this: unknown, ...args: unknown[]) {
            methodCalls.push({
                args,
                stack: createStack(),
            });

            return originalMethod.apply(this, args);
        };

        const spy = jest.spyOn(container, methodName, methodSpy);

        return {
            getCalls: () => methodCalls,
            restore: spy.mockRestore,
        };
    },
};
