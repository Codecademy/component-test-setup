import { render } from "@testing-library/react";
import { mount } from "enzyme";

export type FullProps<C extends React.ComponentType> = React.ComponentProps<C>;

type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, unknown> extends { [P in K]: T[K] } ? never : K;
}[keyof T];

export type HasRequiredField<T> = RequiredKeys<T> extends never ? false : true;

export type RenderEnzyme<C extends React.ComponentType, P extends Partial<FullProps<C>>> = (
  ...testProps: HasRequiredField<RemainingPropsAndTestOverrides<C, P>> extends true
    ? [RemainingPropsAndTestOverrides<C, P>]
    : [RemainingPropsAndTestOverrides<C, P>?]
) => RenderEnzymeReturn<C>;

interface RenderEnzymeReturn<C extends React.ComponentType> {
  props: FullProps<C>;
  wrapper: ReturnType<typeof mount>;
}

export type RenderRtl<C extends React.ComponentType, P extends Partial<FullProps<C>>> = (
  ...testProps: HasRequiredField<RemainingPropsAndTestOverrides<C, P>> extends true
    ? [RemainingPropsAndTestOverrides<C, P>]
    : [RemainingPropsAndTestOverrides<C, P>?]
) => RenderRtlReturn<C>;

interface RenderRtlReturn<C extends React.ComponentType> {
  props: FullProps<C>;
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
