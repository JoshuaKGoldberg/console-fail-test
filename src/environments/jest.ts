import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const afterEach: (callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const jest: unknown;

export const selectJestEnvironment: TestFrameworkSelector = () => {
	if (
		typeof afterEach === "undefined" ||
		typeof beforeEach === "undefined" ||
		typeof jest === "undefined"
	) {
		return undefined;
	}

	let afterEachCallback: (() => void) | undefined;
	let beforeEachCallback: (() => void) | undefined;

	afterEach(() => {
		afterEachCallback?.();
	});

	beforeEach(() => {
		beforeEachCallback?.();
	});

	return {
		afterEach: (callback) => {
			afterEachCallback = callback;
		},
		beforeEach: (callback) => {
			beforeEachCallback = callback;
		},
	};
};
