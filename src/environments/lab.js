"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectLabEnvironment = void 0;
const isLab = (testFramework) => {
	return (
		typeof testFramework !== "undefined" &&
		typeof testFramework.afterEach !== "undefined" &&
		typeof testFramework.beforeEach !== "undefined" &&
		typeof testFramework.setOnly !== "undefined" &&
		typeof testFramework._current === "object" &&
		typeof testFramework._current.tests === "object"
	);
};
const selectLabEnvironment = ({ testFramework }) => {
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
exports.selectLabEnvironment = selectLabEnvironment;
