import { describe, expect, it, vi } from "vitest";

import { selectSpyFactory } from "./selectSpyFactory.js";

vi.mock("./jasmine.js", () => ({
	selectJasmineSpyFactory: () => undefined,
}));

vi.mock("./jest.js", () => ({
	selectJestSpyFactory: () => undefined,
}));

vi.mock("./vitest.js", () => ({
	selectVitestSpyFactory: () => undefined,
}));

const mockSelectFallbackSpyFactory = vi.fn();

vi.mock("./fallback.js", () => ({
	get selectFallbackSpyFactory() {
		return () => mockSelectFallbackSpyFactory();
	},
}));

const mockSelectSinonSpyFactory = vi.fn();

vi.mock("./sinon.js", () => ({
	get selectSinonSpyFactory() {
		return () => mockSelectSinonSpyFactory();
	},
}));

describe("selectSpyFactory", () => {
	it("throws an error when given spyLibrary name that does not exist", () => {
		expect(() =>
			selectSpyFactory({
				console: {},
				spyLibrary: "unknown",
			}),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Requested spy library 'unknown' not known by name in console-fail-test.]`,
		);
	});

	it("throws an error when given a spyLibrary name for an inactive library", () => {
		mockSelectSinonSpyFactory.mockReturnValueOnce(undefined);

		expect(() =>
			selectSpyFactory({
				console: {},
				spyLibrary: "sinon",
			}),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Requested spy library 'sinon' does not seem to be active.]`,
		);
	});

	it("returns a factory when given a spyLibrary name for an active library", () => {
		const sinon = { isSinon: true };
		mockSelectSinonSpyFactory.mockReturnValueOnce(sinon);

		const actual = selectSpyFactory({
			console: {},
			spyLibrary: "sinon",
		});

		expect(actual).toBe(sinon);
	});

	it("returns a factory when an active library is inferred", () => {
		const sinon = { isSinon: true };
		mockSelectSinonSpyFactory.mockReturnValueOnce(sinon);

		const actual = selectSpyFactory({
			console: {},
		});

		expect(actual).toBe(sinon);
	});

	it("returns the fallback factory when no active library is inferred", () => {
		const mockFallbackSpyFactory = { isFallback: true };
		mockSelectFallbackSpyFactory.mockReturnValueOnce(mockFallbackSpyFactory);
		mockSelectSinonSpyFactory.mockReturnValueOnce(undefined);

		const actual = selectSpyFactory({
			console: {},
		});

		expect(actual).toBe(mockFallbackSpyFactory);
	});
});
