import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const afterEach: (callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const jest: unknown;
declare const process: undefined | { env: Record<string, string | undefined> };

const isJest = () =>
	typeof afterEach !== "undefined" &&
	typeof beforeEach !== "undefined" &&
	// The jest global isn't available in Jest's ESM mode, but the env variable is
	(typeof jest !== "undefined" || process?.env.JEST_WORKER_ID !== undefined);

export const selectJestEnvironment: TestFrameworkSelector = () => {
	if (!isJest()) {
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
