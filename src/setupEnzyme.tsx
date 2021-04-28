import { mount } from "enzyme";
import React from "react";

import {
  RemainingPropsAndTestOverrides,
  FullProps,
  RenderEnzyme,
  SetupComponentType,
} from "./types";

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
  ComponentType extends SetupComponentType,
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  BaseProps extends Partial<FullProps<ComponentType>> = {}
>(Component: ComponentType, baseProps?: BaseProps): RenderEnzyme<ComponentType, BaseProps> {
  return function renderWrapper(
    testProps?: RemainingPropsAndTestOverrides<ComponentType, BaseProps>,
  ) {
    const props = {
      ...baseProps,
      ...testProps,
    } as FullProps<ComponentType>;
    const wrapper = mount(<Component {...(props as any)} />);

    // setProps demands _something_ be passed, so we keep that going, too
    const update = (updatedProps: Pick<FullProps<ComponentType>, keyof FullProps<ComponentType>>) =>
      wrapper.setProps(updatedProps);

    return { props, wrapper, update };
  };
}
