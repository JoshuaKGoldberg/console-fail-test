export type CftRequest = {
    spyLibrary?: SupportedSpyLibrary;
    testFramework?: SupportedTestFramework;
};

export type SupportedSpyLibrary = "fallback" | "jasmine" | "jest" | "sinon";

export type SupportedTestFramework = "mocha" | "jasmine" | "jest";
