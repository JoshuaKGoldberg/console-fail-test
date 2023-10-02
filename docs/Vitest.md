# Vitest

Vitest is supported both as a testing framework and a spy library.
It will be auto-detected if available.

## Setup

In your `vitest.config.ts`, include `console-fail-test/vitest` in your [`setupFiles`](https://vitest.dev/config/#setupfiles):

```js
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	setupFiles: ["console-fail-test/setup"],
});
```

Alternately, if you have a setup file already being run first, or you'd like to manually enable this in individual files, you can use the Node API:

```js
// some.test.js
import { describe } from "vitest";

require("console-fail-test").cft();

describe(/* ... */);
```

## Spies

Global `console` methods will be replaced by `vi.fn()` spies.
You can inspect them at runtime as usual per vitest spies.
See vitest's [mock functions docs](https://vitest.dev/guide/mocking.html#functions).
