import { CftRequest } from "./types.js";

const defaults = {
	console: {},
};

export const setDefaults = (request: Partial<CftRequest> = {}): CftRequest => {
	return { ...defaults, ...request };
};
