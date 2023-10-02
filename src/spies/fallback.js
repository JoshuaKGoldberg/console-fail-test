"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectFallbackSpyFactory = void 0;
const selectFallbackSpyFactory = () => (container, methodName) => {
	const methodCalls = [];
	const originalMethod = container[methodName];
	const spyMethod = function (...args) {
		methodCalls.push(args);
		return originalMethod.apply(this, args);
	};
	spyMethod.getCalls = () => methodCalls;
	spyMethod.restore = () => {
		container[methodName] = originalMethod;
	};
	container[methodName] = spyMethod;
	return spyMethod;
};
exports.selectFallbackSpyFactory = selectFallbackSpyFactory;
