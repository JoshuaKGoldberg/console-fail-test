"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectVitestEnvironment = void 0;
const selectVitestEnvironment = () => {
	if (typeof __vitest_index__ === "undefined") {
		return undefined;
	}
	const vitest = __vitest_index__;
	let afterEachCallback;
	let beforeEachCallback;
	vitest.afterEach(() => {
		afterEachCallback === null || afterEachCallback === void 0
			? void 0
			: afterEachCallback();
	});
	vitest.beforeEach(() => {
		beforeEachCallback === null || beforeEachCallback === void 0
			? void 0
			: beforeEachCallback();
	});
	return {
		afterEach: (callback) => {
			afterEachCallback = callback;
		},
		beforeEach: (callback) => {
			beforeEachCallback = callback;
		},
	};
};
exports.selectVitestEnvironment = selectVitestEnvironment;
