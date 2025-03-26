<h1 align="center">console-fail-test</h1>

<p align="center">
	Gently fails test runs if the console was used during them.
	📢
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 6" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-6-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/console-fail-test/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/console-fail-test" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/console-fail-test?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/console-fail-test/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/console-fail-test"><img alt="📦 npm version" src="https://img.shields.io/npm/v/console-fail-test?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

`console-fail-test` is meant to support any _(test framework)_ & _(spy library)_ combination.
It will auto-detect your combination if possible and use the most appropriate environment hooks and function spies it can find.

For example, in a Jest config:

```ts
// jest.config.js
module.exports = {
	setupFilesAfterEnv: ["console-fail-test/setup.mjs"],
};
```

> If your package only supports CommonJS, you can use `console-fail-test/setup.cjs`.

### Test Frameworks

See the _Documentation_ link for each supported framework for how to set up console-fail-test with that framework.

<table>
  <thead>
    <tr>
      <td>Framework</td>
      <td>Support?</td>
      <td>API Request</td>
      <td>Documentation</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ava</td>
      <td>
        ✅️
      </td>
      <td>
        <code>require("ava")</code>
      </td>
      <td>
        <a href="./docs/Ava.md">
          <code>Ava.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Mocha</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"mocha"</code>
      </td>
      <td>
        <a href="./docs/Mocha.md">
          <code>Mocha.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Jasmine</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"jasmine"</code>
      </td>
      <td>
        <a href="./docs/Jasmine.md">
          <code>Jasmine.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Jest</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"jest"</code>
      </td>
      <td>
        <a href="./docs/Jest.md">
          <code>Jest.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>lab</td>
      <td>
        ✅
      </td>
      <td>
        <code>exports.lab</code>
      </td>
      <td>
        <a href="./docs/Lab.md">
          <code>Lab.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>node-tap</td>
      <td>
        ✅️
      </td>
      <td>
        <code>require("node-tap")</code>
      </td>
      <td>
        <a href="./docs/NodeTap.md">
          <code>NodeTap.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Vitest</td>
      <td>
        ✅️
        ✨
      </td>
      <td>
        <code>"vitest"</code>
      </td>
      <td>
        <a href="./docs/Vitest.md">
          <code>Vitest.md</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Cypress</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/199">
          <code>/issues/199</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>QUnit</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/19">
          <code>/issues/19</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Playwright</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/198">
          <code>/issues/198</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>tape</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/17">
          <code>/issues/17</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>TestCafe</td>
      <td>⚙️</td>
      <td></td>
      <td>
        <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues/15">
          <code>/issues/15</code>
        </a>
      </td>
    </tr>
  </tbody>
</table>

### Spy Libraries

If your test framework provides its own spy library, console-fail-test will by default use that library.
If a supported spy library isn't detected, an internal fallback will be used to spy on `console` methods.

You can request a specific test library using the Node API with its API request:

```ts
import { cft } from "console-fail-test";

cft({
	spyLibrary: "sinon",
});
```

<table>
  <thead>
    <tr>
      <td>Library</td>
      <td>Support?</td>
      <td>API Request</td>
      <td>Spy</td>
      <td>Documentation</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Jasmine</td>
      <td>
        ✅️
      </td>
      <td>
        <code>"jasmine"</code>
      </td>
      <td>
        <a href="https://jasmine.github.io/2.0/introduction.html#section-Spies">
          <code>jasmine.createSpy()</code>
        </a>
      </td>
      <td>
        <a href="./docs/Jasmine.md#spies">
          <code>Jasmine.md#spies</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Jest</td>
      <td>
        ✅️
      </td>
      <td>
        <code>"jest"</code>
      </td>
      <td>
        <a href="https://jestjs.io/docs/en/mock-functions.html">
          <code>jest.fn()</code>
        </a>
      </td>
      <td>
        <a href="./docs/Jest.md#spies">
          <code>Jest.md#spies</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Sinon</td>
      <td>
        ✅️
      </td>
      <td>
        <code>require("sinon")</code>
      </td>
      <td>
        <a href="https://sinonjs.org/releases/latest/spies">
          <code>sinon.spy()</code>
        </a>
      </td>
      <td>
        <a href="./docs/Sinon.md#spies">
          <code>Sinon.md#spies</code>
        </a>
      </td>
    </tr>
    <tr>
      <td>Vitest</td>
      <td>
        ✅️
      </td>
      <td>
        <code>"vitest"</code>
      </td>
      <td>
        <a href="https://vitest.dev/guide/mocking.html#functions">
          <code>vi.fn()</code>
        </a>
      </td>
      <td>
        <a href="./docs/Vitest.md#spies">
          <code>Vitest.md#spies</code>
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Ignoring `console` methods

By default, `console-fail-test` will error on _any_ called `console` method.
If you'd like allow certain methods, pass a `console` object to the `cft` API when you set it up:

```ts
import { cft } from "console-fail-test";

cft({
	console: {
		warn: true, // won't error on any instance of console.warn
	},
});
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 📢

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mackenco"><img src="https://avatars.githubusercontent.com/u/4284340?v=4?s=100" width="100px;" alt="Colin MacKenzie"/><br /><sub><b>Colin MacKenzie</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/console-fail-test/commits?author=mackenco" title="Code">💻</a> <a href="#ideas-mackenco" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.kop.ax/"><img src="https://avatars.githubusercontent.com/u/77674046?v=4?s=100" width="100px;" alt="Dimitri Kopriwa"/><br /><sub><b>Dimitri Kopriwa</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/console-fail-test/commits?author=kopax-polyconseil" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://farazpatankar.com/"><img src="https://avatars.githubusercontent.com/u/10681116?v=4?s=100" width="100px;" alt="Faraz Patankar"/><br /><sub><b>Faraz Patankar</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues?q=author%3Afarazpatankar" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/joel-darós-95536a21/?locale=en_US"><img src="https://avatars.githubusercontent.com/u/992049?v=4?s=100" width="100px;" alt="Joel"/><br /><sub><b>Joel</b></sub></a><br /><a href="#ideas-joel-daros" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/JoshuaKGoldberg/console-fail-test/commits?author=joel-daros" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/console-fail-test/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/JoshuaKGoldberg/console-fail-test/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/console-fail-test/commits?author=JoshuaKGoldberg" title="Tests">⚠️</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/console-fail-test/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sosukesuzuki"><img src="https://avatars.githubusercontent.com/u/14838850?v=4?s=100" width="100px;" alt="SUZUKI Sosuke"/><br /><sub><b>SUZUKI Sosuke</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/console-fail-test/commits?author=sosukesuzuki" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).
