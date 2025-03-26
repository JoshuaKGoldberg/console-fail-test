export interface CftRequest {
	console: ConsoleSettings;
	spyLibrary?: SupportedSpyLibrary;
	testFramework?: SupportedTestFramework;
}

export type ConsoleSettings = {
	[P in keyof Console]?: Console[P] extends Function ? boolean : never;
};

export type SupportedSpyLibrary =
	| "fallback"
	| "jasmine"
	| "jest"
	| "sinon"
	| unknown;

export type SupportedTestFramework = "jasmine" | "jest" | "mocha" | unknown;
