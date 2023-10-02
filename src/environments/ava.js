"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectAvaEnvironment = void 0;
const isAva = (testFramework) => {
	return (
		typeof testFramework !== "undefined" &&
		typeof testFramework.afterEach !== "undefined" &&
		typeof testFramework.beforeEach !== "undefined" &&
		typeof testFramework.failing !== "undefined" &&
		typeof testFramework.meta === "object" &&
		typeof testFramework.meta.file === "string" &&
		typeof testFramework.serial !== "undefined" &&
		typeof testFramework.serial.cb !== "undefined"
	);
};
const selectAvaEnvironment = ({ testFramework }) => {
	if (!isAva(testFramework)) {
		return undefined;
	}
	return {
		afterEach: (callback) => {
			testFramework.afterEach(() => {
				callback();
			});
		},
		beforeEach: testFramework.beforeEach,
	};
};
exports.selectAvaEnvironment = selectAvaEnvironment;
