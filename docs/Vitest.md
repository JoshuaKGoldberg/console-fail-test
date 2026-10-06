# Vitest

Vitest is supported both as a testing framework and a spy library.
It will be auto-detected if available.

## Setup

In your `vitest.config.ts`, include `console-fail-test/setup` in your [`setupFiles`](https://vitest.dev/config/#setupfiles):

```js
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["console-fail-test/setup"],
	},
});
```

Alternately, if you have a setup file already being run first, or you'd like to manually enable this in individual files, you can use the Node API:

```js
// some.test.js
import { describe } from "vitest";

require("console-fail-test").cft();

describe("a test", () => {
	/* ... */
});
```

### Test Fixtures

Alternately, use `extendTest` to add console-fail-test as an [automatic fixture](https://vitest.dev/guide/test-context#fixture-options), which also checks console calls from fixtures' setup and teardown:

```js
// fixtures.js
import { extendTest } from "console-fail-test";
import { test as base } from "vitest";

export const test = extendTest(base);
```

Then import `test` from that file in your tests.

## Spies

Global `console` methods will be replaced by `vi.fn()` spies.
You can inspect them at runtime as usual per vitest spies.
See vitest's [mock functions docs](https://vitest.dev/guide/mocking.html#functions).
