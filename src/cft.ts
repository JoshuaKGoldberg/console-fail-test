import { createConsoleChecker } from "./checker.js";
import { setDefaults } from "./defaults.js";
import { selectTestFramework } from "./environments/selectTestFramework.js";
import { TestComplaint } from "./environments/testEnvironmentTypes.js";
import { CftRequest } from "./types.js";

const defaultReportComplaint = ({ error }: TestComplaint) => {
	throw error;
};

export const cft = (rawRequest?: Partial<CftRequest>) => {
	const request = setDefaults(rawRequest);
	const testFramework = selectTestFramework(request);
	const checker = createConsoleChecker(request, testFramework.mapSpyCalls);

	testFramework.beforeEach(() => {
		checker.start();
	});

	testFramework.afterEach(
		({ reportComplaint = defaultReportComplaint } = {}) => {
			const complaint = checker.stop();
			if (complaint) {
				reportComplaint(complaint);
			}
		},
	);
};
