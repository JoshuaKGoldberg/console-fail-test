# Sinon

Sinon is supported as a spy library.
It will be auto-detected if `sinon.spy` is globally available.

> If `sinon.spy` is not globally available without `import` or `require` calls,
> it will not be used!

## Spies

Global `console` methods will be replaced by `sinon.spy()` spies.
You can inspect them at runtime as usual per Sinon spies.
See Sinon's [spy functions docs](https://sinonjs.org/releases/latest/spies/).
