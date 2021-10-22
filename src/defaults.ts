import { CftRequest } from "./types";

const defaults = {
  console: {},
};

export const setDefaults = (request: Partial<CftRequest> = {}): CftRequest => {
  return { ...defaults, ...request };
};
