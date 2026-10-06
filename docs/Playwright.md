# Playwright

[Playwright Test](https://playwright.dev) is supported as a testing framework.
It cannot be auto-detected.

## Setup

Use `extendTest` to add console-fail-test as an [automatic fixture](https://playwright.dev/docs/test-fixtures#automatic-fixtures) in a fixtures file:

```js
// fixtures.js
import { test as base } from "@playwright/test";
import { extendTest } from "console-fail-test";

export const test = extendTest(base);
```

Then import `test` from that file in your tests:

```js
// some.spec.js
import { test } from "./fixtures.js";

test(/* ... */);
```

To combine it with other fixtures, call `.extend()` on the extended `test` or use [`mergeTests()`](https://playwright.dev/docs/test-fixtures#combine-custom-fixtures-from-multiple-modules).

console-fail-test only checks the Node.js test process's console, not the browser's.

## Fixtures

console-fail-test checks console calls from the test, its hooks, and its fixtures' setup and teardown.
Automatic fixtures added before `extendTest`, such as in a `test` passed to it, are set up before and torn down after console-fail-test's fixture, so they are not checked.
