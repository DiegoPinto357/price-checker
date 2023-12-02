import { createContext, useState } from 'react';

import type { ReactNode } from 'react';
import type { ShoppingListItem } from './ShoppingList/types';

type ShoppingListContextType = {
  shoppingListItems: ShoppingListItem[];
  setShoppingListItems: React.Dispatch<
    React.SetStateAction<ShoppingListItem[]>
  >;
};

export const ShoppingListContext = createContext<ShoppingListContextType>(
  {} as ShoppingListContextType
);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingListItems, setShoppingListItems] = useState<
    ShoppingListItem[]
  >([]);

  return (
    <ShoppingListContext.Provider
      value={{ shoppingListItems, setShoppingListItems }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export default ContextProvider;
