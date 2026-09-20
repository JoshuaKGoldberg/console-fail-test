# Playwright

[Playwright Test](https://playwright.dev) is supported as a testing framework.
It cannot be auto-detected.

## Setup

Call the Node API in each test file that should be checked for console calls with the `test` object the file uses:

```js
// some.spec.js

import { test } from "@playwright/test";
import { cft } from "console-fail-test";

cft({ testFramework: test });

test(/* ... */);
```

A `test` that was extended with custom fixtures via [`test.extend()`](https://playwright.dev/docs/test-fixtures) works too.

console-fail-test can only verify that the Node.js tests themselves don't log.
It does not check the browser's console.

### Shared Modules

`cft()` must be called from each test file rather than from a shared module that test files import, such as a fixtures file.
Playwright registers `beforeEach` and `afterEach` hooks on the test file currently being loaded, and it only evaluates an imported module once per worker process.
Calling `cft()` from a shared module would therefore only check the first test file each worker runs.

## Hooks

console-fail-test registers file-level `beforeEach` and `afterEach` hooks.
They run around any hooks registered in `test.describe()` blocks, so console calls in those hooks are reported as failures of their test as well.

Hooks at the same level run in declaration order.
A file-level `beforeEach` declared before `cft()` or a file-level `afterEach` declared after it is not checked.

[Fixtures](https://playwright.dev/docs/test-fixtures) are set up right before the first hook or test that uses them.
`auto` fixtures are therefore set up before console-fail-test's `beforeEach` hook and are not checked, while fixtures first used by the test itself are set up after it and are checked.
Fixture teardown always runs after `afterEach` hooks, so it is never checked.

## Failures

Console calls during a test are reported by throwing an error from the `afterEach` hook.
Playwright attaches that error to the test, in addition to any error from the test itself.
