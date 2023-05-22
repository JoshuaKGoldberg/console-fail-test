import { describe, expect, it } from "vitest";

import { formatComplaintCall } from "./formatComplaintCall.js";

describe("formatComplaintCall", () => {
	it.each([
		[[false], "false"],
		[[true], "true"],
		[[{}], "{}"],
		[[{ inner: {} }], '{"inner":{}}'],
		[
			(() => {
				const x = { prop: {} };
				x.prop = x;
				return [x];
			})(),
			"A recursive object with keys: prop",
		],
		[[1, "two", [3]], '1, "two", [3]'],
	])(`formats %p as %p`, (args, expected) => {
		const actual = formatComplaintCall(args);

		expect(actual).toBe(expected);
	});
});
