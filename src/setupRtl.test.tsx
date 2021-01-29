import React from "react";

import { setupRtl } from "./setupRtl";

type MyComponentProps = {
  text: string;
  optional?: number;
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

  describe("enforces that required props that are missing in the initial setup are provided in the render method", () => {
    const text = "default";

    it("when props are completely absent", async () => {
      const renderView = setupRtl(MyComponent);

      const { view } = renderView({ text });

      view.getByText(text);
    });

    it("when props are incomplete in defaults", async () => {
      const renderView = setupRtl(MyComponent, { optional: 10 });

      const { view } = renderView({ text });

      view.getByText(text);
    });
  });
});
