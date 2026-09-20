import { formatComplaintCall } from "../complaining/index.js";
import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare interface NodeTap {
	afterEach(callback: (onFinish?: unknown) => void): void;
	beforeEach(callback: (onFinish?: unknown) => void): void;
	fail(message: string): void;
	jobs: number;
	name: "TAP";
	pool: object;
}

const isNodeTap = (testFramework: unknown): testFramework is NodeTap => {
	return (
		typeof testFramework !== "undefined" &&
		typeof (testFramework as Partial<NodeTap>).afterEach === "function" &&
		typeof (testFramework as Partial<NodeTap>).beforeEach === "function" &&
		typeof (testFramework as Partial<NodeTap>).fail === "function" &&
		typeof (testFramework as Partial<NodeTap>).jobs === "number" &&
		typeof (testFramework as Partial<NodeTap>).pool === "object" &&
		(testFramework as Partial<NodeTap>).name === "TAP"
	);
};

export const selectNodeTapEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	if (!isNodeTap(testFramework)) {
		return undefined;
	}

	return {
		afterEach: (callback) => {
			testFramework.afterEach((onFinish) => {
				callback({
					reportComplaint({ methodComplaints }) {
						for (const { methodCalls, methodName } of methodComplaints) {
							for (const methodCall of methodCalls) {
								testFramework.fail(
									`console.${methodName} was called with: ${formatComplaintCall(
										methodCall,
									)}`,
								);
							}
						}
					},
				});
				// node-tap <15 passes a done callback; newer versions pass the test
				if (typeof onFinish === "function") {
					onFinish();
				}
			});
		},
		beforeEach: (callback) => {
			testFramework.beforeEach((onFinish) => {
				callback();
				if (typeof onFinish === "function") {
					onFinish();
				}
			});
		},
	};
};
