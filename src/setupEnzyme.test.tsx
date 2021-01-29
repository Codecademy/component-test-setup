import React from "react";

import { setupEnzyme } from "./setupEnzyme";

type MyComponentProps = {
  text: string;
  optional?: number;
};

const MyComponent: React.FC<MyComponentProps> = ({ text }: MyComponentProps) => {
  return <div>{text}</div>;
};

describe("setupEnzyme", () => {
  it("uses a default prop value when not overridden", async () => {
    const text = "default";
    const renderWrapper = setupEnzyme(MyComponent, { text });

    const { wrapper } = renderWrapper();

    expect(wrapper.text()).toEqual(text);
  });

  it("uses an overridden prop value when not overridden", async () => {
    const text = "overridden";
    const renderWrapper = setupEnzyme(MyComponent, { text: "default" });

    const { wrapper } = renderWrapper({ text });

    expect(wrapper.text()).toEqual(text);
  });

  describe("enforces that required props that are missing in the initial setup are provided in the render method", () => {
    const text = "default";

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
});
