"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectJasmineEnvironment = void 0;
const selectJasmineEnvironment = () => {
	if (
		typeof afterEach === "undefined" ||
		typeof beforeEach === "undefined" ||
		typeof jasmine === "undefined" ||
		typeof jasmine.Spec === "undefined"
	) {
		return undefined;
	}
	return {
		afterEach: (callback) => {
			afterEach(() => {
				callback({
					reportComplaint({ error }) {
						// Jasmine prints the error stack along with its message, resulting in a duplicate message
						error.stack = error.stack.substring(error.message.length);
						throw error;
					},
				});
			});
		},
		beforeEach: (callback) => {
			beforeEach(callback);
		},
	};
};
exports.selectJasmineEnvironment = selectJasmineEnvironment;
