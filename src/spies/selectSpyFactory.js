"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectSpyFactory = void 0;
const fallback_1 = require("./fallback");
const jasmine_1 = require("./jasmine");
const jest_1 = require("./jest");
const sinon_1 = require("./sinon");
const vitest_1 = require("./vitest");
const spyFactoriesByName = new Map([
	["fallback", fallback_1.selectFallbackSpyFactory],
	["jest", jest_1.selectJestSpyFactory],
	["jasmine", jasmine_1.selectJasmineSpyFactory],
	["sinon", sinon_1.selectSinonSpyFactory],
	["vitest", vitest_1.selectVitestSpyFactory],
]);
const detectableSpyFactorySelectors = [
	vitest_1.selectVitestSpyFactory,
	// Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
	jest_1.selectJestSpyFactory,
	jasmine_1.selectJasmineSpyFactory,
	sinon_1.selectSinonSpyFactory,
];
const selectSpyFactory = (request) => {
	// If a spy library is requested by name, it must exist
	if (typeof request.spyLibrary === "string") {
		const getter = spyFactoriesByName.get(request.spyLibrary);
		if (getter === undefined) {
			throw new Error(
				`Requested spy library '${request.spyLibrary}' not known by name in console-fail-test.`
			);
		}
		const library = getter(request);
		if (library === undefined) {
			throw new Error(
				`Requested spy library '${request.spyLibrary}' does not seem to be active.`
			);
		}
		return library;
	}
	// Otherwise, attempt to auto-detect an active one
	for (const getter of detectableSpyFactorySelectors) {
		const library = getter(request);
		if (library !== undefined) {
			return library;
		}
	}
	return (0, fallback_1.selectFallbackSpyFactory)();
};
exports.selectSpyFactory = selectSpyFactory;
