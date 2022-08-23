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
For example, if `jest` is available, it's assumed that Jest is the executing test framework.

### Adding a Test Framework

If you use a test framework console-fail-test doesn't yet support:

1. Find or file an issue tagged with [test framework support](https://github.com/JoshuaKGoldberg/console-fail-test/issues?q=is%3Aissue+is%3Aopen+label%3A%22test+framework+support%22) and wait until it's marked as [accepting prs](https://github.com/JoshuaKGoldberg/console-fail-test/labels/accepting%20prs)
2. Add a new file under [`src/environments`](../src/environments) that exports a function matching `TestEnvironmentGetter`:
   - If the environment isn't provided and doesn't seem to exist, return `undefined`
   - If the environment is provided or does seem to exist, return an object with hooks to be called by [`cft.ts`](../src/cft.ts)
3. Add that getter to `testEnvironmentsByName` and `detectableTestEnvironmentGetters` in [`src/environments/selectTestEnvironment.ts`](../src/environments/selectTestEnvironment.ts)

See [`src/environments/jest.ts`](../src/environments/jest.ts) as an example.

## Spy Library Detection

As with test frameworks, console-fail-test detects the global presence of common spy libraries to determine what to spy on console methods with.
This logic similarly iterates through a list of known spy libraries and chooses the first that seems to match what's globally available.
For example, if `jest` and `jest.fn` are available, it's assumed that Jest's spies are to be used as spy functions.

### Adding a Spy Library

If you use a spy library console-fail-test doesn't yet support:

1. Find or file an issue tagged with [spy library support](https://github.com/JoshuaKGoldberg/console-fail-test/issues?q=is%3Aissue+is%3Aopen+label%3A%22spy+library+support%22) and wait until it's marked as [accepting prs](https://github.com/JoshuaKGoldberg/console-fail-test/labels/accepting%20prs)
2. Add a new file under [`src/spies`](../src/spies) that exports a function matching matching `SpyFactoryGetter`:
   - If the spy library isn't provided and doesn't seem to exist, return `undefined`
   - If the spy library is provided or does seem to exist, return a method that, given a container object and method name, spies on that method on the container
3. Add that getter to `spyFactoriesByName` and `detectableSpyFactoryGetters` in [src/spies/selectSpyFactory.ts](../src/spies/selectSpyFactory.ts).

The returned object containing `getCalls` and `restore` returned by `spyOn` will be used by [`cft.ts`](../src/cft.ts) to check whether the method was called.

See [`src/spies/jest.ts`](../src/spies/jest.ts) as an example.
