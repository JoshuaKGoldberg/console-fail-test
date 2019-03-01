import { createStack } from "../stack";

import { MethodCall, SpyFactory } from "./spyTypes";

export const fallbackSpyFactory: SpyFactory = {
    canSpy: () => true,
    spyOn(container: any, methodName: string) {
        const methodCalls: MethodCall[] = [];
        const originalMethod = container[methodName];

        const spyMethod = function(this: unknown, ...args: unknown[]) {
            methodCalls.push({
                args,
                stack: createStack(),
            });

            return originalMethod.apply(this, args);
        };

        spyMethod.getCalls = () => methodCalls;

        spyMethod.restore = () => {
            container[methodName] = originalMethod;
        };

        container[methodName] = spyMethod;

        return spyMethod;
    },
};
