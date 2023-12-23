import { createContext, useState, useCallback } from 'react';

import type { ReactNode } from 'react';
import type { ShoppingListItem } from '../ShoppingList/types';

type ShoppingListContextType = {
  shoppingListItems: ShoppingListItem[];
  setShoppingListItems: (items: ShoppingListItem[]) => void;
};

export const ShoppingListContext = createContext<ShoppingListContextType>(
  {} as ShoppingListContextType
);

export const ShoppingListContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  const setShoppingListItems = useCallback((newItems: ShoppingListItem[]) => {
    setItems(newItems);
  }, []);

  return (
    <ShoppingListContext.Provider
      value={{ shoppingListItems: items, setShoppingListItems }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
