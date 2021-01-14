import { render } from "@testing-library/react";
import { mount } from "enzyme";

export type FullProps<C extends React.ComponentType> = React.ComponentProps<C>;

export type RenderEnzyme<
  Component extends React.ComponentType,
  Props extends Partial<FullProps<Component>>
> = (
  ...testProps: ConditionallyRequiredTestProps<Component, Props>
) => RenderEnzymeReturn<Component>;

export type RenderRtl<
  Component extends React.ComponentType,
  Props extends Partial<FullProps<Component>>
> = (...testProps: ConditionallyRequiredTestProps<Component, Props>) => RenderRtlReturn<Component>;

type ConditionallyRequiredTestProps<
  Component extends React.ComponentType,
  Props extends Partial<FullProps<Component>>
> = HasRequiredField<RemainingPropsAndTestOverrides<Component, Props>> extends true
  ? [RemainingPropsAndTestOverrides<Component, Props>]
  : [RemainingPropsAndTestOverrides<Component, Props>?];

type HasRequiredField<T> = RequiredKeys<T> extends never ? false : true;

type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, unknown> extends { [P in K]: T[K] } ? never : K;
}[keyof T];

interface RenderEnzymeReturn<Component extends React.ComponentType> {
  props: FullProps<Component>;
  wrapper: ReturnType<typeof mount>;
}
interface RenderRtlReturn<Component extends React.ComponentType> {
  props: FullProps<Component>;
  view: ReturnType<typeof render>;
}

/**
 * Given the type of a React component and the type of 'base' (a.k.a. 'default') props
 * preset for it, this returns a type containing two things:
 * * Required: any props not already provided in the base props
 * * Optional: any overrides for the base props
 */
export type RemainingPropsAndTestOverrides<
  ComponentType extends React.ComponentType,
  BaseProps extends Partial<FullProps<ComponentType>>
> =
  | Omit<FullProps<ComponentType>, keyof BaseProps>
  | Pick<FullProps<ComponentType>, keyof Partial<FullProps<ComponentType>>>;
