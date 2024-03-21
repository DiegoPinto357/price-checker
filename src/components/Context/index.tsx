import { ShoppingListContextProvider } from './ShoppingListContext';
import { MealsPlannerContextProvider } from './MealsPlannerContext';

import type { ComponentType, PropsWithChildren } from 'react';

export { ShoppingListContext } from './ShoppingListContext';
export { MealsPlannerContext } from './MealsPlannerContext';

const withProviderGate =
  <Props extends PropsWithChildren>(
    Component: ComponentType<Props>,
    isEnabled: boolean
  ) =>
  (props: Props) =>
    isEnabled ? <Component {...(props as Props)} /> : props.children;

export type ContextProviderProps = {
  options?: {
    shoppingListProviderEnabled?: boolean;
    mealsPlannerProviderEnabled?: boolean;
  };
};

export const ContextProvider = ({
  children,
  options = {
    shoppingListProviderEnabled: true,
    mealsPlannerProviderEnabled: true,
  },
}: PropsWithChildren<ContextProviderProps>) => {
  const { shoppingListProviderEnabled, mealsPlannerProviderEnabled } = options;

  const ShoppingListContextProviderWithGate = withProviderGate(
    ShoppingListContextProvider,
    !!shoppingListProviderEnabled
  );
  const MealsPlannerContextProviderWithGate = withProviderGate(
    MealsPlannerContextProvider,
    !!mealsPlannerProviderEnabled
  );

  return (
    <ShoppingListContextProviderWithGate>
      <MealsPlannerContextProviderWithGate>
        {children}
      </MealsPlannerContextProviderWithGate>
    </ShoppingListContextProviderWithGate>
  );
};

export default ContextProvider;
