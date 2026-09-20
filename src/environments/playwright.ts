import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare interface PlaywrightTest {
	(...args: unknown[]): unknown;
	afterEach(callback: () => void): void;
	beforeEach(callback: () => void): void;
	describe: Function;
	extend: Function;
	info: Function;
	step: Function;
	use: Function;
}

const isPlaywrightTest = (
	testFramework: unknown,
): testFramework is PlaywrightTest => {
	return (
		typeof testFramework === "function" &&
		typeof (testFramework as Partial<PlaywrightTest>).afterEach ===
			"function" &&
		typeof (testFramework as Partial<PlaywrightTest>).beforeEach ===
			"function" &&
		typeof (testFramework as Partial<PlaywrightTest>).describe === "function" &&
		typeof (testFramework as Partial<PlaywrightTest>).extend === "function" &&
		typeof (testFramework as Partial<PlaywrightTest>).info === "function" &&
		typeof (testFramework as Partial<PlaywrightTest>).step === "function" &&
		typeof (testFramework as Partial<PlaywrightTest>).use === "function"
	);
};

export const selectPlaywrightEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	if (!isPlaywrightTest(testFramework)) {
		return undefined;
	}

	// Playwright inspects hook callbacks' parameters to resolve fixtures,
	// so the callbacks must not declare any
	return {
		afterEach: (callback) => {
			testFramework.afterEach(() => {
				callback();
			});
		},
		beforeEach: (callback) => {
			testFramework.beforeEach(() => {
				callback();
			});
		},
	};
};
