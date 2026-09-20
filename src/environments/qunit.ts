import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const QUnit: unknown;

declare interface QUnitAssert {
	pushResult(result: { message: string; result: boolean }): void;
}

declare interface QUnitHooks {
	afterEach(callback: (assert: QUnitAssert) => void): void;
	beforeEach(callback: (assert: QUnitAssert) => void): void;
}

declare interface QUnitModule {
	config: object;
	hooks: QUnitHooks;
	module: Function;
	test: Function;
}

const isQUnitHooks = (hooks: unknown): hooks is QUnitHooks => {
	return (
		typeof hooks === "object" &&
		hooks !== null &&
		typeof (hooks as Partial<QUnitHooks>).afterEach === "function" &&
		typeof (hooks as Partial<QUnitHooks>).beforeEach === "function"
	);
};

const isQUnit = (testFramework: unknown): testFramework is QUnitModule => {
	return (
		typeof testFramework === "object" &&
		testFramework !== null &&
		typeof (testFramework as Partial<QUnitModule>).config === "object" &&
		// Global QUnit.hooks were added in QUnit 2.18
		isQUnitHooks((testFramework as Partial<QUnitModule>).hooks) &&
		typeof (testFramework as Partial<QUnitModule>).module === "function" &&
		typeof (testFramework as Partial<QUnitModule>).test === "function"
	);
};

const getQUnit = (testFramework: unknown): QUnitModule | undefined => {
	if (isQUnit(testFramework)) {
		return testFramework;
	}

	if (testFramework !== undefined && typeof testFramework !== "string") {
		return undefined;
	}

	// The qunit CLI defines a global QUnit before loading test files
	return typeof QUnit !== "undefined" && isQUnit(QUnit) ? QUnit : undefined;
};

export const selectQUnitEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	const qunit = getQUnit(testFramework);
	if (qunit === undefined) {
		return undefined;
	}

	// Global hooks run before any module beforeEach and after any module afterEach
	return {
		afterEach: (callback) => {
			qunit.hooks.afterEach((assert) => {
				callback({
					reportComplaint({ error }) {
						// QUnit's reporters format multiline messages well, but not a thrown
						// hook error: that gets prefixed with "Global afterEach failed on ..."
						assert.pushResult({ message: error.message, result: false });
					},
				});
			});
		},
		beforeEach: (callback) => {
			qunit.hooks.beforeEach(() => {
				callback();
			});
		},
	};
};
