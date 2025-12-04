import { SpyCallArgs } from "../spies/spyTypes.js";

const formatComplaintLineArg = (arg: unknown) => {
	try {
		return JSON.stringify(arg) || JSON.stringify(`${arg}`);
	} catch {
		return `A recursive object with keys: ${Object.keys(arg as object).join(", ")}`;
	}
};

export const formatComplaintCall = (call: SpyCallArgs) =>
	call.map(formatComplaintLineArg).join(", ");
