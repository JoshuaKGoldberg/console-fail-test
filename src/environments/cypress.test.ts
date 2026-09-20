import { beforeEach, describe, expect, it, test, vi } from "vitest";

import { selectCypressEnvironment } from "./cypress.js";

declare const suites: [typeof mockSuite];

const mockAfterEach = function (name: string, fn: () => void) {
	suites[0].afterEach(name, fn);
};

const mockBeforeEach = function (name: string, fn: () => void) {
	suites[0].beforeEach(name, fn);
};

const mockCypress = {};

const mockSuite = {
	afterEach: vi.fn<(...args: unknown[]) => void>(),
	beforeEach: vi.fn(),
};

const stubGlobals = (
	Cypress: object | undefined,
	afterEach: Function | undefined,
	beforeEach: Function | undefined,
) => {
	Object.defineProperties(globalThis, {
		afterEach: {
			value: afterEach,
			writable: true,
		},
		beforeEach: {
			value: beforeEach,
			writable: true,
		},
		Cypress: {
			value: Cypress,
			writable: true,
		},
		suites: {
			value: [mockSuite],
			writable: true,
		},
	});
};

describe("selectCypressEnvironment", () => {
	describe("detection", () => {
		test.each([
			[undefined, undefined, undefined, undefined],
			[undefined, mockAfterEach, mockBeforeEach, undefined],
			[mockCypress, undefined, undefined, undefined],
			[mockCypress, vi.fn(), vi.fn(), undefined],
			[
				mockCypress,
				mockAfterEach,
				mockBeforeEach,
				{
					afterEach: expect.any(Function),
					beforeEach: mockBeforeEach,
				},
			],
		])(
			"when Cypress is %o, afterEach is %o, and beforeEach is %o, returns %o",
			(Cypress, afterEach, beforeEach, expected) => {
				stubGlobals(Cypress, afterEach, beforeEach);

				const actual = selectCypressEnvironment({
					console: {},
				});

				expect(actual).toEqual(expected);
			},
		);
	});

	describe("afterEach", () => {
		const createContext = (
			state: string,
			statusInfo?: { outerStatus: string },
		) => ({
			currentTest: {
				_cypressTestStatusInfo: statusInfo,
				state,
			},
			test: {
				error: vi.fn(),
			},
		});

		const runAfterEach = (context: ReturnType<typeof createContext>) => {
			const error = new Error("Oh no!\nDetails");
			const callback = vi.fn((hooks) => {
				hooks.reportComplaint({ error, methodComplaints: [] });
			});

			selectCypressEnvironment({ console: {} })!.afterEach(callback);

			const hook = mockSuite.afterEach.mock.calls[0][0] as (
				this: unknown,
			) => void;

			hook.call(context);

			return { callback, error };
		};

		beforeEach(() => {
			stubGlobals(mockCypress, mockAfterEach, mockBeforeEach);
		});

		it("does not call the callback when the test did not pass", () => {
			const context = createContext("failed");

			const { callback } = runAfterEach(context);

			expect(callback).not.toHaveBeenCalled();
			expect(context.test.error).not.toHaveBeenCalled();
		});

		it("fails the test with an indented error when the test passed", () => {
			const context = createContext("passed");

			const { error } = runAfterEach(context);

			expect(context.test.error).toHaveBeenCalledWith(error);
			expect(error.message).toBe("Oh no!\n     Details");
		});

		it("does not add a status when the test has no Cypress status info", () => {
			const context = createContext("passed");

			runAfterEach(context);

			expect(context.currentTest._cypressTestStatusInfo).toBeUndefined();
		});

		it("marks the test's Cypress status as failed when it has status info", () => {
			const context = createContext("passed", { outerStatus: "passed" });

			runAfterEach(context);

			expect(context.currentTest._cypressTestStatusInfo).toEqual({
				outerStatus: "failed",
			});
		});
	});
});
