import { createMochaAfterEach, isMocha, MochaContext } from "./mocha.js";
import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const beforeEach: (callback: (this: MochaContext) => void) => void;
declare const Cypress: object | undefined;

type CypressTest = MochaContext["currentTest"] & {
	_cypressTestStatusInfo?: {
		outerStatus: string;
	};
};

export const selectCypressEnvironment: TestFrameworkSelector = () => {
	// Cypress runs a bundled Mocha inside the browser, so it's detected the same way
	if (typeof Cypress === "undefined" || !isMocha()) {
		return undefined;
	}

	// No mapSpyCalls: unlike Mocha's, Cypress's reporter runs outside the browser,
	// so its logs never show up in the spied console
	return {
		afterEach: createMochaAfterEach((context, error) => {
			// Failing the test itself, rather than throwing from this hook,
			// lets Cypress continue running the suite's remaining tests
			context.test.error(error);

			// Cypress >=13 decides the status it reports for a test right after the
			// test's body runs, before afterEach hooks, and only updates that status
			// itself when a hook fails. This updates it the same way Cypress does.
			// https://github.com/cypress-io/cypress/blob/develop/packages/driver/src/cypress/runner.ts
			const test = context.currentTest as CypressTest;
			if (test._cypressTestStatusInfo) {
				test._cypressTestStatusInfo.outerStatus = "failed";
			}
		}),
		beforeEach,
	};
};
