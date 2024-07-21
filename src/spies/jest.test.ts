import { describe, expect, test, vi } from "vitest";

import { selectJestSpyFactory } from "./jest.js";

describe("selectJestSpyFactory", () => {
	describe("spyLibrary", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ fn: {} }, undefined],
			[{ fn: vi.fn() }, expect.any(Function)],
		])("when spyLibrary is %s, returns %s", (spyLibrary, expected) => {
			const actual = selectJestSpyFactory({
				console: {},
				spyLibrary,
			});

			expect(actual).toEqual(expected);
		});
	});

	describe("jest", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ fn: {} }, undefined],
			[{ fn: vi.fn() }, expect.any(Function)],
		])("when jest is %s, returns %s", (jest, expected) => {
			Object.defineProperty(globalThis, "jest", {
				value: jest,
				writable: true,
			});

			const actual = selectJestSpyFactory({ console: {} });

			expect(actual).toEqual(expected);
		});
	});
});
