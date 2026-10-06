import { describe, expect, it, test, vi } from "vitest";

import { selectTapeEnvironment } from "./tape.js";

interface MockTapeTest {
	fail: ReturnType<typeof vi.fn>;
	once: ReturnType<typeof vi.fn>;
	teardown?: ReturnType<typeof vi.fn>;
}

type PushListener = (test: MockTapeTest) => void;

const createMockTapeTest = (): MockTapeTest => ({
	fail: vi.fn(),
	once: vi.fn(),
	teardown: vi.fn(),
});

const createMockTapeHarness = () =>
	Object.assign(() => undefined, {
		_results: {
			on: vi.fn<(event: "_push", listener: PushListener) => void>(),
		},
		createStream: vi.fn(),
		onFailure: vi.fn(),
		onFinish: vi.fn(),
		only: vi.fn(),
	});

const createMockTape = (harness = createMockTapeHarness()) =>
	Object.assign(() => undefined, {
		createStream: vi.fn(),
		getHarness: () => harness,
		onFailure: vi.fn(),
		onFinish: vi.fn(),
		only: vi.fn(),
	});

const pushTest = (
	harness: ReturnType<typeof createMockTapeHarness>,
	tapeTest = createMockTapeTest(),
) => {
	for (const [, listener] of harness._results.on.mock.calls) {
		listener(tapeTest);
	}

	return tapeTest;
};

describe("selectTapeEnvironment", () => {
	describe("isTape", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[() => undefined, undefined],
			[Object.assign(() => undefined, { createStream: vi.fn() }), undefined],
			[
				Object.assign(() => undefined, {
					createStream: vi.fn(),
					onFailure: vi.fn(),
				}),
				undefined,
			],
			[
				Object.assign(() => undefined, {
					createStream: vi.fn(),
					onFailure: vi.fn(),
					onFinish: vi.fn(),
				}),
				undefined,
			],
			[
				Object.assign(() => undefined, {
					createStream: vi.fn(),
					onFailure: vi.fn(),
					onFinish: vi.fn(),
					only: vi.fn(),
				}),
				undefined,
			],
			[
				Object.assign(() => undefined, {
					_results: {},
					createStream: vi.fn(),
					onFailure: vi.fn(),
					onFinish: vi.fn(),
					only: vi.fn(),
				}),
				undefined,
			],
			[
				{
					_results: { on: vi.fn() },
					createStream: vi.fn(),
					onFailure: vi.fn(),
					onFinish: vi.fn(),
					only: vi.fn(),
				},
				undefined,
			],
			[createMockTapeHarness(), expect.any(Object)],
			[createMockTape(), expect.any(Object)],
		])("when testFramework is %s, returns %s", (testFramework, expected) => {
			const actual = selectTapeEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});

		it("returns undefined when getHarness does not return a harness", () => {
			const actual = selectTapeEnvironment({
				console: {},
				testFramework: Object.assign(() => undefined, {
					createStream: vi.fn(),
					getHarness: () => ({}),
					onFailure: vi.fn(),
					onFinish: vi.fn(),
					only: vi.fn(),
				}),
			});

			expect(actual).toBeUndefined();
		});
	});

	describe("beforeEach", () => {
		it("calls the callback when a pushed test is about to run", () => {
			const harness = createMockTapeHarness();
			const environment = selectTapeEnvironment({
				console: {},
				testFramework: createMockTape(harness),
			})!;
			const callback = vi.fn();

			environment.beforeEach(callback);

			const tapeTest = pushTest(harness);

			expect(callback).not.toHaveBeenCalled();
			expect(tapeTest.once).toHaveBeenCalledWith(
				"prerun",
				expect.any(Function),
			);

			tapeTest.once.mock.calls[0][1]();

			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	describe("afterEach", () => {
		it("calls the callback when a pushed test is torn down", () => {
			const harness = createMockTapeHarness();
			const environment = selectTapeEnvironment({
				console: {},
				testFramework: harness,
			})!;
			const callback = vi.fn();

			environment.afterEach(callback);

			const tapeTest = pushTest(harness);

			expect(callback).not.toHaveBeenCalled();
			expect(tapeTest.once).not.toHaveBeenCalled();

			tapeTest.teardown!.mock.calls[0][0]();

			expect(callback).toHaveBeenCalledTimes(1);
		});

		it("calls the callback when a pushed test without teardown ends", () => {
			const harness = createMockTapeHarness();
			const environment = selectTapeEnvironment({
				console: {},
				testFramework: harness,
			})!;
			const callback = vi.fn();

			environment.afterEach(callback);

			const tapeTest = pushTest(harness, { fail: vi.fn(), once: vi.fn() });

			expect(callback).not.toHaveBeenCalled();
			expect(tapeTest.once).toHaveBeenCalledWith("end", expect.any(Function));

			tapeTest.once.mock.calls[0][1]();

			expect(callback).toHaveBeenCalledTimes(1);
		});

		it("reports a complaint as a failure per console method call", () => {
			const harness = createMockTapeHarness();
			const environment = selectTapeEnvironment({
				console: {},
				testFramework: harness,
			})!;

			environment.afterEach((hooks) => {
				hooks!.reportComplaint!({
					error: new Error("Oh no!"),
					methodComplaints: [
						{
							methodCalls: [["abc", "def"], ["ghi"]],
							methodName: "log",
						},
					],
				});
			});

			const tapeTest = pushTest(harness);

			tapeTest.teardown!.mock.calls[0][0]();

			expect(tapeTest.fail.mock.calls).toEqual([
				['console.log was called with: "abc", "def"'],
				['console.log was called with: "ghi"'],
			]);
		});
	});
});
