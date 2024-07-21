import { describe, expect, test, vi } from "vitest";

import { selectJasmineSpyFactory } from "./jasmine.js";

describe("selectJasmineSpyFactory", () => {
	describe("spyLibrary", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ createSpy: {} }, undefined],
			[{ createSpy: vi.fn() }, expect.any(Function)],
		])("when spyLibrary is %s, returns %s", (spyLibrary, expected) => {
			const actual = selectJasmineSpyFactory({
				console: {},
				spyLibrary,
			});

			expect(actual).toEqual(expected);
		});
	});

	describe("jasmine", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ createSpy: {} }, undefined],
			[{ createSpy: vi.fn() }, expect.any(Function)],
		])("when jasmine is %s, returns %s", (jasmine, expected) => {
			Object.defineProperty(globalThis, "jasmine", {
				value: jasmine,
				writable: true,
			});

			const actual = selectJasmineSpyFactory({ console: {} });

			expect(actual).toEqual(expected);
		});
	});
});
