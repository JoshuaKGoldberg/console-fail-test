import { describe, expect, test } from "vitest";

import { createTestCafeHooks } from "./createTestCafeHooks.js";

describe("createTestCafeHooks", () => {
	test("does not throw when the console is not called", () => {
		const hooks = createTestCafeHooks();

		hooks.before();

		expect(() => {
			hooks.after();
		}).not.toThrow();
	});

	test("does not throw when an allowed console method is called", () => {
		const hooks = createTestCafeHooks({ console: { warn: true } });

		hooks.before();
		console.warn("Allowed.");

		expect(() => {
			hooks.after();
		}).not.toThrow();
	});

	test("throws when the console is called", () => {
		const hooks = createTestCafeHooks();

		hooks.before();
		console.log("Whoops!");

		expect(() => {
			hooks.after();
		}).toThrow("Your test called the following console method");
	});
});
