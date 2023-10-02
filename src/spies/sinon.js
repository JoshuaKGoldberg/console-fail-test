"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectSinonSpyFactory = void 0;
const isSinonModule = (spyLibrary) => {
	return typeof spyLibrary === "object" && typeof spyLibrary.spy === "function";
};
const createSinonSpyFactory = (spyLibrary) => {
	return (container, methodName) => {
		const methodCalls = [];
		const originalMethod = container[methodName];
		const spyMethod = spyLibrary.spy(function (...args) {
			methodCalls.push(args);
			return originalMethod.apply(this, args);
		});
		container[methodName] = spyMethod;
		return {
			getCalls: () => methodCalls,
			restore() {
				container[methodName] = originalMethod;
			},
		};
	};
};
const selectSinonSpyFactory = ({ spyLibrary }) => {
	if (isSinonModule(spyLibrary)) {
		return createSinonSpyFactory(spyLibrary);
	}
	if (typeof sinon !== "undefined" && isSinonModule(sinon)) {
		return createSinonSpyFactory(sinon);
	}
	return undefined;
};
exports.selectSinonSpyFactory = selectSinonSpyFactory;
