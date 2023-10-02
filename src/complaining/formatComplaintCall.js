"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatComplaintCall = void 0;
const formatComplaintLineArg = (arg) => {
	try {
		return JSON.stringify(arg) || JSON.stringify(`${arg}`);
	} catch (_a) {
		return `A recursive object with keys: ${Object.keys(arg).join(", ")}`;
	}
};
const formatComplaintCall = (call) =>
	call.map(formatComplaintLineArg).join(", ");
exports.formatComplaintCall = formatComplaintCall;
