import { CftRequest, SupportedTestFramework } from "../types.js";
import { selectAvaEnvironment } from "./ava.js";
import { selectJasmineEnvironment } from "./jasmine.js";
import { selectJestEnvironment } from "./jest.js";
import { selectLabEnvironment } from "./lab.js";
import { selectMochaEnvironment } from "./mocha.js";
import { selectNodeTapEnvironment } from "./nodeTap.js";
import { TestFrameworkSelector } from "./testEnvironmentTypes.js";
import { selectVitestEnvironment } from "./vitest.js";

const testEnvironmentsByName = new Map<
	SupportedTestFramework,
	TestFrameworkSelector
>([
	["jasmine", selectJasmineEnvironment],
	["jest", selectJestEnvironment],
	["mocha", selectMochaEnvironment],
	["vitest", selectVitestEnvironment],
]);

const detectableTestEnvironmentSelectors: TestFrameworkSelector[] = [
	// These environments only work with received modules, so they should come first
	selectAvaEnvironment,
	selectLabEnvironment,
	selectNodeTapEnvironment,

	selectVitestEnvironment,

	// Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
	selectJestEnvironment,
	selectJasmineEnvironment,

	// Mocha should be last because it's difficult to accurately detect
	// See https://github.com/JoshuaKGoldberg/console-fail-test/issues/10
	selectMochaEnvironment,
];

export const selectTestFramework = (request: CftRequest) => {
	// If a test environment is requested by name, it must exist
	if (typeof request.testFramework === "string") {
		const getter = testEnvironmentsByName.get(request.testFramework);
		if (getter === undefined) {
			throw new Error(
				`Requested test framework '${request.testFramework}' not known by name in console-fail-test.`,
			);
		}

		const environment = getter(request);
		if (environment === undefined) {
			throw new Error(
				`Requested test framework '${request.testFramework}' does not seem to be active.`,
			);
		}

		return environment;
	}

	// Otherwise, attempt to auto-detect an active one
	for (const testEnvironmentGetter of detectableTestEnvironmentSelectors) {
		const environment = testEnvironmentGetter(request);

		if (environment !== undefined) {
			return environment;
		}
	}

	throw new Error(
		"Could not auto-detect test environment; consider passing it directly to cft.",
	);
};
