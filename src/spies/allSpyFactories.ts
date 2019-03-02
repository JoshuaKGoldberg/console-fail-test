import { fallbackSpyFactory } from "./fallback";
import { jestSpyFactory } from "./jest";
import { sinonSpyFactory } from "./sinon";
import { SpyFactory } from "./spyTypes";

const allSpyFactories: SpyFactory[] = [jestSpyFactory, sinonSpyFactory];

export const getSpyFactory = () => {
    for (const spyFactory of allSpyFactories) {
        if (spyFactory.canSpy()) {
            return spyFactory;
        }
    }

    return fallbackSpyFactory;
};
