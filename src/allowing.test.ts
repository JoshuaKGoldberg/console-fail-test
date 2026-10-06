import { describe, expect, it } from "vitest";

import { filterAllowedCalls, isMethodFullyAllowed } from "./allowing.js";

describe("isMethodFullyAllowed", () => {
	it.each([
		[undefined, false],
		[false, false],
		[true, true],
		[{ allow: [] }, false],
	])("returns %j for %j", (setting, expected) => {
		expect(isMethodFullyAllowed(setting)).toBe(expected);
	});
});

describe("filterAllowedCalls", () => {
	const calls = [["I know what I'm doing"], ["Unexpected!", 123]];

	it("returns all calls when there is no setting", () => {
		expect(filterAllowedCalls(calls, undefined)).toEqual(calls);
	});

	it("returns all calls when the setting is false", () => {
		expect(filterAllowedCalls(calls, false)).toEqual(calls);
	});

	it("filters calls containing a string pattern", () => {
		expect(filterAllowedCalls(calls, { allow: ["know what"] })).toEqual([
			["Unexpected!", 123],
		]);
	});

	it("filters calls matching a RegExp pattern", () => {
		expect(filterAllowedCalls(calls, { allow: [/^Unexpected! \d+$/] })).toEqual(
			[["I know what I'm doing"]],
		);
	});

	it("filters calls matching any of multiple patterns", () => {
		expect(
			filterAllowedCalls(calls, { allow: ["know", /Unexpected/] }),
		).toEqual([]);
	});
});
