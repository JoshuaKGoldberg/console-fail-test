import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const afterEach: (callback: (this: Mocha) => void) => void;
declare const beforeEach: (callback: (this: Mocha) => void) => void;

declare interface Mocha {
	currentTest: {
		state: string;
	};
	test: {
		error(error: Error): void;
	};
}

const isMocha = () => {
	// Until there is some kind of global `mocha` variable that can be referenced,
	// we check the stringified versions of its used hook methods
	// https://github.com/JoshuaKGoldberg/console-fail-test/issues/10
	// https://github.com/mochajs/mocha/issues/5084

	return (
		typeof afterEach !== "undefined" &&
		typeof beforeEach !== "undefined" &&
		`${afterEach}`.replace(/\s/g, "") ===
			"function(name,fn){suites[0].afterEach(name,fn);}" &&
		`${beforeEach}`.replace(/\s/g, "") ===
			"function(name,fn){suites[0].beforeEach(name,fn);}"
	);
};

export const selectMochaEnvironment: TestFrameworkSelector = () => {
	if (!isMocha()) {
		return undefined;
	}

	return {
		afterEach: (callback) => {
			afterEach(function (this: Mocha) {
				if (this.currentTest.state !== "passed") {
					return;
				}

				callback({
					reportComplaint: ({ error }) => {
						error.message = error.message.replace(/\n/g, "\n     ");
						this.test.error(error);
					},
				});
			});
		},
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
