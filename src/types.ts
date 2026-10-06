export interface CftRequest {
	console: ConsoleSettings;
	spyLibrary?: SupportedSpyLibrary;
	testFramework?: SupportedTestFramework;
}

export type ConsoleSettings = {
	[P in keyof Console]?: Console[P] extends Function
		? ConsoleMethodSetting
		: never;
};

/**
 * Either whether to allow all calls to a method,
 * or patterns of messages to allow for that method.
 */
export interface ConsoleMethodAllowSettings {
	/**
	 * Calls whose space-joined arguments contain a string or match a RegExp.
	 */
	allow: (RegExp | string)[];
}

export type ConsoleMethodSetting = boolean | ConsoleMethodAllowSettings;

export type SupportedSpyLibrary =
	| "fallback"
	| "jasmine"
	| "jest"
	| "sinon"
	| unknown;

export type SupportedTestFramework =
	| "cypress"
	| "jasmine"
	| "jest"
	| "mocha"
	| "node:test"
	| "qunit"
	| unknown;
