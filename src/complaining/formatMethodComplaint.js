"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMethodComplaint = void 0;
const formatComplaintCall_1 = require("./formatComplaintCall");
const lineThreshold = 3;
const formatMethodComplaint = ([methodName, calls]) => {
	const summary = `  * ${methodName} (${calls.length} call${
		calls.length === 1 ? "" : "s"
	})`;
	const lines = calls
		.slice(0, Math.min(calls.length, lineThreshold))
		.map(formatComplaintLineWithIndex);
	if (calls.length > lineThreshold) {
		lines.push(`...${calls.length - lineThreshold} more`);
	}
	return `${summary}\n${lines.map((line) => `    > Call ${line}`).join("\n")}`;
};
exports.formatMethodComplaint = formatMethodComplaint;
const formatComplaintLineWithIndex = (call, i) =>
	`${i}: ${(0, formatComplaintCall_1.formatComplaintCall)(call)}`;
