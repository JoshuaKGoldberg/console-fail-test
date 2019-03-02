import { getJestEnvironment } from "./jest";
import { getMochaEnvironment } from "./mocha";
import { TestEnvironmentGetter } from "./testEnvironmentTypes";

const allTestEnvironmentGetters: TestEnvironmentGetter[] = [
    getJestEnvironment,
    // Mocha should be last because it's difficult to accurately detect
    // See https://github.com/RyzacInc/console-fail-test/issues/10
    getMochaEnvironment,
];

export const getTestEnvironment = () => {
    for (const testEnvironmentGetter of allTestEnvironmentGetters) {
        const environment = testEnvironmentGetter();

        if (environment !== undefined) {
            return environment;
        }
    }

    throw new Error("Could not detect test environment :(");
};
