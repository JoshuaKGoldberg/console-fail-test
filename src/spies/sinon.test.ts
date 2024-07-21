import { describe, expect, test, vi } from "vitest";

import { selectSinonSpyFactory } from "./sinon.js";

describe("selectSinonSpyFactory", () => {
	describe("spyLibrary", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ spy: {} }, undefined],
			[{ spy: vi.fn() }, expect.any(Function)],
		])("when spyLibrary is %s, returns %s", (spyLibrary, expected) => {
			const actual = selectSinonSpyFactory({
				console: {},
				spyLibrary,
			});

			expect(actual).toEqual(expected);
		});
	});

	describe("sinon", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ spy: {} }, undefined],
			[{ spy: vi.fn() }, expect.any(Function)],
		])("when sinon is %s, returns %s", (sinon, expected) => {
			Object.defineProperty(globalThis, "sinon", {
				value: sinon,
				writable: true,
			});

			const actual = selectSinonSpyFactory({ console: {} });

			expect(actual).toEqual(expected);
		});
	});
});
