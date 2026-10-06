# Playwright

[Playwright Test](https://playwright.dev) is supported as a testing framework.
It cannot be auto-detected.

## Setup

Call the Node API in each test file that should be checked for console calls, with the `test` object that file uses:

```js
// some.spec.js

import { test } from "@playwright/test";
import { cft } from "console-fail-test";

cft({ testFramework: test });
```

`cft()` must be called in each test file, not in a shared module such as a fixtures file.
Playwright only evaluates shared modules once per worker, so only the first test file in each worker would be checked.

console-fail-test only checks the Node.js test process's console, not the browser's.

## Hooks

console-fail-test registers file-level `beforeEach` and `afterEach` hooks.
Console calls from `auto` fixtures and from fixture teardown happen outside of those hooks, so they are not checked.
