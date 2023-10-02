"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const formatComplaintCall_1 = require("./formatComplaintCall");
(0, vitest_1.describe)("formatComplaintCall", () => {
	vitest_1.it.each([
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
		const actual = (0, formatComplaintCall_1.formatComplaintCall)(args);
		(0, vitest_1.expect)(actual).toBe(expected);
	});
});
