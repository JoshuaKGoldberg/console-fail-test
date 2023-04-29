# console-fail-test

[![GitHub CI](https://github.com/JoshuaKGoldberg/console-fail-test/actions/workflows/compile.yml/badge.svg)](https://github.com/JoshuaKGoldberg/console-fail-test/actions/workflows/compile.yml)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/console-fail-test.svg)](http://badge.fury.io/js/console-fail-test)
[![Downloads](http://img.shields.io/npm/dm/console-fail-test.svg)](https://npmjs.org/package/console-fail-test)

Gently fails test runs if the console was used during them.

## Why?

Logging to the console during tests can be a sign of:

- 🚫 warnings from third-party libraries such as React for improper usage
- 🤕 temporary code that shouldn't be checked into your project
- 📢 unnecessary spam in your tests window

This little library throws an error after each test if a console method was called during it.
It's got some nifty features:

- 📊 Summary of which methods are called with calling arguments
- 🛫 Failures are thrown _after_ tests finish, so your tests will fail normally if they should

```plaintext
stdout | src/index.test.ts > index > example test that console.logs
Whoopsies!

 ❯ src/index.test.ts (4)
   ❯ index (4)
     × example test that console.logs
       ⠙ [ afterEach ]
     ✓ example test that does not console.log

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯- Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯-

 FAIL  src/index.test.ts > index > example test that console.logs
Error: Oh no! Your test called the following console method:
  * log (1 call)
    > Call 0: "Whoopsies!"
```

## Usage

`console-fail-test` is meant to support any _(test framework)_ & _(spy library)_ combination.
It will auto-detect your combination if possible and use the most appropriate environment hooks and function spies it can find.

For example, in a Jest config:

```js
// jest.config.js
setupFilesAfterEnv: ["console-fail-test/setup.js"],
```

### Test Frameworks

See the _Documentation_ link for each supported framework for how to set up console-fail-test with that framework.

<table>
  <thead>
    <tr>
      <td>Framework</td>
      <td>Support?</td>
      <td>API Request</td>
      <td>Documentation</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ava</td>
      <td>
        ✅️
      </td>
      <td>
        <code>require("ava")</code>
      </td>
      <td>
        <a href="./docs/Ava.md">
          <code>Ava.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Mocha</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"mocha"</code>
      </td>
      <td>
        <a href="./docs/Mocha.md">
          <code>Mocha.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Jasmine</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"jasmine"</code>
      </td>
      <td>
        <a href="./docs/Jasmine.md">
          <code>Jasmine.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Jest</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"jest"</code>
      </td>
      <td>
        <a href="./docs/Jest.md">
          <code>Jest.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>lab</td>
      <td>
        ✅
      </td>
      <td>
        <code>exports.lab</code>
      </td>
      <td>
        <a href="./docs/Lab.md">
          <code>Lab.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>node-tap</td>
      <td>
        ✅️
      </td>
      <td>
        <code>require("node-tap")</code>
      </td>
      <td>
        <a href="./docs/NodeTap.md">
          <code>NodeTap.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Vitest</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"vitest"</code>
      </td>
      <td>
        <a href="./docs/Vitest.md">
          <code>Vitest.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Cypress</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/199">
          <code>/issues/199</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>QUnit</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/19">
          <code>/issues/19</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Playwright</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/198">
          <code>/issues/198</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>tape</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/17">
          <code>/issues/17</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>TestCafe</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/15">
          <code>/issues/15</code>
        </a>
      </td>
    </tr>
  </tbody>
</table>

### Spy Libraries

If your test framework provides its own spy library, console-fail-test will by default use that library.
If a supported spy library isn't detected, an internal fallback will be used to spy on `console` methods.

You can request a specific test library using the Node API with its API request:

```js
require("console-fail-test").cft({
  spyLibrary: "sinon",
});
```

<table>
  <thead>
    <tr>
      <td>Library</td>
      <td>Support?</td>
      <td>API Request</td>
      <td>Spy</td>
      <td>Documentation</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Jasmine</td>
      <td>
        ✅️
      </td>
      <td>
        <code>"jasmine"</code>
      </td>
      <td>
        <a href="https://jasmine.github.io/2.0/introduction.html#section-Spies">
          <code>jasmine.createSpy()</code>
        </a>
      </td>
      <td>
        <a href="./docs/Jasmine.md#spies">
          <code>Jasmine.md#spies</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Jest</td>
      <td>
        ✅️
      </td>
      <td>
        <code>"jest"</code>
      </td>
      <td>
        <a href="https://jestjs.io/docs/en/mock-functions.html">
          <code>jest.fn()</code>
        </a>
      </td>
      <td>
        <a href="./docs/Jest.md#spies">
          <code>Jest.md#spies</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Sinon</td>
      <td>
        ✅️
      </td>
      <td>
        <code>require("sinon")</code>
      </td>
      <td>
        <a href="https://sinonjs.org/releases/latest/spies">
          <code>sinon.spy()</code>
        </a>
      </td>
      <td>
        <a href="./docs/Sinon.md#spies">
          <code>Sinon.md#spies</code>
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Ignoring `console` methods

By default, `console-fail-test` will error on _any_ called `console` method. If you'd like allow certain methods, pass a `console` object to the `cft` API when you set it up:

```js
require("console-fail-test").cft({
  console: {
    warn: true, // won't error on any instance of console.warn
  },
});
```

## Development

Requires:

- [Node.js](https://nodejs.org) >14 (LTS)
- [Yarn](https://yarnpkg.com/en)

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo):

```shell
git clone https://github.com/<your-name-here>/console-fail-test
cd console-fail-test
yarn
```

### Contribution Guidelines

We'd love to have you contribute!
Check the [issue tracker](https://github.com/JoshuaKGoldberg/console-fail-test/issues) for issues labeled [`accepting prs`](https://github.com/JoshuaKGoldberg/console-fail-test/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22accepting+prs%22) to find bug fixes and feature requests the community can work on.
If this is your first time working with this code, the [`good first issue`](https://github.com/JoshuaKGoldberg/console-fail-test/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+) label indicates good introductory issues.

Please note that this project is released with a [Contributor Covenant](https://www.contributor-covenant.org).
By participating in this project you agree to abide by its terms.
See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
