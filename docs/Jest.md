# Jest

Jest is supported both as a testing framework and a spy library.
It will be auto-detected if available.

## Setup

Use [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array) to run this before setting up test files:

```js
// jest.config.js
module.exports = {
	setupFilesAfterEnv: ["console-fail-test/setup"],
};
```

Alternately, if you have a setup file already being run first, or you'd like to manually enable this in individual files, you can use the Node API:

```js
// some.test.js

require("console-fail-test").cft();
```

### `setupFiles` vs. `setupFilesAfterEnv`

Jest has two similarly named options for setup files:

- [`setupFiles`](https://jestjs.io/docs/configuration#setupfiles-array): run _before_ Jest's test framework is installed
- [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array): run _after_ it is installed

console-fail-test hooks into Jest's `beforeEach` and `afterEach` globals, which don't exist yet in `setupFiles`.
Listing `console-fail-test/setup` in `setupFiles` instead of `setupFilesAfterEnv` will fail each test suite with:

```plaintext
Could not auto-detect test environment; consider passing it directly to cft.
```

Passing `testFramework: "jest"` explicitly doesn't help there either; move the entry to `setupFilesAfterEnv`.

## Spies

Global `console` methods will be replaced by `jest.fn()` spies.
You can inspect them at runtime as usual per Jest spies.
See Jest's [mock functions docs](https://jestjs.io/docs/mock-functions).

If you'd like to use Jasmine's spies instead of Jest's, use the Node API with the `spyLibrary` option:

```js
require("console-fail-test").cft({
	spyLibrary: "jasmine",
});
```
