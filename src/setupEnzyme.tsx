import { mount } from "enzyme";
import React from "react";

import { RemainingPropsAndTestOverrides } from "./types";

/**
 * Creates a `renderWrapper` function that can be used in unit tests to mount a component.
 *
 * @param Component - React component to be rendered.
 * @param baseProps - Any default props to pass to the component in all tests.
 * @example
 * ```tsx
 * const renderWrapper = setupEnzyme(ButtonWithText, { onClick: jest.fn() })
 *
 * const text = 'Hooray!';
 * const { props: { onClick }, wrapper } = renderWrapper({ text });
 *
 * wrapper.find('button').simulate('click');
 *
 * expect(onClick).toHaveBeenCalledWith(text);
 * ```
 */
export function setupEnzyme<
  ComponentType extends React.ComponentType,
  BaseProps extends Partial<React.ComponentProps<ComponentType>>
>(Component: ComponentType, baseProps?: BaseProps) {
  return function renderWrapper(
    testProps?: RemainingPropsAndTestOverrides<ComponentType, BaseProps>,
  ) {
    const props = {
      ...baseProps,
      ...testProps,
    } as React.ComponentProps<ComponentType>;
    const wrapper = mount(<Component {...(props as any)} />);

    return { props, wrapper };
  };
}
