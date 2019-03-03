# Sinon

Sinon is supported as a spy library.
It will be auto-detected if `sinon.spy` is globally available.

Otherwise, pass `require("sinon")` as your `spyLibrary` request:

```js
require("console-fail-test").cft({
    spyLibrary: require("sinon"),
});
```

## Spies

Global `console` methods will be replaced by `sinon.spy()` spies.
You can inspect them at runtime as usual per Sinon spies.
See Sinon's [spy functions docs](https://sinonjs.org/releases/latest/spies/).
