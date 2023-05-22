# Development

Thanks so much for your interest! 🙌

We'd love to work with you.
Please check for open issues before filing your own; if you'd like to send a pull request, make sure there's an open issue marked [accepting prs](https://github.com/JoshuaKGoldberg/console-fail-test/labels/accepting%20prs) first.

## Local Setup

After [forking the repository](https://help.github.com/en/articles/fork-a-repo), install npm modules with [Yarn](https://yarnpkg.com):

```shell
git clone https://github.com/<your-username-here>/console-fail-test
cd console-fail-test
yarn
```

console-fail-test is written in [TypeScript](https://github.com/Microsoft/TypeScript).
It defines its own typings instead of depending on any individual packages'.

You can build files with `yarn run compile`, or start TypeScript in watch mode with `yarn run compile --watch`.
Use `yarn run verify` to run a full build & lint.

## Test Framework Detection

console-fail-test detects the executing test framework by iterating through a list of known test frameworks and choosing the first that seems to match what's globally available.
For example, if a `jest` global variable is available, it's assumed that Jest is the executing test framework.

### Adding a Test Framework

If you use a test framework console-fail-test doesn't yet support:

1. Find or file an issue tagged with [test framework support](https://github.com/JoshuaKGoldberg/console-fail-test/issues?q=is%3Aissue+is%3Aopen+label%3A%22test+framework+support%22) and wait until it's marked as [accepting prs](https://github.com/JoshuaKGoldberg/console-fail-test/labels/accepting%20prs)
2. Add a new file under [`src/environments`](../src/environments) that exports a function matching `TestEnvironmentGetter`:
   - If the environment isn't provided and doesn't seem to exist, return `undefined`
   - If the environment is provided or does seem to exist, return an object with hooks to be called by [`cft.ts`](../src/cft.ts)
3. Add that getter to `testEnvironmentsByName` and `detectableTestEnvironmentSelectors` in [`src/environments/selectTestEnvironment.ts`](../src/environments/selectTestEnvironment.ts)

The `TestFramework` object potentially returned by a test framework selector will be used by [`cft.ts`](../src/cft.ts) to hook into the test framework:

- `afterEach`: Adds a callback to be called after each test.
  - console-fail-test will provide a callback that reports on called console methods, such as by throwing an error
- `beforeEach`: Adds a callback to be called before each test.
  - console-fail-test will provide a callback that resets console spies

See [`src/environments/jest.ts`](../src/environments/jest.ts) as an example.

## Spy Library Detection

As with test frameworks, console-fail-test detects the global presence of common spy libraries to determine what to spy on console methods with.
This logic similarly iterates through a list of known spy libraries and chooses the first that seems to match what's globally available.
For example, if a `jest` global variable and `jest.fn` are available, it's assumed that Jest's spies are to be used as spy functions.

### Adding a Spy Library

If you use a spy library console-fail-test doesn't yet support:

1. Find or file an issue tagged with [spy library support](https://github.com/JoshuaKGoldberg/console-fail-test/issues?q=is%3Aissue+is%3Aopen+label%3A%22spy+library+support%22) and wait until it's marked as [accepting prs](https://github.com/JoshuaKGoldberg/console-fail-test/labels/accepting%20prs)
2. Add a new file under [`src/spies`](../src/spies) that exports a function matching matching `SpyFactoryGetter`:
   - If the spy library isn't provided and doesn't seem to exist, return `undefined`
   - If the spy library is provided or does seem to exist, return a method that, given a container object and method name, spies on that method on the container
3. Add that getter to `spyFactoriesByName` and `detectableSpyFactoryGetters` in [src/spies/selectSpyFactory.ts](../src/spies/selectSpyFactory.ts).

The `TestFramework` object potentially returned by a test framework selector include methods that hook into the test framework:

- `afterEach`: Adds a callback to be called after each test.
  - console-fail-test will provide a callback that reports on called console methods, such as by throwing an error
- `beforeEach`: Adds a callback to be called before each test.
  - console-fail-test will provide a callback that resets console spies

The `SpyFactorySelector` function potentially returned by a test framework selector will be used by [`cft.ts`](../src/cft.ts) to create method spies on the console.
It receives as parameters:

1. `container`: An object whose method is to be spied on.
   This will practically always be `console`.
   - Note that in future versions of console-fail-test, this may expand to include other objects.
2. `methodName`: The key of the method to spy on, such as `"log"`.

The function should return an object with:

- `getCalls`: Returns an array containing the arguments to each call of the function.
- `restore`: Restores the original method on the container.

See [`src/spies/jest.ts`](../src/spies/jest.ts) as an example.

## Unit Tests

This repository uses [Vitest](https://vitest.dev) for a small amount of unit test coverage.
You can run it locally on the command-line:

```shell
pnpm run test
```

Test environments and spy frameworks don't need to be unit tested just yet.

### Debugging Tests

This repository includes a [VS Code launch configuration](https://code.visualstudio.com/docs/editor/debugging) for debugging unit tests.
To launch it, open a test file, then run _Debug Current Test File_ from the VS Code Debug panel (or press F5).
