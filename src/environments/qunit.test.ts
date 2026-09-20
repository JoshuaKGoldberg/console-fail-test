import { afterEach, describe, expect, it, test, vi } from "vitest";

import { selectQUnitEnvironment } from "./qunit.js";

type HookCallback = (assert: MockQUnitAssert) => void;

interface MockQUnitAssert {
	pushResult: ReturnType<typeof vi.fn>;
}

const createMockQUnit = () => ({
	config: {},
	hooks: {
		afterEach: vi.fn<(callback: HookCallback) => void>(),
		beforeEach: vi.fn<(callback: HookCallback) => void>(),
	},
	module: vi.fn(),
	test: vi.fn(),
});

const mockQUnit = createMockQUnit();

const stubGlobalQUnit = (value: unknown) => {
	Object.defineProperty(globalThis, "QUnit", {
		configurable: true,
		value,
		writable: true,
	});
};

describe("selectQUnitEnvironment", () => {
	afterEach(() => {
		// @ts-expect-error -- QUnit is only defined on globalThis by these tests
		delete globalThis.QUnit;
	});

	describe("isQUnit", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[() => undefined, undefined],
			[{ config: {} }, undefined],
			[{ config: {}, hooks: {} }, undefined],
			[{ config: {}, hooks: { afterEach: vi.fn() } }, undefined],
			[
				{ config: {}, hooks: { afterEach: vi.fn(), beforeEach: vi.fn() } },
				undefined,
			],
			[
				{
					config: {},
					hooks: { afterEach: vi.fn(), beforeEach: vi.fn() },
					module: vi.fn(),
				},
				undefined,
			],
			[
				{
					config: {},
					hooks: { afterEach: vi.fn(), beforeEach: vi.fn() },
					test: vi.fn(),
				},
				undefined,
			],
			[
				{
					config: {},
					hooks: null,
					module: vi.fn(),
					test: vi.fn(),
				},
				undefined,
			],
			[mockQUnit, expect.any(Object)],
		])("when testFramework is %s, returns %s", (testFramework, expected) => {
			const actual = selectQUnitEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});
	});

	describe("auto-detection", () => {
		it("returns undefined when a different received module is passed", () => {
			stubGlobalQUnit(mockQUnit);

			const actual = selectQUnitEnvironment({
				console: {},
				testFramework: { afterEach: vi.fn(), beforeEach: vi.fn() },
			});

			expect(actual).toBeUndefined();
		});

		it("returns undefined when there is no global QUnit", () => {
			const actual = selectQUnitEnvironment({ console: {} });

			expect(actual).toBeUndefined();
		});

		it("returns undefined when the global QUnit is not a QUnit module", () => {
			stubGlobalQUnit({});

			const actual = selectQUnitEnvironment({ console: {} });

			expect(actual).toBeUndefined();
		});

		it("returns an environment when there is a global QUnit", () => {
			stubGlobalQUnit(mockQUnit);

			const actual = selectQUnitEnvironment({ console: {} });

			expect(actual).toEqual(expect.any(Object));
		});

		it("returns an environment when there is a global QUnit and it is requested by name", () => {
			stubGlobalQUnit(mockQUnit);

			const actual = selectQUnitEnvironment({
				console: {},
				testFramework: "qunit",
			});

			expect(actual).toEqual(expect.any(Object));
		});
	});

	describe("beforeEach", () => {
		it("calls the callback when the global beforeEach hook runs", () => {
			const qunit = createMockQUnit();
			const environment = selectQUnitEnvironment({
				console: {},
				testFramework: qunit,
			})!;
			const callback = vi.fn();

			environment.beforeEach(callback);

			expect(callback).not.toHaveBeenCalled();

			qunit.hooks.beforeEach.mock.calls[0][0]({ pushResult: vi.fn() });

			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	describe("afterEach", () => {
		it("calls the callback when the global afterEach hook runs", () => {
			const qunit = createMockQUnit();
			const environment = selectQUnitEnvironment({
				console: {},
				testFramework: qunit,
			})!;
			const callback = vi.fn();

			environment.afterEach(callback);

			expect(callback).not.toHaveBeenCalled();

			qunit.hooks.afterEach.mock.calls[0][0]({ pushResult: vi.fn() });

			expect(callback).toHaveBeenCalledTimes(1);
		});

		it("reports a complaint as a failed assertion on the test", () => {
			const qunit = createMockQUnit();
			const environment = selectQUnitEnvironment({
				console: {},
				testFramework: qunit,
			})!;
			const assert = { pushResult: vi.fn() };

			environment.afterEach((hooks) => {
				hooks!.reportComplaint!({
					error: new Error("Oh no!"),
					methodComplaints: [],
				});
			});

			qunit.hooks.afterEach.mock.calls[0][0](assert);

			expect(assert.pushResult).toHaveBeenCalledWith({
				message: "Oh no!",
				result: false,
			});
		});
	});
});
