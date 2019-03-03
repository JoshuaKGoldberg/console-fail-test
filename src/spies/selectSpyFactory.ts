import { CftRequest, SupportedSpyLibrary } from "../types";

import { fallbackSpyFactory } from "./fallback";
import { jasmineSpyFactory } from "./jasmine";
import { jestSpyFactory } from "./jest";
import { sinonSpyFactory } from "./sinon";
import { SpyFactory } from "./spyTypes";

const spyFactoriesByName = new Map<SupportedSpyLibrary, SpyFactory>([
    ["fallback", fallbackSpyFactory],
    ["jest", jestSpyFactory],
    ["jasmine", jasmineSpyFactory],
    ["sinon", sinonSpyFactory],
]);

const detectableSpyFactories: SpyFactory[] = [
    // Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
    jestSpyFactory,
    jasmineSpyFactory,

    sinonSpyFactory,
];

export const getSpyFactory = (request: CftRequest) => {
    // If a spy library is requested, it must exist
    if (request.spyLibrary !== undefined) {
        const spyFactory = spyFactoriesByName.get(request.spyLibrary);
        if (spyFactory === undefined) {
            throw new Error(`Requested spy library '${request.spyLibrary}' not supported by console-fail-test.`);
        }

        return spyFactory;
    }

    // Otherwise, attempt to auto-detect an active one
    for (const spyFactory of detectableSpyFactories) {
        if (spyFactory.canSpy(request)) {
            return spyFactory;
        }
    }

    // If the
    return fallbackSpyFactory;
};
