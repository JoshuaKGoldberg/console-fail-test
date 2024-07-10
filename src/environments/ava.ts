import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare interface Ava {
	afterEach(callback: Function): void;
	beforeEach(callback: Function): void;
	cb: Function;
	failing: Function;
	meta: {
		file: string;
	};
	serial: {
		cb: Function;
	} & Function;
}

const isAva = (testFramework: unknown): testFramework is Ava => {
	return (
		typeof testFramework !== "undefined" &&
		typeof (testFramework as Partial<Ava>).afterEach !== "undefined" &&
		typeof (testFramework as Partial<Ava>).beforeEach !== "undefined" &&
		typeof (testFramework as Partial<Ava>).failing !== "undefined" &&
		typeof (testFramework as Partial<Ava>).meta === "object" &&
		typeof (testFramework as Ava).meta.file === "string" &&
		typeof (testFramework as Partial<Ava>).serial !== "undefined" &&
		typeof (testFramework as Ava).serial.cb !== "undefined"
	);
};

export const selectAvaEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	if (!isAva(testFramework)) {
		return undefined;
	}

	return {
		afterEach: (callback) => {
			testFramework.afterEach(() => {
				callback();
			});
		},
		beforeEach: testFramework.beforeEach,
	};
};
