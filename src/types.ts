/**
 * Given the type of a React component and the type of 'base' (a.k.a. 'default') props
 * preset for it, this returns a type containing two things:
 * * Required: any props not already provided in the base props
 * * Optional: any overrides for the base props
 */
export type RemainingPropsAndTestOverrides<
  ComponentType extends React.ComponentType,
  BaseProps
> = Omit<React.ComponentProps<ComponentType>, keyof BaseProps> &
  Partial<React.ComponentProps<ComponentType>>;
