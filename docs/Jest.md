# Jest

Jest is supported both as a testing framework and a spy library.
It will be auto-detected if available.

## Setup

Use [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration.html) to run this before setting up test files:

```js
// jest.config.js
// ...
  setupFilesAfterEnv: ["console-fail-test/setup.js"],
// ...
```

Alternately, if you have a setup file already being run first, or you'd like to manually enable this in individual files, you can use the Node API:

```js
// some.test.js

require("console-fail-test").cft();
```

## Spies

Global `console` methods will be replaced by `jest.fn()` spies.
You can inspect them at runtime as usual per Jest spies.
See Jest's [mock functions docs](https://jestjs.io/docs/en/mock-functions.html).

If you'd like to use Jasmine's spies instead of Jest's, use the Node API with the `spyLibrary` option:

```js
require("console-fail-test").cft({
    spyLibrary: "jasmine",
});
```
