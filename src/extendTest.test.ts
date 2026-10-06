import { describe, expect, test, vi } from "vitest";

import { extendTest } from "./extendTest.js";

describe("extendTest", () => {
	test("adds an automatic consoleFailTest fixture", () => {
		const extended = {};
		const mockTest = { extend: vi.fn().mockReturnValue(extended) };

		const actual = extendTest(mockTest);

		expect(actual).toBe(extended);
		expect(mockTest.extend).toHaveBeenCalledWith({
			consoleFailTest: [expect.any(Function), { auto: true }],
		});
	});

	describe("with Vitest", () => {
		const checkedTest = extendTest(test, { console: { warn: true } });

		checkedTest("passes when the console is not called", () => {
			// Nothing to see here
		});

		checkedTest("passes when an allowed console method is called", () => {
			console.warn("Allowed.");
		});

		checkedTest.fails("fails when the console is called", () => {
			console.log("Whoops!");
		});
	});
});
