# lab

lab is supported as a testing framework.
It cannot be auto-detected.

## Setup

Call the Node API in each test file that should be checked for console calls with the lab Script you're testing with:

```js
// some.test.js
const { it } = (exports.lab = require("lab").script());

require("console-fail-test").cft({
  testFramework: exports.lab,
});
```
