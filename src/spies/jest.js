"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectJestSpyFactory = void 0;
const isJestModule = (spyLibrary) => {
	return typeof spyLibrary === "object" && typeof spyLibrary.fn === "function";
};
const createJestSpyFactory = (spyLibrary) => {
	return (container, methodName) => {
		const methodCalls = [];
		const originalMethod = container[methodName];
		const methodSpy = function (...args) {
			methodCalls.push(args);
			return originalMethod.apply(this, args);
		};
		container[methodName] = spyLibrary.fn(methodSpy);
		return {
			getCalls: () => methodCalls,
			restore: () => {
				container[methodName] = originalMethod;
			},
		};
	};
};
const selectJestSpyFactory = ({ spyLibrary }) => {
	if (isJestModule(spyLibrary)) {
		return createJestSpyFactory(spyLibrary);
	}
	if (typeof jest !== "undefined" && isJestModule(jest)) {
		return createJestSpyFactory(jest);
	}
	return undefined;
};
exports.selectJestSpyFactory = selectJestSpyFactory;
