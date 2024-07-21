import { describe, expect, test, vi } from "vitest";

import { selectJestEnvironment } from "./jest.js";

const mockAfterEach = vi.fn();
const mockBeforeEach = vi.fn();
const mockJest = {};

describe("selectJestEnvironment", () => {
	describe("isJest", () => {
		test.each([
			[undefined, undefined, undefined, undefined],
			[vi.fn(), vi.fn(), undefined, undefined],
			[vi.fn(), mockAfterEach, undefined, undefined],
			[mockAfterEach, mockBeforeEach, mockJest, expect.any(Object)],
		])(
			"when afterEach is %o, beforeEach is %o, and jest is %o, returns %o",
			(afterEach, beforeEach, jest, expected) => {
				Object.defineProperties(globalThis, {
					afterEach: {
						value: afterEach,
						writable: true,
					},
					beforeEach: {
						value: beforeEach,
						writable: true,
					},
					jest: {
						value: jest,
						writable: true,
					},
				});
				const actual = selectJestEnvironment({
					console: {},
				});

				expect(actual).toEqual(expected);
			},
		);
	});
});
