import { createConsoleChecker } from "./checker.js";
import { setDefaults } from "./defaults.js";
import { CftRequest } from "./types.js";

/**
 * Global test hooks, as in TestCafe's hooks.test configuration option.
 */
export interface TestCafeHooks {
	after: () => void;
	before: () => void;
}

/**
 * Creates global test hooks that fail TestCafe tests that call the console.
 * @param rawRequest Settings for which console methods are allowed and how to spy on them.
 * @returns Hooks to provide as TestCafe's hooks.test configuration option.
 */
export const createTestCafeHooks = (
	rawRequest?: Partial<Omit<CftRequest, "testFramework">>,
): TestCafeHooks => {
	const checker = createConsoleChecker(setDefaults(rawRequest));

	return {
		after: () => {
			const complaint = checker.stop();
			if (complaint) {
				throw complaint.error;
			}
		},
		before: () => {
			checker.start();
		},
	};
};
