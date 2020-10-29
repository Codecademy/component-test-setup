import React from "react";

import { setupRtl } from "./setupRtl";

type MyComponentProps = {
  text: string;
};

const MyComponent: React.FC<MyComponentProps> = ({ text }: MyComponentProps) => {
  return <div>{text}</div>;
};

describe("setupRtl", () => {
  it("uses a default prop value when not overridden", async () => {
    const text = "default";
    const renderView = setupRtl(MyComponent, { text });

    const { view } = renderView();

    view.getByText(text);
  });

  it("uses an overridden prop value when not overridden", async () => {
    const text = "overridden";
    const renderView = setupRtl(MyComponent, { text: "default" });

    const { view } = renderView({ text });

    view.getByText(text);
  });
});
