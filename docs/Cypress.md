# Cypress

[Cypress](https://cypress.io) is supported as a testing framework.
It will be auto-detected if available.

## Setup

Import the setup file from your [support file](https://docs.cypress.io/app/core-concepts/writing-and-organizing-tests#Support-file):

```js
// cypress/support/e2e.js
import "console-fail-test/setup";
```

For [component testing](https://docs.cypress.io/app/component-testing/get-started), use `cypress/support/component.js` instead.

## Scope

console-fail-test checks the console of the browser window that runs your specs, including code such as `.then()` callbacks and mounted components.
It does not check the console of pages visited with `cy.visit()`, which run in a separate window.
