import { createStack } from "../stack";
import { CftRequest } from "../types";

import { MethodCall, SpyFactory, SpyFactoryGetter } from "./spyTypes";

declare type Jasmine = {
    createSpy(): Function & any;
};

declare const jasmine: Jasmine | undefined;

const isJasmineModule = (spyLibrary: unknown): spyLibrary is Jasmine => {
    return typeof spyLibrary === "object" && typeof (spyLibrary as Partial<Jasmine>).createSpy === "function";
};

const createJasmineSpyFactory = (spyLibrary: Jasmine): SpyFactory => {
    return (container: any, methodName: string) => {
        const methodCalls: MethodCall[] = [];
        const originalMethod = container[methodName];

        container[methodName] = spyLibrary.createSpy().and.callFake(function (this: unknown, ...args: unknown[]) {
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
    };
};

export const getJasmineSpyFactory: SpyFactoryGetter = ({ spyLibrary }: CftRequest) => {
    if (isJasmineModule(spyLibrary)) {
        return createJasmineSpyFactory(spyLibrary);
    }

    if (typeof jasmine !== "undefined" && isJasmineModule(jasmine)) {
        return createJasmineSpyFactory(jasmine);
    }

    return undefined;
};
