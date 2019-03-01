# console-fail-test

<!-- [![Circle CI](https://circleci.com/gh/JoshuaKGoldberg/TypeStat.svg?style=svg)](https://circleci.com/gh/JoshuaKGoldberg/TypeStat)
[![NPM version](https://badge.fury.io/js/typestat.svg)](http://badge.fury.io/js/typestat)
[![Join the chat at https://gitter.im/TypeStat/community](https://badges.gitter.im/TypeStat/community.svg)](https://gitter.im/TypeStat/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) -->

![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-14cc21.svg)

Gently fails test runs if the console was used during them.

## Usage

`console-fail-test` is meant to support any test runner; for now, it just works with **Jest**.
See [open test framework support issues](https://github.com/RyzacInc/console-fail-test/issues?q=is%3Aissue+is%3Aopen+label%3A%22test+framework+support%22) for progress on others!

### Jest

Use [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration.html) to run this before setting up test files:

```js
// jest.config.js
// ...
  setupFilesAfterEnv: ["<rootDir>/node_modules/console-fail-test/setup.js"],
// ...
```

Alternately, if you'd like to manually enable this in individual files, you can use the Node API:

```js
// some.test.js

require("console-fail-test").ctf();
```

## Why?

Logging to the console during tests can be a sign of

-   🚫 warnings from third-party libraries such as React for improper usage
-   🤕 temporary code that shouldn't be checked into your project
-   📢 unnecessary spam in your tests window

This little library throws an error after each test if a console method was called during it.
It's got some nifty features:

-   📊 Summary of which methods are called with calling arguments
-   ✅ Failures are thrown _after_ tests finish, so your tests will fail normally if the should

Look how fancy the terminal output is!

![Terminal output showing details on each console call failing a test](./images/sample.png)
