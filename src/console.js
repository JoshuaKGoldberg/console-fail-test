"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleMethodNames = void 0;
const isValidMemberName = (methodName) =>
	!methodName.startsWith("_") && methodName[0].toLowerCase() === methodName[0];
exports.consoleMethodNames = Object.keys(console)
	.filter(
		(methodName) =>
			isValidMemberName(methodName) && typeof console[methodName] === "function"
	)
	.sort();
