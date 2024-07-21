import { describe, expect, it } from "vitest";

import { createComplaint } from "./createComplaint.js";

describe("createComplaint", () => {
	it("returns an error with the formatted method complaints", () => {
		const methodCalls = [["abc", "def"]];
		const methodName = "log";
		const actual = createComplaint([[methodName, methodCalls]]);

		expect(actual).toEqual({
			error: expect.objectContaining({
				message: expect.stringMatching(/Your test called the following/),
			}),
			methodComplaints: [{ methodCalls, methodName }],
		});
	});
});
