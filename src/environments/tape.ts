import { createMethodCallComplaintReporter } from "../complaining/index.js";
import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare interface TapeHarness {
	(...args: unknown[]): unknown;
	_results: TapeResults;
	createStream: Function;
	getHarness?: () => TapeHarness;
	onFailure: Function;
	onFinish: Function;
	only: Function;
}

declare interface TapeResults {
	on(event: "_push", listener: (test: TapeTest) => void): void;
}

declare interface TapeTest {
	fail(message: string): void;
	once(event: "end" | "prerun", listener: () => void): void;
	teardown?: (callback: () => void) => void;
}

const isTapeHarness = (
	testFramework: unknown,
): testFramework is TapeHarness => {
	return (
		typeof testFramework === "function" &&
		typeof (testFramework as Partial<TapeHarness>).createStream ===
			"function" &&
		typeof (testFramework as Partial<TapeHarness>).onFailure === "function" &&
		typeof (testFramework as Partial<TapeHarness>).onFinish === "function" &&
		typeof (testFramework as Partial<TapeHarness>).only === "function"
	);
};

const isTapeResults = (results: unknown): results is TapeResults => {
	return (
		typeof results === "object" &&
		results !== null &&
		typeof (results as Partial<TapeResults>).on === "function"
	);
};

const getTapeResults = (testFramework: unknown) => {
	if (!isTapeHarness(testFramework)) {
		return undefined;
	}

	// The default `tape` export lazily creates a harness on first use.
	// Harnesses created with `createHarness()` can also be passed directly.
	const harness =
		typeof testFramework.getHarness === "function"
			? testFramework.getHarness()
			: testFramework;

	return isTapeResults(harness._results) ? harness._results : undefined;
};

export const selectTapeEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	const results = getTapeResults(testFramework);
	if (results === undefined) {
		return undefined;
	}

	// tape has no beforeEach or afterEach hooks, but its harness emits each
	// top-level test as it's registered. Subtests run before their parent test
	// ends, so hooking only top-level tests is enough to cover them.
	return {
		afterEach: (callback) => {
			results.on("_push", (test) => {
				const runAfterEach = () => {
					callback({
						reportComplaint: createMethodCallComplaintReporter((message) => {
							test.fail(message);
						}),
					});
				};

				// tape <5.2 (and <4.14) doesn't have t.teardown(), but emits 'end'
				// at the same point: after subtests, before checking the plan
				if (typeof test.teardown === "function") {
					test.teardown(runAfterEach);
				} else {
					test.once("end", runAfterEach);
				}
			});
		},
		beforeEach: (callback) => {
			results.on("_push", (test) => {
				test.once("prerun", callback);
			});
		},
	};
};
