import React from "react";

import * as RenderRTL from "@testing-library/react";

import { setupRtl } from "./setupRtl";

// We mock the module and then immediately spyOn it because due to the read-only nature
// of this module, we cannot spyOn it directly.
// We create a mock that's the actual implementation in our mocked function as a poor-man's spyOn.
jest.mock("@testing-library/react", () => ({
  render: jest.fn(jest.requireActual("@testing-library/react").render),
}));

// Just a helpful way to reference our spy.
const render = jest.spyOn(RenderRTL, "render");

type MyComponentProps = {
  text: string;
  optional?: number;
};

const MyComponent: React.FC<MyComponentProps> = ({ text }: MyComponentProps) => {
  return <div>{text}</div>;
};

describe("setupRtl", () => {
  beforeEach(jest.clearAllMocks);

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

  describe("uses overriden, In-n-Out secret-menu options", () => {
    // We don't care about the inner workings of the method
    beforeAll(() => render.mockImplementation());

    // Reset the mock so latter tests are unaffected
    afterAll(() => render.mockImplementation(jest.requireActual("@testing-library/react").render));

    it("passes overridden options into the render method", () => {
      const text = "just something";
      const options = { hydrate: true };

      const renderView = setupRtl(MyComponent, { text });

      renderView.options(options)();

      expect(render).toHaveBeenCalledTimes(1);
      expect(render).toHaveBeenCalledWith(<MyComponent text={text} />, options);
    });

    it("options are retained across calls to the method", () => {
      const text = "just something";
      const options = { hydrate: false };

      const renderView = setupRtl(MyComponent, { text });

      renderView.options(options);

      renderView(); // Different method call

      expect(render).toHaveBeenCalledTimes(1);
      expect(render).toHaveBeenCalledWith(<MyComponent text={text} />, options);
    });
  });
});
