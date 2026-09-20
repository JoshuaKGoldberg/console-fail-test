import {
	TestFramework,
	TestFrameworkSelector,
} from "./testEnvironmentTypes.js";

declare const afterEach: (callback: (this: MochaContext) => void) => void;
declare const beforeEach: (callback: (this: MochaContext) => void) => void;

export interface MochaContext {
	currentTest: {
		state: string;
	};
	test: {
		error(error: Error): void;
	};
}

export const isMocha = () => {
	// Until there is some kind of global `mocha` variable that can be referenced,
	// we check the stringified versions of its used hook methods
	// https://github.com/JoshuaKGoldberg/console-fail-test/issues/10
	// https://github.com/mochajs/mocha/issues/5084

	return (
		typeof afterEach !== "undefined" &&
		typeof beforeEach !== "undefined" &&
		/^function\(name,fn\)\{(?:return)?suites\[0\]\.afterEach\(name,fn\);\}$/.test(
			`${afterEach}`.replace(/\s/g, ""),
		) &&
		/^function\(name,fn\)\{(?:return)?suites\[0\]\.beforeEach\(name,fn\);\}$/.test(
			`${beforeEach}`.replace(/\s/g, ""),
		)
	);
};

/**
 * Creates an afterEach hook for Mocha and for test frameworks built on Mocha.
 * @param reportError Fails the hook's current test with an error.
 * @returns The afterEach hook.
 */
export const createMochaAfterEach =
	(
		reportError: (context: MochaContext, error: Error) => void,
	): TestFramework["afterEach"] =>
	(callback) => {
		afterEach(function (this: MochaContext) {
			if (this.currentTest.state !== "passed") {
				return;
			}

			callback({
				reportComplaint: ({ error }) => {
					error.message = error.message.replace(/\n/g, "\n     ");
					reportError(this, error);
				},
			});
		});
	};

export const selectMochaEnvironment: TestFrameworkSelector = () => {
	if (!isMocha()) {
		return undefined;
	}

	return {
		afterEach: createMochaAfterEach((context, error) => {
			context.test.error(error);
		}),
		beforeEach,
		mapSpyCalls: ({ methodCalls, methodName }) => {
			if (methodCalls.length === 0 || methodName !== "log") {
				return methodCalls;
			}

			// Mocha logs test names and status just before the after hook
			// The last log, if it exists, might be the spec reporter
			// It'd be nice to have more info on what the reporter has logged...
			const lastCall = methodCalls[methodCalls.length - 1];
			const first = lastCall[0];
			if (typeof first === "string" && first.startsWith("  ")) {
				methodCalls = methodCalls.slice(0, methodCalls.length - 1);
			}

			return methodCalls;
		},
	};
};
