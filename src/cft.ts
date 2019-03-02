import { createComplaint } from "./complaining";
import { consoleMethodNames } from "./console";
import { getTestEnvironment } from "./environments/allTestEnvironments";
import { getSpyFactory } from "./spies/allSpyFactories";
import { MethodCall, MethodSpy } from "./spies/spyTypes";

export const cft = () => {
    const spyFactory = getSpyFactory();
    const testEnvironment = getTestEnvironment();
    const methodSpies: { [i: string]: MethodSpy } = {};

    testEnvironment.before(() => {
        for (const methodName of consoleMethodNames) {
            methodSpies[methodName] = spyFactory.spyOn(console, methodName);
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
