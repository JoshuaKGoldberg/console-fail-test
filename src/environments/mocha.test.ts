import { describe, expect, test, vi } from "vitest";

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
});
