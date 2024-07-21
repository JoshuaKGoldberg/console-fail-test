import { describe, expect, it, vi } from "vitest";

import { selectFallbackSpyFactory } from "./fallback.js";

describe("selectFallbackSpyFactory", () => {
	it("passes through a call to the original method", () => {
		const container = {
			key: (input: string) => `${input}-output`,
		};

		const spy = selectFallbackSpyFactory()(container, "key");

		const actual = container.key("abc");

		expect(actual).toEqual("abc-output");
		expect(spy.getCalls()).toEqual([["abc"]]);
	});

	it("passes through multiple calls to the original method", () => {
		const container = {
			key: (input: string) => `${input}-output`,
		};

		const spy = selectFallbackSpyFactory()(container, "key");

		container.key("abc");
		const actual = container.key("def");

		expect(actual).toEqual("def-output");
		expect(spy.getCalls()).toEqual([["abc"], ["def"]]);
	});

	it("clears method calls through a call to the original method", () => {
		const originalMethod = (input: string) => `${input}-output`;
		const container = { key: originalMethod };

		const spy = selectFallbackSpyFactory()(container, "key");

		spy.restore();

		expect(container.key).toBe(originalMethod);
	});
});
