"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cft = void 0;
const complaining_1 = require("./complaining");
const console_1 = require("./console");
const defaults_1 = require("./defaults");
const selectTestFramework_1 = require("./environments/selectTestFramework");
const selectSpyFactory_1 = require("./spies/selectSpyFactory");
const defaultReportComplaint = ({ error }) => {
	throw error;
};
const cft = (rawRequest) => {
	const request = (0, defaults_1.setDefaults)(rawRequest);
	const spyFactory = (0, selectSpyFactory_1.selectSpyFactory)(request);
	const testFramework = (0, selectTestFramework_1.selectTestFramework)(request);
	const methodSpies = {};
	const relevantMethodNames = console_1.consoleMethodNames.filter(
		(name) => !request.console[name]
	);
	// Before each test, we spy on the console's methods
	testFramework.beforeEach(() => {
		for (const methodName of relevantMethodNames) {
			methodSpies[methodName] = spyFactory(console, methodName);
		}
	});
	// After each test, we collect the spied method calls, reporting on any found
	testFramework.afterEach(
		({ reportComplaint = defaultReportComplaint } = {}) => {
			var _a, _b;
			const methodsWithCalls = [];
			for (const methodName of relevantMethodNames) {
				const spy = methodSpies[methodName];
				const methodCalls = spy.getCalls();
				const filteredCalls =
					(_b =
						(_a = testFramework.mapSpyCalls) === null || _a === void 0
							? void 0
							: _a.call(testFramework, { methodCalls, methodName })) !== null &&
					_b !== void 0
						? _b
						: methodCalls;
				spy.restore();
				if (filteredCalls.length !== 0) {
					methodsWithCalls.push([methodName, filteredCalls]);
				}
			}
			if (methodsWithCalls.length === 0) {
				return;
			}
			reportComplaint((0, complaining_1.createComplaint)(methodsWithCalls));
		}
	);
};
exports.cft = cft;
