# console-fail-test

<!-- [![Circle CI](https://circleci.com/gh/JoshuaKGoldberg/TypeStat.svg?style=svg)](https://circleci.com/gh/JoshuaKGoldberg/TypeStat)
[![NPM version](https://badge.fury.io/js/typestat.svg)](http://badge.fury.io/js/typestat)
[![Join the chat at https://gitter.im/TypeStat/community](https://badges.gitter.im/TypeStat/community.svg)](https://gitter.im/TypeStat/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) -->

![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-14cc21.svg)

Gently fails test runs if the console was used during them.

## Why?

Logging to the console during tests can be a sign of

-   warnings from third-party libraries such as React for improper usage
-   temporary code that shouldn't be checked into your project
-   unnecessary spam in your tests window

This little library throws an error after each test if a console method was called during it.
It's got some nifty features:

-   Summary of which methods are called with calling arguments
-   Failures are thrown after the test finishes, so your tests will fail normally if the should.

Look how fancy the terminal output is!

![Terminal output showing details on each console call failing a test](./images/sample.png)
