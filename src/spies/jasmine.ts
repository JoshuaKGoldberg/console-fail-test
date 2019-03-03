import { createStack } from "../stack";

import { MethodCall, SpyFactory } from "./spyTypes";

declare const jasmine: {
    createSpy(): Function & any;
};

export const jasmineSpyFactory: SpyFactory = {
    canSpy() {
        return typeof jasmine !== "undefined" && typeof jasmine.createSpy !== "undefined";
    },
    spyOn(container: any, methodName: string) {
        const methodCalls: MethodCall[] = [];
        const originalMethod = container[methodName];

        container[methodName] = jasmine.createSpy().and.callFake(function(this: unknown, ...args: unknown[]) {
            methodCalls.push({
                args,
                stack: createStack(),
            });

            return originalMethod.apply(this, args);
        });

        return {
            getCalls: () => methodCalls,
            restore: () => {
                container[methodName] = originalMethod;
            },
        };
    },
};
