import { TestFrameworkSelector } from "./testEnvironmentTypes.js";

declare interface NodeTest {
	(...args: unknown[]): unknown;
	afterEach(callback: (context: NodeTestContext) => void): void;
	beforeEach(callback: (context: NodeTestContext) => void): void;
	describe: Function;
	it: Function;
	mock: object;
	run: Function;
	test: NodeTest;
}

declare interface NodeTestContext {
	fullName: string;
}

declare const process:
	| undefined
	| {
			env: Record<string, string | undefined>;
			getBuiltinModule?: (id: string) => unknown;
	  };

const isNodeTest = (testFramework: unknown): testFramework is NodeTest => {
	return (
		typeof testFramework === "function" &&
		typeof (testFramework as Partial<NodeTest>).afterEach === "function" &&
		typeof (testFramework as Partial<NodeTest>).beforeEach === "function" &&
		typeof (testFramework as Partial<NodeTest>).describe === "function" &&
		typeof (testFramework as Partial<NodeTest>).it === "function" &&
		typeof (testFramework as Partial<NodeTest>).mock === "object" &&
		typeof (testFramework as Partial<NodeTest>).run === "function" &&
		// The node:test module is the test function itself, with .test referencing itself
		(testFramework as Partial<NodeTest>).test === testFramework
	);
};

const getNodeTest = (testFramework: unknown): NodeTest | undefined => {
	if (isNodeTest(testFramework)) {
		return testFramework;
	}

	// A different received module was passed, so this isn't node:test
	if (testFramework !== undefined && typeof testFramework !== "string") {
		return undefined;
	}

	// When run by `node --test`, node:test doesn't create any globals but does set
	// environment variables, and node:test can be retrieved synchronously
	if (
		typeof process === "undefined" ||
		(process.env.NODE_TEST_CONTEXT === undefined &&
			process.env.NODE_TEST_WORKER_ID === undefined) ||
		typeof process.getBuiltinModule !== "function"
	) {
		return undefined;
	}

	const nodeTest = process.getBuiltinModule("node:test");

	return isNodeTest(nodeTest) ? nodeTest : undefined;
};

export const selectNodeTestEnvironment: TestFrameworkSelector = ({
	testFramework,
}) => {
	const nodeTest = getNodeTest(testFramework);
	if (nodeTest === undefined) {
		return undefined;
	}

	// Subtests (t.test) run their hooks while their parent test's are still active.
	// Only the outermost test should install and collect spies.
	let activeTestName: string | undefined;

	return {
		afterEach: (callback) => {
			nodeTest.afterEach((context) => {
				if (context.fullName !== activeTestName) {
					return;
				}

				activeTestName = undefined;
				callback();
			});
		},
		beforeEach: (callback) => {
			nodeTest.beforeEach((context) => {
				if (activeTestName !== undefined) {
					return;
				}

				activeTestName = context.fullName;
				callback();
			});
		},
	};
};
