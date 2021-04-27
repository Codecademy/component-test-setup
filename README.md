# 🛠 component-test-setup

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/component-test-setup.svg)](http://badge.fury.io/js/component-test-setup)
[![Circle CI](https://img.shields.io/circleci/build/github/Codecademy/component-test-setup.svg)](https://circleci.com/gh/Codecademy/component-test-setup)
[![Join the chat at https://gitter.im/Codecademy/component-test-setup](https://badges.gitter.im/Codecademy/component-test-setup.svg)](https://gitter.im/Codecademy/component-test-setup?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Standardized test setup methods for React components.

Tired of copy and pasting default prop templates for React component tests?
Use this cute little package with React Testing Library or Enzyme to standardize your component setups.

> 🧠 This library is a _very_ small wrapper on top of Enzyme or RTL, and exists only to help standardize test setup behavior.

## Usage

```shell
npm install component-test-setup --save-dev
```

For both RTL and Enzyme, this library provides a `setup*` function that takes in:

1. Your React component class or function
2. Any prop defaults for the component _(optional)_

That function returns a `render*` function that takes in any more props and returns:

- The library's rendered equivalent: `view` for RTL and `wrapper` for Enzyme.
- `props`: The computed props the component rendered with.

### React Testing Library

Use `setupRtl` to create a `renderView` function.
It returns a `view` result from RTL and a `props` object of the computed props used to render.

```js
import { setupRtl } from "component-test-setup";

import { MyComponent } from "./MyComponent";

const renderView = setupRtl(MyComponent, {
  someProp: "value",
});

describe("MyComponent", () => {
  it("does a thing", () => {
    const { props, view } = renderView({
      some: "otherProp",
    });

    view.getByText(props.someProp);
  });
});
```

#### RTL `options`

The `setupRtl` API in particular allows a `.options` function on the returned `renderView` function to set the RTL [`RenderOptions`](https://testing-library.com/docs/react-testing-library/api#render-options).

```ts
const { view } = renderView(MyComponent).options({
  wrapper: AllTheProviders,
});
```

### Enzyme

Use `setupEnzyme` to create a `renderWrapper` function.
It returns a `wrapper` result from RTL and a `props` object of the computed props used to render.

```js
import { setupEnzyme } from "component-test-setup";

import { MyComponent } from "./MyComponent";

const renderWrapper = setupEnzyme(MyComponent, {
  someProp: "value",
});

describe("MyComponent", () => {
  it("does a thing", () => {
    const { props, wrapper } = renderWrapper({
      some: "otherProp",
    });

    wrapper.getByText(props.someProp);
  });
});
```

### Updating Props

Often you'd like to test lifecycle methods/hooks and `component-test-setup` is written to help accommodate that.

For both RTL and Enzyme the API is the same, the `update` method returned in the `render*` method:

```js
const renderWrapper = setupEnzyme(MyComponent, {
  someProp: "value",
});

describe("MyComponent", () => {
  it("does a thing", () => {
    const { wrapper, update } = renderWrapper({
      some: "otherProp",
    });

    update({ someProp: "another-value" });

    wrapper.getByText("another-value"); // It has been updated to render with the new someProp value
  });
});
```

Please note: This currently _does not_ update the `props` object that's returned in the `render*` method. It will be locked into whatever the initial completed props were for the first render.

### TypeScript Usage

`component-test-setup` is written in TypeScript and generally type safe.

- Props passed to components are typed as the component's props.
- If a subset of required props are passed as defaults, the returned `render*` function will require only remaining required props.

```ts
type MyComponentProps = {
  requiredA: string;
  requiredB: string;
};

declare const MyComponent: React.ComponentType<MyComponentProps>;

const renderView = setupRtl(MyComponent, {
  requiredA: "a",
});

describe("MyComponent", () => {
  it("does a thing", () => {
    const { props, view } = renderView({
      requiredB: "b",
    });

    view.getByText(props.someProp);
  });
});
```

- It is also set up to understand which of the required props have already been passed and which ones have not, allowing you to bypass sending anything at all into the `render*` method if you've already passed everything it needs:

```ts
type MyComponentProps = {
  requiredA: string;
  requiredB: string;
};

declare const MyComponent: React.ComponentType<MyComponentProps>;

const renderView = setupRtl(MyComponent, {
  requiredA: "a",
  requiredB: "b",
});

describe("MyComponent", () => {
  it("does a thing", () => {
    const { props, view } = renderView();

    view.getByText(props.someProp);
  });
});
```

- And of course, you may always provide overrides and/or optional props into your `render*` methods:

```ts
type MyComponentProps = {
  requiredA: string;
  optional?: string;
};

declare const MyComponent: React.ComponentType<MyComponentProps>;

const renderView = setupRtl(MyComponent, {
  requiredA: "a",
});

describe("MyComponent", () => {
  it("does a thing", () => {
    const { props, view } = renderView({
      requiredA: "override",
      optional: "I don't need to be here, but I wanna be",
    });

    view.getByText(props.someProp);
  });
});
```

_Heck yes._ 🤘

## Development

Requires:

- [Node.js](https://nodejs.org) >12
- [Yarn](https://yarnpkg.com/en)

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo):

```
git clone https://github.com/<your-name-here>/component-test-setup
cd component-test-setup
yarn
```

### Contribution Guidelines

We'd love to have you contribute!
Check the [issue tracker](https://github.com/Codecademy/component-test-setup/issues) for issues labeled [`accepting prs`](https://github.com/Codecademy/component-test-setup/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22accepting+prs%22) to find bug fixes and feature requests the community can work on.
If this is your first time working with this code, the [`good first issue`](https://github.com/Codecademy/component-test-setup/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+) label indicates good introductory issues.

Please note that this project is released with a [Contributor Covenant](https://www.contributor-covenant.org).
By participating in this project you agree to abide by its terms.
See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
