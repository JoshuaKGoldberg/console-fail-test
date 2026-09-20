# tape

[tape](https://github.com/ljharb/tape) is supported as a testing framework.
It cannot be auto-detected.

## Setup

tape writes its own TAP output with `console.log`, which console-fail-test would otherwise report as a failure in every test.
Redirect that output to a stream, then call the Node API with the `tape` module:

```js
// setupTests.js

import { cft } from "console-fail-test";
import tape from "tape";

tape.createStream().pipe(process.stdout);

cft({ testFramework: tape });
```

`cft()` must come after `tape.createStream()`, as it creates tape's default harness if one doesn't exist yet.

Import that setup file at the top of each test file that should be checked for console calls:

```js
// some.test.js

import "./setupTests.js";
import test from "tape";

test("passes when the console is not called", (t) => {
	t.end();
});
```

Module caching ensures the setup only runs once, even when the `tape` CLI loads many test files in a single process.
Avoid loading the setup file with the CLI's `--require` flag instead: that runs before `tape.wait()`, so tests in files that load asynchronously might be skipped.

## Subtests

tape runs subtests created with `t.test()` before their parent test ends.
console-fail-test only checks the console for the outermost test, so console calls in a subtest are reported as a failure of its parent test.

## Ending Tests

console-fail-test checks the console as soon as a test ends.
Calling `t.end()` ends the test synchronously, so any console calls after it in the same callback are not reported.

## Plans

console-fail-test reports each console call as a failed assertion on the test.
A test that uses `t.plan()` will therefore also fail with `plan != count`.
