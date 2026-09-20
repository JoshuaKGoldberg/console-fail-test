import { describe, expect, it, test, vi } from "vitest";

import { selectMochaEnvironment } from "./mocha.js";

declare const suites: [
	{ afterEach: typeof mockAfterEach; beforeEach: typeof mockBeforeEach },
];

const mockAfterEach = function (name: string, fn: () => void) {
	suites[0].afterEach(name, fn);
};

const mockBeforeEach = function (name: string, fn: () => void) {
	suites[0].beforeEach(name, fn);
};

const mockSuite = {
	afterEach: vi.fn<(...args: unknown[]) => void>(),
	beforeEach: vi.fn(),
};

describe("selectMochaEnvironment", () => {
	describe("afterEach", () => {
		it("fails the test with the error when the test passed", () => {
			Object.defineProperties(globalThis, {
				afterEach: { value: mockAfterEach, writable: true },
				beforeEach: { value: mockBeforeEach, writable: true },
				suites: { value: [mockSuite], writable: true },
			});
			const error = new Error("Oh no!");
			const context = {
				currentTest: { state: "passed" },
				test: { error: vi.fn() },
			};

			selectMochaEnvironment({ console: {} })!.afterEach((hooks) => {
				hooks!.reportComplaint!({ error, methodComplaints: [] });
			});
			(mockSuite.afterEach.mock.calls[0][0] as (this: unknown) => void).call(
				context,
			);

			expect(context.test.error).toHaveBeenCalledWith(error);
		});
	});

	describe("isMocha", () => {
		test.each([
			[undefined, undefined, undefined],
			[vi.fn(), vi.fn(), undefined],
			[vi.fn(), mockAfterEach, undefined],
			[mockAfterEach, mockBeforeEach, expect.any(Object)],
		])(
			"when afterEach is %o and beforeEach is %o, returns %o",
			(afterEach, beforeEach, expected) => {
				Object.defineProperties(globalThis, {
					afterEach: {
						value: afterEach,
						writable: true,
					},
					beforeEach: {
						value: beforeEach,
						writable: true,
					},
				});
				const actual = selectMochaEnvironment({
					console: {},
				});

				expect(actual).toEqual(expected);
			},
		);
	});
});
