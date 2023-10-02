"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTestFramework = void 0;
const ava_1 = require("./ava");
const jasmine_1 = require("./jasmine");
const jest_1 = require("./jest");
const lab_1 = require("./lab");
const mocha_1 = require("./mocha");
const nodeTap_1 = require("./nodeTap");
const vitest_1 = require("./vitest");
const testEnvironmentsByName = new Map([
	["jasmine", jasmine_1.selectJasmineEnvironment],
	["jest", jest_1.selectJestEnvironment],
	["mocha", mocha_1.selectMochaEnvironment],
	["vitest", vitest_1.selectVitestEnvironment],
]);
const detectableTestEnvironmentSelectors = [
	// These environments only work with received modules, so they should come first
	ava_1.selectAvaEnvironment,
	lab_1.selectLabEnvironment,
	nodeTap_1.selectNodeTapEnvironment,
	vitest_1.selectVitestEnvironment,
	// Jest should come before Jasmine because Jest includes a monkey-patched Jasmine
	jest_1.selectJestEnvironment,
	jasmine_1.selectJasmineEnvironment,
	// Mocha should be last because it's difficult to accurately detect
	// See https://github.com/JoshuaKGoldberg/console-fail-test/issues/10
	mocha_1.selectMochaEnvironment,
];
const selectTestFramework = (request) => {
	// If a test environment is requested by name, it must exist
	if (typeof request.testFramework === "string") {
		const getter = testEnvironmentsByName.get(request.testFramework);
		if (getter === undefined) {
			throw new Error(
				`Requested test framework '${request.testFramework}' not known by name in console-fail-test.`
			);
		}
		const environment = getter(request);
		if (environment === undefined) {
			throw new Error(
				`Requested test framework '${request.testFramework}' does not seem to be active.`
			);
		}
		return environment;
	}
	// Otherwise, attempt to auto-detect an active one
	for (const testEnvironmentGetter of detectableTestEnvironmentSelectors) {
		const environment = testEnvironmentGetter(request);
		if (environment !== undefined) {
			return environment;
		}
	}
	throw new Error(
		"Could not auto-detect test environment; consider passing it directly to cft."
	);
};
exports.selectTestFramework = selectTestFramework;
