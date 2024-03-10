import { ShoppingListContextProvider } from './ShoppingListContext';
import { MealsPlannerContextProvider } from './MealsPlannerContext';

import type { PropsWithChildren } from 'react';

export { ShoppingListContext } from './ShoppingListContext';
export { MealsPlannerContext } from './MealsPlannerContext';

const ContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <ShoppingListContextProvider>
      <MealsPlannerContextProvider>{children}</MealsPlannerContextProvider>
    </ShoppingListContextProvider>
  );
};

export default ContextProvider;
