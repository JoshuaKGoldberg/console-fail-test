import { allFailers } from "./failers/all";

export const cft = () => {
    for (const failer of allFailers) {
        if (failer.check()) {
            failer.run();
            return;
        }
    }

    throw new Error("Your global environment didn't seem to match any known ones :(");
};
