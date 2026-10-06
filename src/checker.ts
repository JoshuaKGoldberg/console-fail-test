import { filterAllowedCalls, isMethodFullyAllowed } from "./allowing.js";
import { createComplaint } from "./complaining/index.js";
import { consoleMethodNames } from "./console.js";
import { TestFramework } from "./environments/testEnvironmentTypes.js";
import { selectSpyFactory } from "./spies/selectSpyFactory.js";
import { MethodSpy, SpyCallArgs } from "./spies/spyTypes.js";
import { CftRequest } from "./types.js";

/**
 * Creates functions to spy on the console before a test and collect calls after it.
 * @param request Settings for which console methods are allowed and how to spy on them.
 * @param mapSpyCalls Optionally maps each method's calls to the ones to report.
 * @returns Functions to call before and after each test.
 */
export const createConsoleChecker = (
	request: CftRequest,
	mapSpyCalls?: TestFramework["mapSpyCalls"],
) => {
	const spyFactory = selectSpyFactory(request);
	const methodSpies: Record<string, MethodSpy> = {};
	const relevantMethodNames = consoleMethodNames.filter(
		(name) => !isMethodFullyAllowed(request.console[name]),
	);

	return {
		// Before each test, we spy on the console's methods
		start: () => {
			for (const methodName of relevantMethodNames) {
				methodSpies[methodName] = spyFactory(console, methodName);
			}
		},

		// After each test, we collect the spied method calls into a complaint, if any
		stop: () => {
			const methodsWithCalls: [keyof Console, SpyCallArgs[]][] = [];

			for (const methodName of relevantMethodNames) {
				const spy = methodSpies[methodName];
				const methodCalls = spy.getCalls();
				const filteredCalls = filterAllowedCalls(
					mapSpyCalls?.({ methodCalls, methodName }) ?? methodCalls,
					request.console[methodName],
				);

				spy.restore();

				if (filteredCalls.length !== 0) {
					methodsWithCalls.push([methodName, filteredCalls]);
				}
			}

			return methodsWithCalls.length === 0
				? undefined
				: createComplaint(methodsWithCalls);
		},
	};
};
