"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectJasmineSpyFactory = void 0;
const isJasmineModule = (spyLibrary) => {
	return (
		typeof spyLibrary === "object" && typeof spyLibrary.createSpy === "function"
	);
};
const createJasmineSpyFactory = (spyLibrary) => {
	return (container, methodName) => {
		const methodCalls = [];
		const originalMethod = container[methodName];
		container[methodName] = spyLibrary
			.createSpy()
			.and.callFake(function (...args) {
				methodCalls.push(args);
				return originalMethod.apply(this, args);
			});
		return {
			getCalls: () => methodCalls,
			restore: () => {
				container[methodName] = originalMethod;
			},
		};
	};
};
const selectJasmineSpyFactory = ({ spyLibrary }) => {
	if (isJasmineModule(spyLibrary)) {
		return createJasmineSpyFactory(spyLibrary);
	}
	if (typeof jasmine !== "undefined" && isJasmineModule(jasmine)) {
		return createJasmineSpyFactory(jasmine);
	}
	return undefined;
};
exports.selectJasmineSpyFactory = selectJasmineSpyFactory;
