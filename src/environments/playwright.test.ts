import { describe, expect, it, test, vi } from "vitest";

import { selectPlaywrightEnvironment } from "./playwright.js";

const createMockPlaywrightTest = () =>
	Object.assign(() => undefined, {
		afterEach: vi.fn<(callback: () => void) => void>(),
		beforeEach: vi.fn(),
		info: vi.fn(),
		step: vi.fn(),
	});

describe("selectPlaywrightEnvironment", () => {
	describe("isPlaywrightTest", () => {
		test.each([
			[undefined, undefined],
			[
				{
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					info: vi.fn(),
					step: vi.fn(),
				},
				undefined,
			],
			[
				Object.assign(() => undefined, {
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
				}),
				undefined,
			],
			[test, undefined],
			[createMockPlaywrightTest(), expect.any(Object)],
		])("when testFramework is %o, returns %o", (testFramework, expected) => {
			const actual = selectPlaywrightEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});
	});

	it("registers an afterEach hook that takes no parameters", () => {
		const playwrightTest = createMockPlaywrightTest();
		const callback = vi.fn();

		selectPlaywrightEnvironment({
			console: {},
			testFramework: playwrightTest,
		})!.afterEach(callback);

		const hook = playwrightTest.afterEach.mock.calls[0][0];
		hook();

		expect(hook).toHaveLength(0);
		expect(callback).toHaveBeenCalledWith();
	});
});
