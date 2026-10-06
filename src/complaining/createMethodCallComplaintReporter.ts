import { TestComplaint } from "../environments/testEnvironmentTypes.js";
import { formatComplaintCall } from "./formatComplaintCall.js";

/**
 * Creates a complaint reporter that reports a separate failure per console method call.
 * Useful for test frameworks that don't format multiline error messages well.
 * @param fail Reports a single failure message to the test framework.
 * @returns A reporter for a test's complaint.
 */
export const createMethodCallComplaintReporter =
	(fail: (message: string) => void) =>
	({ methodComplaints }: TestComplaint) => {
		for (const { methodCalls, methodName } of methodComplaints) {
			for (const methodCall of methodCalls) {
				fail(
					`console.${methodName} was called with: ${formatComplaintCall(methodCall)}`,
				);
			}
		}
	};
