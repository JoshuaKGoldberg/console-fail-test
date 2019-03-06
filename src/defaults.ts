import { CftRequest } from "./types";

const defaults = {
    console: {},
};

export const setDefaults = (request: Partial<CftRequest> = {}) => {
    return { ...defaults, ...request };
};
