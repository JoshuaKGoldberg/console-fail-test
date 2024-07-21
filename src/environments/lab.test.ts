import { describe, expect, test, vi } from "vitest";

import { selectLabEnvironment } from "./lab.js";

const mockLabFramework = {
	afterEach: vi.fn(),
	beforeEach: vi.fn(),
	setOnly: vi.fn(),
	_current: { tests: [] },
};

describe("selectLabEnvironment", () => {
	describe("isLab", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ afterEach: vi.fn() }, undefined],
			[{ afterEach: vi.fn(), beforeEach: vi.fn() }, undefined],
			[
				{ afterEach: vi.fn(), beforeEach: vi.fn(), setOnly: vi.fn() },
				undefined,
			],
			[
				{
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					setOnly: vi.fn(),
					_current: {},
				},
				undefined,
			],
			[mockLabFramework, expect.any(Object)],
		])("when testFramework is %s, returns %s", (testFramework, expected) => {
			const actual = selectLabEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});
	});
});
