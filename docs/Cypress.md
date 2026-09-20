# Cypress

[Cypress](https://cypress.io) is supported as a testing framework.
It will be auto-detected if available.

## Setup

Import the setup file from your [support file](https://docs.cypress.io/app/core-concepts/writing-and-organizing-tests#Support-file), which Cypress runs in the browser before each spec:

```js
// cypress/support/e2e.js
import "console-fail-test/setup";
```

Use `cypress/support/component.js` for [component testing](https://docs.cypress.io/app/component-testing/get-started) instead of or in addition to `cypress/support/e2e.js`.

Alternately, if you'd like to configure options or manually enable this in individual specs, you can use the Node API:

```js
// cypress/support/e2e.js
import { cft } from "console-fail-test";

cft();
```

## Scope

Cypress runs specs and support files inside the browser, so console-fail-test spies on that browser window's `console`.
It reports calls made by your test code, including from callbacks such as `.then()`, and by code running in the same window, such as components mounted in component tests.

It does not check the console of a page visited with `cy.visit()` or of a [`cy.origin()`](https://docs.cypress.io/api/commands/origin) callback, which run in separate windows.
Cypress's own commands, including `cy.log()` and `Cypress.log()`, don't call the console and so aren't reported.

Some libraries write to the browser console as a normal part of running in development mode.
For example, development builds of React call `console.timeStamp()` to mark performance tracks.
Those methods can be allowed with the `console` option:

```js
// cypress/support/component.js
import { cft } from "console-fail-test";

cft({
	console: {
		timeStamp: true,
	},
});
```

## Failures

Console calls during a test are reported as a failure of that test rather than of an `afterEach` hook, so Cypress continues running the remaining tests in the suite.
Cypress doesn't retry tests failed this way even when [test retries](https://docs.cypress.io/app/guides/test-retries) are enabled.
