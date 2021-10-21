# AVA

AVA is supported as a testing framework.
It cannot be auto-detected.

## Setup

Call the Node API in each test file that should be checked for console calls:

```js
// some.test.js

require("console-fail-test").cft({
  testFramework: require("ava"),
});
```
