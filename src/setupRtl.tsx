import { render, type RenderOptions } from "@testing-library/react";
import React from "react";

import { RemainingPropsAndTestOverrides, FullProps, RenderRtl, SetupComponentType } from "./types";

/**
 * Creates a `renderView` function that can be used in unit tests to mount a component.
 *
 * @param Component - React component to be rendered.
 * @param baseProps - Any default props to pass to the component in all tests.
 * @example
 * ```tsx
 * const renderView = setupRtl(ButtonWithText, { onClick: jest.fn() })
 *
 * const text = 'Hooray!';
 * const { props: { onClick }, view } = renderView({ text });
 *
 * FireEvent.click(view.getByRole('button'));
 *
 * expect(onClick).toHaveBeenCalledWith(text);
 * ```
 */
export function setupRtl<
  ComponentType extends SetupComponentType,
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  BaseProps extends Partial<FullProps<ComponentType>> = {},
>(Component: ComponentType, baseProps?: BaseProps): RenderRtl<ComponentType, BaseProps> {
  let options: RenderOptions;

  function renderView(testProps?: RemainingPropsAndTestOverrides<ComponentType, BaseProps>) {
    const props = {
      ...baseProps,
      ...testProps,
    } as FullProps<ComponentType>;
    const view = render(<Component {...(props as any)} />, options);
    const update = (updatedProps: Partial<FullProps<ComponentType>>) =>
      view.rerender(<Component {...(props as any)} {...updatedProps} />);

    return { props, view, update };
  }

  renderView.options = (newOptions: RenderOptions) => {
    options = newOptions;
    return renderView;
  };

  return renderView;
}
