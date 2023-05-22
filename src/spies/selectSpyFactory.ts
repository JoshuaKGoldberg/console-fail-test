import { CftRequest, SupportedSpyLibrary } from "../types.js";
import { selectFallbackSpyFactory } from "./fallback.js";
import { selectJasmineSpyFactory } from "./jasmine.js";
import { selectJestSpyFactory } from "./jest.js";
import { selectSinonSpyFactory } from "./sinon.js";
import { SpyFactoryGetter as SpyFactorySelector } from "./spyTypes.js";
import { selectVitestSpyFactory } from "./vitest.js";

const spyFactoriesByName = new Map<SupportedSpyLibrary, SpyFactorySelector>([
	["fallback", selectFallbackSpyFactory],
	["jest", selectJestSpyFactory],
	["jasmine", selectJasmineSpyFactory],
	["sinon", selectSinonSpyFactory],
	["vitest", selectVitestSpyFactory],
]);

const detectableSpyFactorySelectors: SpyFactorySelector[] = [
	selectVitestSpyFactory,

	// Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
	selectJestSpyFactory,
	selectJasmineSpyFactory,

	selectSinonSpyFactory,
];

export const selectSpyFactory = (request: CftRequest) => {
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

	return selectFallbackSpyFactory();
};
