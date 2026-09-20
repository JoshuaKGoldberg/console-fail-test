import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const afterEach: (callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const jest: unknown;

// process is read from globalThis rather than as a free variable so that browser
// bundlers such as Cypress's don't inject a polyfill for it into this module.
// Some browser environments, such as Cypress component testing, define an empty process.
const { process } = globalThis as {
	process?: { env?: Record<string, string | undefined> };
};

const isJest = () =>
	typeof afterEach !== "undefined" &&
	typeof beforeEach !== "undefined" &&
	// The jest global isn't available in Jest's ESM mode, but the env variable is
	(typeof jest !== "undefined" || process?.env?.JEST_WORKER_ID !== undefined);

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
