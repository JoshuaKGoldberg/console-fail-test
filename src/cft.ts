import { createComplaint } from "./complaining";
import { consoleMethodNames } from "./console";
import { setDefaults } from "./defaults";
import { selectTestEnvironment } from "./environments/selectTestEnvironments";
import { getSpyFactory } from "./spies/selectSpyFactory";
import { MethodCall, MethodSpy } from "./spies/spyTypes";
import { CftRequest } from "./types";

export const cft = (rawRequest: Partial<CftRequest>) => {
    const request = setDefaults(rawRequest);
    const spyFactory = getSpyFactory(request);
    const testEnvironment = selectTestEnvironment(request);
    const methodSpies: { [i: string]: MethodSpy } = {};
    const relevantMethodNames = consoleMethodNames.filter((name) => !!request.console[name]);

    testEnvironment.before(() => {
        for (const methodName of relevantMethodNames) {
            methodSpies[methodName] = spyFactory(console, methodName);
        }
    });

    testEnvironment.after(({ reportComplaint }) => {
        const methodsWithCalls: [keyof Console, MethodCall[]][] = [];

        for (const methodName of relevantMethodNames) {
            const spy = methodSpies[methodName];
            const calls = testEnvironment.filterMethodCalls({
                methodCalls: spy.getCalls(),
                methodName,
            });

            spy.restore();

            if (calls.length !== 0) {
                methodsWithCalls.push([methodName, calls]);
            }
        }

        if (methodsWithCalls.length === 0) {
            return;
        }

        reportComplaint(createComplaint(methodsWithCalls));
    });
};
