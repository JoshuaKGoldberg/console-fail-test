# Mocha

Mocha is supported as a testing framework.
It will be auto-detected if available.

## Setup

Include this as your first file before including other tests:

```shell
mocha ./node_modules/console-fail-test/setup.js src/**/*.test.js
```

Alternately, if you have a setup file already being run first, or you'd like to manually enable this in individual files, you can use the Node API:

```ts
// some.test.js

require("console-fail-test").cft();
```
