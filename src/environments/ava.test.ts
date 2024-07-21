import { describe, expect, test, vi } from "vitest";

import { selectAvaEnvironment } from "./ava.js";

const mockAva = {
	afterEach: vi.fn(),
	beforeEach: vi.fn(),
	cb: vi.fn(),
	failing: vi.fn(),
	meta: {
		file: "",
	},
	serial: {
		cb: vi.fn(),
	},
};

describe("selectAvaEnvironment", () => {
	describe("isAva", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ afterEach: vi.fn() }, undefined],
			[{ afterEach: vi.fn(), beforeEach: vi.fn() }, undefined],
			[
				{ afterEach: vi.fn(), beforeEach: vi.fn(), failing: vi.fn() },
				undefined,
			],
			[
				{ afterEach: vi.fn(), beforeEach: vi.fn(), failing: vi.fn(), meta: {} },
				undefined,
			],
			[
				{
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					failing: vi.fn(),
					meta: { file: "" },
				},
				undefined,
			],
			[
				{
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					failing: vi.fn(),
					meta: { file: "" },
					serial: {},
				},
				undefined,
			],
			[mockAva, expect.any(Object)],
		])("when testFramework is %o, returns %o", (testFramework, expected) => {
			const actual = selectAvaEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});
	});
});
