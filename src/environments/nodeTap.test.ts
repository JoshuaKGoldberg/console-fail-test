import { describe, expect, it, test, vi } from "vitest";

import { selectNodeTapEnvironment } from "./nodeTap.js";

const mockNodeTapFramework = {
	afterEach: vi.fn(),
	beforeEach: vi.fn(),
	fail: vi.fn(),
	jobs: 1,
	name: "TAP",
	pool: {},
};

describe("selectNodeTapEnvironment", () => {
	describe("isNodeTap", () => {
		test.each([
			[undefined, undefined],
			[{}, undefined],
			[{ afterEach: vi.fn() }, undefined],
			[{ afterEach: vi.fn(), beforeEach: vi.fn() }, undefined],
			[{ afterEach: vi.fn(), beforeEach: vi.fn(), fail: vi.fn() }, undefined],
			[
				{ afterEach: vi.fn(), beforeEach: vi.fn(), fail: vi.fn(), jobs: 1 },
				undefined,
			],
			[
				{
					afterEach: vi.fn(),
					beforeEach: vi.fn(),
					fail: vi.fn(),
					jobs: 1,
					pool: {},
				},
				undefined,
			],
			[mockNodeTapFramework, expect.any(Object)],
		])("when testFramework is %s, returns %s", (testFramework, expected) => {
			const actual = selectNodeTapEnvironment({
				console: {},
				testFramework,
			});

			expect(actual).toEqual(expected);
		});
	});

	describe("afterEach", () => {
		it("reports a complaint if a console method was called", () => {
			mockNodeTapFramework.afterEach.mockImplementation(
				(callback: (onFinishAfterEach: () => void) => void) => {
					callback(vi.fn());
				},
			);

			const environment = selectNodeTapEnvironment({
				console: {},
				testFramework: mockNodeTapFramework,
			})!;

			environment.afterEach((hooks) => {
				hooks!.reportComplaint!({
					error: new Error("Oh no!"),
					methodComplaints: [
						{
							methodCalls: [["abc", "def"]],
							methodName: "log",
						},
					],
				});
			});

			expect(mockNodeTapFramework.fail).toHaveBeenCalledWith(
				'console.log was called with: "abc", "def"',
			);
		});
	});
});
