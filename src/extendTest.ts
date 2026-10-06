import { createConsoleChecker } from "./checker.js";
import { setDefaults } from "./defaults.js";
import { CftRequest } from "./types.js";

/**
 * A test function whose extend method creates fixtures, as in Playwright and Vitest.
 */
export interface ExtendableTest {
	extend(fixtures: object): unknown;
}

/**
 * Extends a test function with an automatic fixture that fails tests that call the console.
 * @param test Test function to extend, such as Playwright's or Vitest's test.
 * @param rawRequest Settings for which console methods are allowed and how to spy on them.
 * @returns The extended test function.
 */
export const extendTest = <Test extends ExtendableTest>(
	test: Test,
	rawRequest?: Partial<Omit<CftRequest, "testFramework">>,
): Test => {
	const checker = createConsoleChecker(setDefaults(rawRequest));

	return test.extend({
		consoleFailTest: [
			// Test frameworks require fixtures to destructure their first parameter
			// eslint-disable-next-line no-empty-pattern
			async ({}, use: () => Promise<void>) => {
				checker.start();
				await use();

				const complaint = checker.stop();
				if (complaint) {
					throw complaint.error;
				}
			},
			{ auto: true },
		],
	}) as Test;
};
