import { getJestEnvironment } from "./jest";
import { getMochaEnvironment } from "./mocha";
import { TestEnvironmentGetter } from "./testEnvironmentTypes";

const allTestEnvironmentGetters: TestEnvironmentGetter[] = [getJestEnvironment, getMochaEnvironment];

export const getTestEnvironment = () => {
    for (const testEnvironmentGetter of allTestEnvironmentGetters) {
        const environment = testEnvironmentGetter();

        if (environment !== undefined) {
            return environment;
        }
    }

    throw new Error("Could not detect test environment :(");
};
