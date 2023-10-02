"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComplaint = void 0;
const formatMethodComplaint_1 = require("./formatMethodComplaint");
const createComplaint = (methodsWithCalls) => {
	const methodComplaints = methodsWithCalls
		.map(formatMethodComplaint_1.formatMethodComplaint)
		.join("\n");
	const s = methodsWithCalls.length === 1 ? "" : "s";
	// It looks like something wrote to the console during your test!
	// Put a breakpoint on this line and check the methodsWithCalls variable to see details.
	const error = new Error(
		`Oh no! Your test called the following console method${s}:\n${methodComplaints}`
	);
	return {
		error,
		methodComplaints: methodsWithCalls.map(([methodName, methodCalls]) => ({
			methodCalls,
			methodName,
		})),
	};
};
exports.createComplaint = createComplaint;
