# Development

Thanks so much for your interest! 🙌

We'd love to work with you.
Please check for open issues before filing your own; if you'd like to send a pull request, make sure there's an open issue marked [accepting prs](https://github.com/RyzacInc/console-fail-test/labels/accepting%20prs) first.

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

console-fail-test detects the executing test framework and runs the corresponding test hooks automatically.

### Adding a Test Framework

If you use a test framework console-fail-test doesn't yet support:

1. Find or file an issue tagged with [test framework support](https://github.com/RyzacInc/console-fail-test/issues?q=is%3Aissue+is%3Aopen+label%3A%22test+framework+support%22)
2. Add a new file under [`src/failers`](../src/failers) that exports two functions:
    - `check`, which returns whether that framework is being run
    - `run`, which executes test hooks if `check` returns `true`
        - If `run` detects any console logs, it should report them with [`complain`](../src/failers/complain.ts)
3. Add that failer to `allFailers` in [`src/failers/all.ts`](../src/failers/all.ts)

See [`src/failers/jest.ts`](../src/failers/jest.ts) as an example.
