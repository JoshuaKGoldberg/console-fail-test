import { describe, expect, it, test, vi } from "vitest";

import { selectPlaywrightEnvironment } from "./playwright.js";

const createMockPlaywrightTest = () =>
	Object.assign(() => undefined, {
		afterEach: vi.fn<(callback: () => void) => void>(),
		beforeEach: vi.fn<(callback: () => void) => void>(),
		describe: vi.fn(),
		extend: vi.fn(),
		info: vi.fn(),
		step: vi.fn(),
		use: vi.fn(),
	});

describe("selectPlaywrightEnvironment", () => {
	describe("isPlaywrightTest", () => {
		const notAFunction = {
			afterEach: vi.fn(),
			beforeEach: vi.fn(),
			describe: vi.fn(),
			extend: vi.fn(),
			info: vi.fn(),
			step: vi.fn(),
			use: vi.fn(),
		};

		test.each([
			[undefined, undefined],
			[{}, undefined],
			[() => undefined, undefined],
			[Object.assign(() => undefined, { afterEach: vi.fn() }), undefined],
			[
				Object.assign(() => undefined, {
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
				}),
				undefined,
			],
			[
				Object.assign(() => undefined, {
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					describe: vi.fn(),
				}),
				undefined,
			],
			[
				Object.assign(() => undefined, {
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					describe: vi.fn(),
					extend: vi.fn(),
				}),
				undefined,
			],
			[
				Object.assign(() => undefined, {
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					describe: vi.fn(),
					extend: vi.fn(),
					info: vi.fn(),
				}),
				undefined,
			],
			[
				Object.assign(() => undefined, {
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					describe: vi.fn(),
					extend: vi.fn(),
					info: vi.fn(),
					step: vi.fn(),
				}),
				undefined,
			],
			[notAFunction, undefined],
			[createMockPlaywrightTest(), expect.any(Object)],
		])("when testFramework is %s, returns %s", (testFramework, expected) => {
			const actual = selectPlaywrightEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});
	});

	describe("hooks", () => {
		it("registers hook callbacks that take no parameters", () => {
			const playwrightTest = createMockPlaywrightTest();

			const environment = selectPlaywrightEnvironment({
				console: {},
				testFramework: playwrightTest,
			})!;

			environment.afterEach(vi.fn());
			environment.beforeEach(vi.fn());

			// Playwright resolves hook parameters as fixtures, so there must be none
			expect(playwrightTest.afterEach.mock.calls[0][0]).toHaveLength(0);
			expect(playwrightTest.beforeEach.mock.calls[0][0]).toHaveLength(0);
		});

		it("calls the callbacks when the registered hooks run", () => {
			const playwrightTest = createMockPlaywrightTest();

			const environment = selectPlaywrightEnvironment({
				console: {},
				testFramework: playwrightTest,
			})!;

			const afterEachCallback = vi.fn();
			const beforeEachCallback = vi.fn();

			environment.afterEach(afterEachCallback);
			environment.beforeEach(beforeEachCallback);

			playwrightTest.beforeEach.mock.calls[0][0]();
			playwrightTest.afterEach.mock.calls[0][0]();

			expect(beforeEachCallback).toHaveBeenCalledTimes(1);
			expect(afterEachCallback).toHaveBeenCalledWith();
		});
	});
});
