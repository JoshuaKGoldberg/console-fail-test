import { TestComplaint } from "../environments/testEnvironmentTypes.js";
import { SpyCallArgs } from "../spies/spyTypes.js";
import { formatMethodComplaint } from "./formatMethodComplaint.js";

export const createComplaint = (
	methodsWithCalls: [keyof Console, SpyCallArgs[]][],
): TestComplaint => {
	const methodComplaints = methodsWithCalls
		.map(formatMethodComplaint)
		.join("\n");
	const s = methodsWithCalls.length === 1 ? "" : "s";

	// It looks like something wrote to the console during your test!
	// Put a breakpoint on this line and check the methodsWithCalls variable to see details.
	const error = new Error(
		`Oh no! Your test called the following console method${s}:\n${methodComplaints}`,
	);

	return {
		error,
		methodComplaints: methodsWithCalls.map(([methodName, methodCalls]) => ({
			methodCalls,
			methodName,
		})),
	};
};
