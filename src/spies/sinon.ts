import { createStack } from "../stack";

import { MethodCall, SpyFactory } from "./spyTypes";

type SinonSpy = Function & {
    getCalls(): unknown[][];
    restore(): void;
};

declare const sinon: {
    spy(): SinonSpy;
};

export const sinonSpyFactory: SpyFactory = {
    canSpy() {
        return typeof sinon !== "undefined" && typeof sinon.spy !== "undefined";
    },
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

        container[methodName] = spyMethod;

        return {
            getCalls: () => methodCalls,
            restore() {
                container[methodName] = originalMethod;
            },
        };
    },
};
