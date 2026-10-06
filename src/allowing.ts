import { SpyCallArgs } from "./spies/spyTypes.js";
import { ConsoleMethodSetting } from "./types.js";

const formatCallArgs = (args: SpyCallArgs) => args.map(String).join(" ");

/**
 * @returns Whether a console method should not be spied on at all.
 */
export const isMethodFullyAllowed = (
	setting: ConsoleMethodSetting | undefined,
) => setting === true;

/**
 * @returns The calls not matched by any of the setting's allow patterns.
 */
export const filterAllowedCalls = (
	methodCalls: SpyCallArgs[],
	setting: ConsoleMethodSetting | undefined,
) => {
	if (typeof setting !== "object" || !setting.allow.length) {
		return methodCalls;
	}

	return methodCalls.filter((args) => {
		const formatted = formatCallArgs(args);

		return !setting.allow.some((pattern) =>
			typeof pattern === "string"
				? formatted.includes(pattern)
				: pattern.test(formatted),
		);
	});
};
