import { createStack } from "../stack";

import { MethodCall, SpyFactory } from "./spyTypes";

declare const jest: {
    fn(implementation: Function): void;
};

export const jestSpyFactory: SpyFactory = {
    canSpy() {
        return typeof jest !== "undefined" && typeof jest.fn !== "undefined";
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

        container[methodName] = jest.fn(methodSpy);

        return {
            getCalls: () => methodCalls,
            restore: () => {
                container[methodName] = originalMethod;
            },
        };
    },
};
