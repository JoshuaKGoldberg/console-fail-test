export type CftRequest = {
    spyLibrary?: SupportedSpyLibrary;
    testFramework?: SupportedTestFramework;
};

export type SupportedSpyLibrary = "fallback" | "jasmine" | "jest" | "sinon" | unknown;

export type SupportedTestFramework = "mocha" | "jasmine" | "jest" | unknown;
