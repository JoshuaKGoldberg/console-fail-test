import { describe, expect, it, test, vi } from "vitest";

import { selectMochaEnvironment } from "./mocha.js";

declare const suites: [typeof mockSuite];

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

	describe("afterEach", () => {
		const runAfterEach = (currentTest: object) => {
			Object.defineProperties(globalThis, {
				afterEach: { value: mockAfterEach, writable: true },
				beforeEach: { value: mockBeforeEach, writable: true },
				suites: { value: [mockSuite], writable: true },
			});
			const context = { currentTest, test: { error: vi.fn() } };
			const error = new Error("Oh no!\nDetails");

			selectMochaEnvironment({ console: {} })!.afterEach((hooks) => {
				hooks!.reportComplaint!({ error, methodComplaints: [] });
			});
			(mockSuite.afterEach.mock.lastCall![0] as Function).call(context);

			return { context, error };
		};

		it("fails the test with an indented error when the test passed", () => {
			const { context, error } = runAfterEach({ state: "passed" });

			expect(context.test.error).toHaveBeenCalledWith(error);
			expect(error.message).toBe("Oh no!\n     Details");
		});

		it("does not fail the test when the test did not pass", () => {
			const { context } = runAfterEach({ state: "failed" });

			expect(context.test.error).not.toHaveBeenCalled();
		});

		it("marks the test's Cypress status as failed when it has one", () => {
			const { context } = runAfterEach({
				_cypressTestStatusInfo: { outerStatus: "passed" },
				state: "passed",
			});

			expect(context.currentTest).toEqual({
				_cypressTestStatusInfo: { outerStatus: "failed" },
				state: "passed",
			});
		});
	});
});
