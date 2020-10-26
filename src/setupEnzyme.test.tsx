import React from "react";

import { setupEnzyme } from "./setupEnzyme";

type MyComponentProps = {
  text: string;
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
});
