import { describe, expect, it, vi } from "vitest";

import { createMethodCallComplaintReporter } from "./createMethodCallComplaintReporter.js";

describe("createMethodCallComplaintReporter", () => {
	it("does not fail when there are no method complaints", () => {
		const fail = vi.fn();

		createMethodCallComplaintReporter(fail)({
			error: new Error("Oh no!"),
			methodComplaints: [],
		});

		expect(fail).not.toHaveBeenCalled();
	});

	it("fails once per call across multiple methods", () => {
		const fail = vi.fn();

		createMethodCallComplaintReporter(fail)({
			error: new Error("Oh no!"),
			methodComplaints: [
				{
					methodCalls: [["abc", "def"], ["ghi"]],
					methodName: "log",
				},
				{
					methodCalls: [[]],
					methodName: "warn",
				},
			],
		});

		expect(fail.mock.calls).toEqual([
			['console.log was called with: "abc", "def"'],
			['console.log was called with: "ghi"'],
			["console.warn was called with: "],
		]);
	});
});
