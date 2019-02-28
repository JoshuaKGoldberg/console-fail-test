import { consoleMethodNames } from "../console";
import { complain } from "./complain";

declare global {
    const afterEach: (callback: () => void) => void;
    const beforeEach: (callback: () => void) => void;
    const expect: (object: any) => any;
    const jest: {
        spyOn<TObject extends {}>(object: TObject, methodName: keyof TObject): MockMethod;
    };
}

export type MockMethod = Function & {
    mock: {
        calls: unknown[][];
    };
    mockRestore(): void;
};

const check = (): boolean => {
    return typeof afterEach !== "undefined" && typeof beforeEach !== "undefined" && typeof jest !== "undefined";
};

const run = () => {
    beforeEach(() => {
        for (const methodName of consoleMethodNames) {
            jest.spyOn(console, methodName);
        }
    });

    afterEach(() => {
        const methodsWithCalls: [keyof Console, unknown[][]][] = [];

        for (const methodName of consoleMethodNames) {
            const method = console[methodName] as MockMethod;
            const {
                mock: { calls },
                mockRestore,
            } = method;

            mockRestore();

            if (calls.length !== 0) {
                methodsWithCalls.push([methodName, calls]);
            }
        }

        if (methodsWithCalls.length !== 0) {
            complain(methodsWithCalls);
        }
    });
};

export const cftJest = { check, run };
