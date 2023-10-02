"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectJestEnvironment = void 0;
const selectJestEnvironment = () => {
	if (
		typeof afterEach === "undefined" ||
		typeof beforeEach === "undefined" ||
		typeof jest === "undefined"
	) {
		return undefined;
	}
	let afterEachCallback;
	let beforeEachCallback;
	afterEach(() => {
		afterEachCallback === null || afterEachCallback === void 0
			? void 0
			: afterEachCallback();
	});
	beforeEach(() => {
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
exports.selectJestEnvironment = selectJestEnvironment;
