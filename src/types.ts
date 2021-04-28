import { RenderOptions, RenderResult } from "@testing-library/react";
import { ReactWrapper } from "enzyme";
import { ReactElement } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
interface PureFunctionComponent<P = {}> {
  (props?: P): ReactElement<any, any> | null;
}
export type SetupComponentType = React.ComponentType | PureFunctionComponent;

// Given a C component type, extracts the props of it:
// * If C is an explicitly declared React.Component subclass or React.FC, we can use React.ComponentProps
// * Otherewise if it's a regular function, we can extract its first parameter as the props
// * If not, we give up...
export type FullProps<C extends SetupComponentType> = C extends React.ComponentType
  ? React.ComponentProps<C>
  : C extends PureFunctionComponent
  ? Parameters<C>[0]
  : unknown;

export type RenderEnzyme<
  Component extends SetupComponentType,
  Props extends Partial<FullProps<Component>>
> = (
  // By using the spread operator in this type, we leverage the optionality of the entire argument itself.
  // eg: If the caller needs no more required props, we don't require they provide test props. But if
  //     they DO still need props, we require a parameter in the function signature.
  //     So the syntax `renderWrapper()` is valid if there are no required props,
  //     otherwise we force `renderWrapper({ ...missingReqs })`
  ...testProps: ConditionallyRequiredTestProps<Component, Props>
) => RenderEnzymeReturn<Component>;

// Just like RenderEnzyme, but RenderRtl also allows callers to do `renderRtl.options({...})(props)`
// In order to support both signature types, we extend the function's base type and add the options
// attribute for those "in the know" ;)
export type RenderRtl<
  Component extends SetupComponentType,
  Props extends Partial<FullProps<Component>>
> = {
  (...testProps: ConditionallyRequiredTestProps<Component, Props>): RenderRtlReturn<Component>;
  options: (options: RenderOptions) => RenderRtl<Component, Props>;
};

type ConditionallyRequiredTestProps<
  Component extends SetupComponentType,
  Props extends Partial<FullProps<Component>>
> =
  // This is where the real magic happens. At type-interpretation time, the compiler can infer from the
  // component's prop type and from the passed props into the `setup*` function if there are any missing
  // required props attributes (done in the `extends true` line).
  // If that's the case, then we require the `render*` method to not only take a props parameter, but we only
  // demand that it has whatever required props are missing (though it may still provide any optional ones or overrides, too).
  // And if the HasRequiredField type does NOT `extends true`, then we don't demand that a props param is provided
  // at all, though the caller is able to if they'd like.
  HasRequiredField<RemainingProps<Component, Props>> extends true
    ? // Though this syntax is unusual, by using an array type that's then spread above by `...testProps`, we can
      // leverage the optional array value `[T?]` syntax, which allows us to not even require any params
      // in our `render*` method at all
      [RemainingPropsAndTestOverrides<Component, Props>]
    : [RemainingPropsAndTestOverrides<Component, Props>?];

// Sort of a boolean value living in the type system. If the generic type T has no remaining required props,
// it's typed as `never` and we `extend` false, else `true`.
type HasRequiredField<T> = RequiredKeys<T> extends never ? false : true;

// This helper type is, as its name implies, pulling out only the required keys from the given interface.
// This is helpful, because when we use the `RemainingPropsAndTestOverrides` as the generic type T,
// we're figuring out at compile time which required props were NOT provided by the initial `setup*` call.
type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, unknown> extends { [P in K]: T[K] } ? never : K;
}[keyof T];

interface RenderEnzymeReturn<Component extends SetupComponentType>
  extends BaseRenderReturn<Component> {
  wrapper: ReactWrapper<FullProps<Component>, React.ComponentState>;
}
interface RenderRtlReturn<Component extends SetupComponentType>
  extends BaseRenderReturn<Component> {
  view: RenderResult;
}

interface BaseRenderReturn<Component extends SetupComponentType> {
  props: FullProps<Component>;
  update: (updatedProps?: Partial<FullProps<Component>>) => void;
}

/**
 * Given the type of a React component and the type of 'base' (a.k.a. 'default') props
 * preset for it, this returns a type containing two things:
 * * Required: any props not already provided in the base props
 * * Optional: any overrides for the base props
 */
export type RemainingPropsAndTestOverrides<
  ComponentType extends SetupComponentType,
  BaseProps extends Partial<FullProps<ComponentType>>
> = RemainingProps<ComponentType, BaseProps> & Partial<FullProps<ComponentType>>;

type RemainingProps<
  ComponentType extends SetupComponentType,
  BaseProps extends Partial<FullProps<ComponentType>>
> = Omit<FullProps<ComponentType>, keyof BaseProps>;
