import { afterEach, describe, expect, it, test, vi } from "vitest";

import { selectNodeTestEnvironment } from "./nodeTest.js";

declare const process: {
	getBuiltinModule(id: string): unknown;
};

type HookCallback = (context: { fullName: string }) => void;

// vi.fn() reserves .mock, so the base function is a plain one
const createMockNodeTest = () => {
	const nodeTest = Object.assign(() => undefined, {
		afterEach: vi.fn<(callback: HookCallback) => void>(),
		beforeEach: vi.fn<(callback: HookCallback) => void>(),
		describe: vi.fn(),
		it: vi.fn(),
		mock: {},
		run: vi.fn(),
	});

	// The node:test module is the test function itself, with .test referencing itself
	return Object.assign(nodeTest, { test: nodeTest });
};

const mockNodeTest = createMockNodeTest();

const createHookCallbacks = (nodeTest = mockNodeTest) => {
	const environment = selectNodeTestEnvironment({
		console: {},
		testFramework: nodeTest,
	})!;

	const afterEachCallback = vi.fn();
	const beforeEachCallback = vi.fn();

	environment.afterEach(afterEachCallback);
	environment.beforeEach(beforeEachCallback);

	return {
		afterEachCallback,
		beforeEachCallback,
		runAfterEach: (fullName: string) => {
			nodeTest.afterEach.mock.calls[0][0]({ fullName });
		},
		runBeforeEach: (fullName: string) => {
			nodeTest.beforeEach.mock.calls[0][0]({ fullName });
		},
	};
};

describe("selectNodeTestEnvironment", () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	describe("isNodeTest", () => {
		const notSelfReferencing = Object.assign(createMockNodeTest(), {
			test: vi.fn(),
		});
		const notAFunction = {
			afterEach: vi.fn(),
			beforeEach: vi.fn(),
			describe: vi.fn(),
			it: vi.fn(),
			mock: {},
			run: vi.fn(),
			test: vi.fn(),
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
					it: vi.fn(),
					mock: {},
					run: vi.fn(),
				}),
				undefined,
			],
			[notSelfReferencing, undefined],
			[notAFunction, undefined],
			[mockNodeTest, expect.any(Object)],
		])("when testFramework is %s, returns %s", (testFramework, expected) => {
			const actual = selectNodeTestEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});
	});

	describe("auto-detection", () => {
		it("returns undefined when a different received module is passed", () => {
			vi.stubEnv("NODE_TEST_WORKER_ID", "1");

			const actual = selectNodeTestEnvironment({
				console: {},
				testFramework: { afterEach: vi.fn(), beforeEach: vi.fn() },
			});

			expect(actual).toBeUndefined();
		});

		it("returns undefined when no node:test environment variables are set", () => {
			vi.stubEnv("NODE_TEST_CONTEXT", undefined);
			vi.stubEnv("NODE_TEST_WORKER_ID", undefined);
			const getBuiltinModule = vi.spyOn(process, "getBuiltinModule");

			const actual = selectNodeTestEnvironment({ console: {} });

			expect(actual).toBeUndefined();
			expect(getBuiltinModule).not.toHaveBeenCalled();
		});

		it("returns undefined when getBuiltinModule does not return node:test", () => {
			vi.stubEnv("NODE_TEST_WORKER_ID", "1");
			vi.spyOn(process, "getBuiltinModule").mockReturnValue({});

			const actual = selectNodeTestEnvironment({ console: {} });

			expect(actual).toBeUndefined();
		});

		it("returns an environment when NODE_TEST_WORKER_ID is set and getBuiltinModule returns node:test", () => {
			vi.stubEnv("NODE_TEST_WORKER_ID", "1");
			const getBuiltinModule = vi
				.spyOn(process, "getBuiltinModule")
				.mockReturnValue(mockNodeTest);

			const actual = selectNodeTestEnvironment({ console: {} });

			expect(actual).toEqual(expect.any(Object));
			expect(getBuiltinModule).toHaveBeenCalledWith("node:test");
		});

		it("returns an environment when NODE_TEST_CONTEXT is set and requested by name", () => {
			vi.stubEnv("NODE_TEST_CONTEXT", "child-v8");
			vi.spyOn(process, "getBuiltinModule").mockReturnValue(mockNodeTest);

			const actual = selectNodeTestEnvironment({
				console: {},
				testFramework: "node:test",
			});

			expect(actual).toEqual(expect.any(Object));
		});
	});

	describe("hooks", () => {
		it("calls both callbacks for a top-level test", () => {
			const {
				afterEachCallback,
				beforeEachCallback,
				runAfterEach,
				runBeforeEach,
			} = createHookCallbacks();

			runBeforeEach("top-level");
			runAfterEach("top-level");

			expect(beforeEachCallback).toHaveBeenCalledTimes(1);
			expect(afterEachCallback).toHaveBeenCalledTimes(1);
		});

		it("calls both callbacks for a test nested in a describe", () => {
			const {
				afterEachCallback,
				beforeEachCallback,
				runAfterEach,
				runBeforeEach,
			} = createHookCallbacks();

			runBeforeEach("suite > nested");
			runAfterEach("suite > nested");

			expect(beforeEachCallback).toHaveBeenCalledTimes(1);
			expect(afterEachCallback).toHaveBeenCalledTimes(1);
		});

		it("only calls the callbacks for the outermost test when a test has subtests", () => {
			const {
				afterEachCallback,
				beforeEachCallback,
				runAfterEach,
				runBeforeEach,
			} = createHookCallbacks();

			runBeforeEach("parent");
			runBeforeEach("parent > subtest");
			runAfterEach("parent > subtest");

			expect(beforeEachCallback).toHaveBeenCalledTimes(1);
			expect(afterEachCallback).not.toHaveBeenCalled();

			runAfterEach("parent");

			expect(afterEachCallback).toHaveBeenCalledTimes(1);
		});

		it("resets the active test when the afterEach callback throws", () => {
			const {
				afterEachCallback,
				beforeEachCallback,
				runAfterEach,
				runBeforeEach,
			} = createHookCallbacks();

			afterEachCallback.mockImplementationOnce(() => {
				throw new Error("Oh no!");
			});

			runBeforeEach("first");
			expect(() => {
				runAfterEach("first");
			}).toThrow("Oh no!");

			runBeforeEach("second");
			runAfterEach("second");

			expect(beforeEachCallback).toHaveBeenCalledTimes(2);
			expect(afterEachCallback).toHaveBeenCalledTimes(2);
		});
	});
});
