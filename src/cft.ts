import { createComplaint } from "./complaining";
import { consoleMethodNames } from "./console";
import { selectTestEnvironment } from "./environments/selectTestEnvironments";
import { getSpyFactory } from "./spies/selectSpyFactory";
import { MethodCall, MethodSpy } from "./spies/spyTypes";
import { CftRequest } from "./types";

export const cft = (request: CftRequest = {}) => {
    const spyFactory = getSpyFactory(request);
    const testEnvironment = selectTestEnvironment(request);
    const methodSpies: { [i: string]: MethodSpy } = {};

    testEnvironment.before(() => {
        for (const methodName of consoleMethodNames) {
            methodSpies[methodName] = spyFactory(console, methodName);
        }
    });

    testEnvironment.after(({ reportComplaint }) => {
        const methodsWithCalls: [keyof Console, MethodCall[]][] = [];

        for (const methodName of consoleMethodNames) {
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

        const complaint = testEnvironment.formatComplaint(createComplaint(methodsWithCalls));

        reportComplaint(complaint);
    });
};
