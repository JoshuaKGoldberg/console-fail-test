# QUnit

[QUnit](https://qunitjs.com) is supported as a testing framework.
It will be auto-detected if tests are run with the `qunit` CLI.

## Setup

Either use the `console-fail-test/setup` entry point with the CLI's `--require` flag:

```shell
qunit --require console-fail-test/setup
```

...or call the Node API in a setup file that runs once before your tests, with the `QUnit` module:

```js
// setupTests.js

import { cft } from "console-fail-test";
import QUnit from "qunit";

cft({ testFramework: QUnit });
```

Test files run in the same process, so `cft()` should be called only once per run.
Calling it from more than one test file would register duplicate hooks that report each console call more than once.

## Hooks

console-fail-test uses QUnit's [global hooks](https://qunitjs.com/api/QUnit/hooks/), which require QUnit 2.18 or newer.

Global hooks run before any module's `beforeEach` and after any module's `afterEach`.
Console calls in module hooks are therefore reported as failures of their test as well.

## Failures

Each console call is reported as a failed assertion on its test.
A test that uses `assert.expect()` will therefore also fail for its unexpected assertion count.
