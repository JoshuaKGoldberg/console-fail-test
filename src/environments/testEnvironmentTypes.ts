import { SpyCallArgs } from "../spies/spyTypes.js";
import { CftRequest } from "../types.js";

export type TestFrameworkSelector = (
	request: CftRequest
) => TestFramework | undefined;

interface TestFramework {
	/**
	 * Adds a callback to be called after each test.
	 * @param callback - Called after each test.
	 */
	afterEach: (callback: (hooks?: TestAfterHooks) => void) => void;

	/**
	 * Adds a callback to be called after each test.
	 * @param callback - Called after each test.
	 */
	beforeEach: (callback: () => void) => void;

	/**
	 * Maps each spy method name and calls to the args that should be logged.
	 * @param call - A method call's args and name.
	 * @returns The args that should be logged.
	 * If not provided, the method calls are returned directly.
	 */
	mapSpyCalls?: (call: SpyCallsAndName) => SpyCallArgs[];
}

interface TestAfterHooks {
	reportComplaint?: (complaint: TestComplaint) => void;
}

interface SpyCallsAndName {
	methodCalls: SpyCallArgs[];
	methodName: string;
}

/**
 * It is preferred for test frameworks to directly throw `error`, as it contains a friendly call stack.
 * However, if the test framework doesn't format multiline error messages well, it might instead
 * log a separate failure for each of the `methodComplaints`.
 */
export interface TestComplaint {
	error: Error;
	methodComplaints: SpyCallsAndName[];
}
