import { describe, expect, it, vi } from "vitest";

import { selectTestFramework } from "./selectTestFramework.js";

vi.mock("./jasmine.js", () => ({
	selectJasmineEnvironment: () => undefined,
}));

vi.mock("./vitest.js", () => ({
	selectVitestEnvironment: () => undefined,
}));

const mockSelectJestEnvironment = vi.fn();

vi.mock("./jest.js", () => ({
	get selectJestEnvironment() {
		return () => mockSelectJestEnvironment();
	},
}));

describe("selectTestFramework", () => {
	it("throws an error when given testFramework name that does not exist", () => {
		expect(() =>
			selectTestFramework({
				console: {},
				testFramework: "unknown",
			}),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Requested test framework 'unknown' not known by name in console-fail-test.]`,
		);
	});

	it("throws an error when given a testFramework name for an inactive environment", () => {
		mockSelectJestEnvironment.mockReturnValueOnce(undefined);

		expect(() =>
			selectTestFramework({
				console: {},
				testFramework: "jest",
			}),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Requested test framework 'jest' does not seem to be active.]`,
		);
	});

	it("returns an environment when given a testFramework name for an active framework", () => {
		const jest = { isJest: true };
		mockSelectJestEnvironment.mockReturnValueOnce(jest);

		const actual = selectTestFramework({
			console: {},
			testFramework: "jest",
		});

		expect(actual).toBe(jest);
	});

	it("returns an environment when an active framework is inferred", () => {
		const jest = { isJest: true };
		mockSelectJestEnvironment.mockReturnValueOnce(jest);

		const actual = selectTestFramework({
			console: {},
		});

		expect(actual).toBe(jest);
	});
});
