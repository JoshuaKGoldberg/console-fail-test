import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare const afterEach: (callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const jasmine:
	| undefined
	| {
			Spec: unknown;
	  };

const isJasmine = () => {
	return (
		typeof afterEach !== "undefined" &&
		typeof beforeEach !== "undefined" &&
		typeof jasmine?.Spec !== "undefined"
	);
};

export const selectJasmineEnvironment: TestFrameworkSelector = () => {
	if (!isJasmine()) {
		return undefined;
	}

	return {
		afterEach: (callback) => {
			afterEach(() => {
				callback({
					reportComplaint({ error }) {
						// Jasmine prints the error stack along with its message, resulting in a duplicate message
						error.stack = error.stack!.substring(error.message.length);

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
