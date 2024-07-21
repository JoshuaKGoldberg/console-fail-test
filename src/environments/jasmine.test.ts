import { describe, expect, test, vi } from "vitest";

import { selectJasmineEnvironment } from "./jasmine.js";

const mockAfterEach = vi.fn();
const mockBeforeEach = vi.fn();
const mockJasmine = { Spec: {} };

describe("selectJasmineEnvironment", () => {
	describe("isJasmine", () => {
		test.each([
			[undefined, undefined, undefined, undefined],
			[vi.fn(), vi.fn(), undefined, undefined],
			[vi.fn(), mockAfterEach, undefined, undefined],
			[mockAfterEach, mockBeforeEach, {}, undefined],
			[mockAfterEach, mockBeforeEach, mockJasmine, expect.any(Object)],
		])(
			"when afterEach is %o, beforeEach is %o, and jasmine is %o, returns %o",
			(afterEach, beforeEach, jasmine, expected) => {
				Object.defineProperties(globalThis, {
					afterEach: {
						value: afterEach,
						writable: true,
					},
					beforeEach: {
						value: beforeEach,
						writable: true,
					},
					jasmine: {
						value: jasmine,
						writable: true,
					},
				});
				const actual = selectJasmineEnvironment({
					console: {},
				});

				expect(actual).toEqual(expected);
			},
		);
	});
});
