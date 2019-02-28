import { consoleMethodNames } from "./console";
import { Environment, Failer } from "./failers";

export type JestEnvironment = Environment & {
    afterEach(callback: () => void): void;
    beforeEach(callback: () => void): void;
    expect(object: any): any;
    jest: {
        spyOn<TObject extends {}>(object: TObject, methodName: keyof TObject): void;
    };
};

const check = (environment: {}): environment is JestEnvironment => {
    return "afterEach" in environment && "beforeEach" in environment && "jest" in environment;
};

const complain = (methodsWithCalls: [keyof Console, unknown[]][]) => {
    // It looks like something wrote to the console during your test!
    // Put a breakpoint on this line and check the methodsWithCalls variable to see details.
    throw new Error(`The following console methods were called: ${methodsWithCalls.map(([methodName]) => methodName).join(", ")}`);
};

const run = (environment: JestEnvironment) => {
    environment.beforeEach(() => {
        for (const methodName of consoleMethodNames) {
            environment.jest.spyOn(environment.console, methodName);
        }
    });

    environment.afterEach(() => {
        const methodsWithCalls: [keyof Console, unknown[]][] = [];

        for (const methodName of consoleMethodNames) {
            const method = environment.console[methodName];
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

export const cftJest: Failer<JestEnvironment> = { check, run };
