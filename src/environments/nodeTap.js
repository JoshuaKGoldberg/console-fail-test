"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectNodeTapEnvironment = void 0;
const complaining_1 = require("../complaining");
const isNodeTap = (testFramework) => {
	return (
		typeof testFramework !== "undefined" &&
		typeof testFramework.afterEach === "function" &&
		typeof testFramework.beforeEach === "function" &&
		typeof testFramework.fail === "function" &&
		typeof testFramework.jobs === "number" &&
		typeof testFramework.pool === "object" &&
		testFramework.name === "TAP"
	);
};
const selectNodeTapEnvironment = ({ testFramework }) => {
	if (!isNodeTap(testFramework)) {
		return undefined;
	}
	return {
		afterEach: (callback) => {
			testFramework.afterEach((onFinishAfterEach) => {
				callback({
					reportComplaint({ methodComplaints }) {
						for (const { methodName, methodCalls } of methodComplaints) {
							for (const methodCall of methodCalls) {
								testFramework.fail(
									`console.${methodName} was called with: ${(0,
									complaining_1.formatComplaintCall)(methodCall)}`
								);
							}
						}
					},
				});
				onFinishAfterEach();
			});
		},
		beforeEach: (callback) => {
			testFramework.beforeEach((onFinishBeforeEach) => {
				callback();
				onFinishBeforeEach();
			});
		},
	};
};
exports.selectNodeTapEnvironment = selectNodeTapEnvironment;
