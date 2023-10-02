"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectVitestSpyFactory = void 0;
const isVitestModule = (spyLibrary) => {
	return (
		typeof spyLibrary === "object" &&
		!!spyLibrary.vi &&
		typeof spyLibrary.vi.spyOn === "function"
	);
};
const createVitestSpyFactory = (spyLibrary) => {
	return (container, methodName) => {
		const spy = spyLibrary.vi.spyOn(container, methodName);
		return {
			getCalls: () => spy.mock.calls,
			restore: spy.mockRestore,
		};
	};
};
const selectVitestSpyFactory = ({ spyLibrary }) => {
	if (isVitestModule(spyLibrary)) {
		return createVitestSpyFactory(spyLibrary);
	}
	if (
		typeof __vitest_index__ !== "undefined" &&
		isVitestModule(__vitest_index__)
	) {
		return createVitestSpyFactory(__vitest_index__);
	}
	return undefined;
};
exports.selectVitestSpyFactory = selectVitestSpyFactory;
