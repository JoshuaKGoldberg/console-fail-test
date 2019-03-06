export type CftRequest = {
    console: ConsoleObject;
    spyLibrary?: SupportedSpyLibrary;
    testFramework?: SupportedTestFramework;
};

export type SupportedSpyLibrary = "fallback" | "jasmine" | "jest" | "sinon" | unknown;

export type SupportedTestFramework = "mocha" | "jasmine" | "jest" | unknown;

export type ConsoleObject = { [P in keyof Console]?: Console[P] extends Function ? boolean : never };
