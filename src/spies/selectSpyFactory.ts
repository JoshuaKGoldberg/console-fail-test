import { CftRequest, SupportedSpyLibrary } from "../types";

import { getFallbackSpyFactory } from "./fallback";
import { getJasmineSpyFactory } from "./jasmine";
import { getJestSpyFactory } from "./jest";
import { getSinonSpyFactory } from "./sinon";
import { SpyFactory, SpyFactoryGetter } from "./spyTypes";

const spyFactoriesByName = new Map<SupportedSpyLibrary, SpyFactoryGetter>([
  ["fallback", getFallbackSpyFactory],
  ["jest", getJestSpyFactory],
  ["jasmine", getJasmineSpyFactory],
  ["sinon", getSinonSpyFactory],
]);

const detectableSpyFactoryGetters: SpyFactoryGetter[] = [
  // Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
  getJestSpyFactory,
  getJasmineSpyFactory,

  getSinonSpyFactory,
];

export const getSpyFactory = (request: CftRequest): SpyFactory => {
  // If a spy library is requested by name, it must exist
  if (typeof request.spyLibrary === "string") {
    const getter = spyFactoriesByName.get(request.spyLibrary);
    if (getter === undefined) {
      throw new Error(
        `Requested spy library '${request.spyLibrary}' not known by name in console-fail-test.`,
      );
    }

    const library = getter(request);
    if (library === undefined) {
      throw new Error(`Requested spy library '${request.spyLibrary}' does not seem to be active.`);
    }

    return library;
  }

  // Otherwise, attempt to auto-detect an active one
  for (const getter of detectableSpyFactoryGetters) {
    const library = getter(request);

    if (library !== undefined) {
      return library;
    }
  }

  return getFallbackSpyFactory();
};
