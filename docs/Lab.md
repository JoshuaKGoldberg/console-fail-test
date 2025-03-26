# lab

lab is supported as a testing framework.
It cannot be auto-detected.

## Setup

Call the Node API in each test file that should be checked for console calls with the lab script you're testing with:

```ts
// some.test.js
const { describe } = (exports.lab = require("@hapi/lab").script());

require("console-fail-test").cft({
	testFramework: exports.lab,
});

describe(/* ... */);
```
