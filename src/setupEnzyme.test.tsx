import React from "react";

import { setupEnzyme } from "./setupEnzyme";

type MyComponentProps = {
  text: string;
  optional?: number;
};

const MyComponent: React.FC<MyComponentProps> = ({ text }: MyComponentProps) => {
  return <div>{text}</div>;
};

const text = "default";
const overridden = "overridden";

describe("setupEnzyme", () => {
  it("uses a default prop value when not overridden", async () => {
    const renderWrapper = setupEnzyme(MyComponent, { text });

    const { wrapper } = renderWrapper();

    expect(wrapper.text()).toEqual(text);
  });

  it("uses an overridden prop value when not overridden", async () => {
    const renderWrapper = setupEnzyme(MyComponent, { text });

    const { wrapper } = renderWrapper({ text: overridden });

    expect(wrapper.text()).toEqual(overridden);
  });

  it("updates view with new props when passed", () => {
    const renderView = setupEnzyme(MyComponent, { text });

    const { wrapper, update } = renderView();

    expect(wrapper.text()).toEqual(text);

    update({ text: overridden });

    expect(wrapper.text()).toEqual(overridden);
  });

  describe("enforces that required props that are missing in the initial setup are provided in the render method", () => {
    it("when props are completely absent", async () => {
      const renderWrapper = setupEnzyme(MyComponent);

      const { wrapper } = renderWrapper({ text });

      expect(wrapper.text()).toEqual(text);
    });

    it("when props are incomplete in defaults", async () => {
      const renderWrapper = setupEnzyme(MyComponent, { optional: 10 });

      const { wrapper } = renderWrapper({ text });

      expect(wrapper.text()).toEqual(text);
    });
  });

  it("can handle a pure function component", () => {
    const renderView = setupEnzyme(({ text }: MyComponentProps) => <div>{text}</div>);

    const { props, wrapper } = renderView({ text });

    expect(wrapper.text()).toEqual(props.text);
  });
});
