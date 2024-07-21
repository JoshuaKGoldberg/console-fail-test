import { describe, expect, test } from "vitest";

import { formatMethodComplaint } from "./formatMethodComplaint.js";

describe("formatMethodComplaint", () => {
	test("one single-line complaint", () => {
		const actual = formatMethodComplaint(["log", [["abc"]]]);

		expect(actual).toMatchInlineSnapshot(`
			"  * log (1 call)
			    > Call 0: "abc""
		`);
	});

	test("multiple single-line complaint", () => {
		const actual = formatMethodComplaint(["log", [["abc"], ["def", "ghi"]]]);

		expect(actual).toMatchInlineSnapshot(`
			"  * log (2 calls)
			    > Call 0: "abc"
			    > Call 1: "def", "ghi""
		`);
	});

	test("multiple multi-line complaint", () => {
		const actual = formatMethodComplaint([
			"log",
			[["abc\ndef"], ["def\nghi", "jkl"]],
		]);

		expect(actual).toMatchInlineSnapshot(`
			"  * log (2 calls)
			    > Call 0: "abc\\ndef"
			    > Call 1: "def\\nghi", "jkl""
		`);
	});

	test("more complaints than the line threshold", () => {
		const actual = formatMethodComplaint([
			"log",
			new Array(4).fill(undefined).map((_, index) => [`${index}`]),
		]);

		expect(actual).toMatchInlineSnapshot(`
			"  * log (4 calls)
			    > Call 0: "0"
			    > Call 1: "1"
			    > Call 2: "2"
			    > Call ...1 more"
		`);
	});
});
