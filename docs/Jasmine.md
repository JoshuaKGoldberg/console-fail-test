# Jasmine

Jasmine is supported both as a testing framework and a spy library.
It will be auto-detected if available.

## Setup

Use [`helpers`](https://jasmine.github.io/setup/nodejs.html#configuration) to run this before setting up test files:

```json
{
	"helpers": ["../node_modules/console-fail-test/setup.js"]
}
```

Note that helper paths may be resolved relative to your spec directory.

Alternately, if you have a helper file already being run first, or you'd like to manually enable this in individual files, you can use the Node API:

```js
// someSpec.js

require("console-fail-test").cft();
```

## Spies

Global `console` methods will be replaced by `jasmine.createSpy()` spies.
You can inspect them at runtime as usual per Jasmine spies.
See Jasmine's [spy docs](https://jasmine.github.io/2.0/introduction.html#section-Spies).
