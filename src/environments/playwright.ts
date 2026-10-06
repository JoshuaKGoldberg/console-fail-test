import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare interface PlaywrightTest {
	afterEach(callback: () => void): void;
	beforeEach(callback: () => void): void;
	info: Function;
	step: Function;
}

// Vitest's test also has afterEach and beforeEach, but not info or step
const isPlaywrightTest = (
	testFramework: unknown,
): testFramework is PlaywrightTest => {
	return (
		typeof testFramework === "function" &&
		typeof (testFramework as Partial<PlaywrightTest>).afterEach ===
			"function" &&
		typeof (testFramework as Partial<PlaywrightTest>).beforeEach ===
			"function" &&
		typeof (testFramework as Partial<PlaywrightTest>).info === "function" &&
		typeof (testFramework as Partial<PlaywrightTest>).step === "function"
	);
};

export const selectPlaywrightEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	if (!isPlaywrightTest(testFramework)) {
		return undefined;
	}

	return {
		// Playwright reads hook parameters as fixture names, so this takes none
		afterEach: (callback) => {
			testFramework.afterEach(() => {
				callback();
			});
		},
		beforeEach: testFramework.beforeEach,
	};
};
