import { selectMochaEnvironment } from "./mocha.js";
import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const Cypress: object | undefined;

export const selectCypressEnvironment: TestFrameworkSelector = (request) => {
	// Cypress runs a bundled Mocha inside the browser, so it's detected the same way
	if (typeof Cypress === "undefined") {
		return undefined;
	}

	const mocha = selectMochaEnvironment(request);
	if (mocha === undefined) {
		return undefined;
	}

	// Cypress reports test results from Node.js instead of from the browser,
	// so Mocha's workaround for its reporter logging to the console doesn't apply
	return {
		afterEach: mocha.afterEach,
		beforeEach: mocha.beforeEach,
	};
};
