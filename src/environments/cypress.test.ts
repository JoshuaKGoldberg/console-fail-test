import { describe, expect, test, vi } from "vitest";

import { selectCypressEnvironment } from "./cypress.js";

declare const suites: [
	{ afterEach: typeof mockAfterEach; beforeEach: typeof mockBeforeEach },
];

const mockAfterEach = function (name: string, fn: () => void) {
	suites[0].afterEach(name, fn);
};

const mockBeforeEach = function (name: string, fn: () => void) {
	suites[0].beforeEach(name, fn);
};

const mockCypress = {};

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
	});
};

describe("selectCypressEnvironment", () => {
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

	test("does not map spy calls, unlike Mocha", () => {
		stubGlobals(mockCypress, mockAfterEach, mockBeforeEach);

		const actual = selectCypressEnvironment({
			console: {},
		});

		expect(actual).not.toHaveProperty("mapSpyCalls");
	});
});
