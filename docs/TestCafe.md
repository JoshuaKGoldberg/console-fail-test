# TestCafe

[TestCafe](https://testcafe.io) is supported as a testing framework.
It cannot be auto-detected.

## Setup

Use `createTestCafeHooks` to add console-fail-test as [global test hooks](https://testcafe.io/documentation/403435/guides/basic-guides/hooks#global-hooks) in your TestCafe configuration file:

```js
// .testcaferc.cjs
const { createTestCafeHooks } = require("console-fail-test");

module.exports = {
	hooks: {
		test: createTestCafeHooks(),
	},
};
```

`createTestCafeHooks` takes the same options as `cft`, except for `testFramework`.

console-fail-test only checks the Node.js test process's console, not the browser's.

## Hooks

console-fail-test checks console calls from the test and its `test.before`, `test.after`, `fixture.beforeEach`, and `fixture.afterEach` hooks.

TestCafe allows only one global `hooks.test` configuration.
If you have your own global test hooks, call console-fail-test's hooks from them:

```js
// .testcaferc.cjs
const { createTestCafeHooks } = require("console-fail-test");

const consoleFailTestHooks = createTestCafeHooks();

module.exports = {
	hooks: {
		test: {
			after: async (t) => {
				// ...
				consoleFailTestHooks.after();
			},
			before: async (t) => {
				consoleFailTestHooks.before();
				// ...
			},
		},
	},
};
```

## Concurrency

console-fail-test spies on the global `console` for one test at a time.
Running tests [concurrently](https://testcafe.io/documentation/402831/guides/intermediate-guides/run-tests-concurrently) is not supported.
