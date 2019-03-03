import { fallbackSpyFactory } from "./fallback";
import { jasmineSpyFactory } from "./jasmine";
import { jestSpyFactory } from "./jest";
import { sinonSpyFactory } from "./sinon";
import { SpyFactory } from "./spyTypes";

const allSpyFactories: SpyFactory[] = [
    // Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
    jestSpyFactory,
    jasmineSpyFactory,

    sinonSpyFactory,
];

export const getSpyFactory = () => {
    for (const spyFactory of allSpyFactories) {
        if (spyFactory.canSpy()) {
            return spyFactory;
        }
    }

    return fallbackSpyFactory;
};
