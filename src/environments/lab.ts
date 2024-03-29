import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare interface Lab {
	_current: {
		tests: unknown[];
	};
	afterEach(callback: Function): void;
	beforeEach(callback: Function): void;
	setOnly: Function;
}

const isLab = (testFramework: unknown): testFramework is Lab => {
	return (
		typeof testFramework !== "undefined" &&
		typeof (testFramework as Partial<Lab>).afterEach !== "undefined" &&
		typeof (testFramework as Partial<Lab>).beforeEach !== "undefined" &&
		typeof (testFramework as Partial<Lab>).setOnly !== "undefined" &&
		typeof (testFramework as Partial<Lab>)._current === "object" &&
		typeof (testFramework as Lab)._current.tests === "object"
	);
};

export const selectLabEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	if (!isLab(testFramework)) {
		return undefined;
	}

	return {
		afterEach: (callback) => {
			testFramework.afterEach(() => {
				callback({
					reportComplaint({ error }) {
						throw error;
					},
				});
			});
		},
		beforeEach: testFramework.beforeEach,
	};
};
