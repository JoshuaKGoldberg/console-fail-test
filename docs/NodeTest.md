# node:test

[`node:test`](https://nodejs.org/api/test.html), Node.js' built-in test runner, is supported as a testing framework.
It will be auto-detected if tests are run with `node --test`.

## Setup

Either use the `console-fail-test/setup` entry point with the test runner's `--import` flag:

```shell
node --test --import console-fail-test/setup
```

...or call the Node API in each test file that should be checked for console calls with the `node:test` module:

```js
// some.test.js

import nodeTest from "node:test";
import { cft } from "console-fail-test";

cft({ testFramework: nodeTest });
```

Passing the module directly is necessary when running test files without `node --test`, such as with `node some.test.js`.

## Subtests

`node:test` runs `beforeEach` and `afterEach` hooks for subtests created with `t.test()` while their parent test is still running.
console-fail-test only checks the console for the outermost test, so console calls in a subtest are reported as a failure of its parent test.
