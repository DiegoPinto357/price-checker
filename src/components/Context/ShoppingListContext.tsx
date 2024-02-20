import { createContext, useState, useCallback, useEffect } from 'react';
import { getShoppintList, setShoppingList } from '../../shoppingList';

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
  children: ReactNode; // TODO use PropsWithChildren
}) => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  const setShoppingListItems = useCallback(
    async (newItems: ShoppingListItem[]) => {
      setItems(newItems);
      await setShoppingList(newItems);
    },
    []
  );

  useEffect(() => {
    const loadShoppingList = async () => {
      const shoppingList = await getShoppintList();
      setItems(shoppingList);
    };
    loadShoppingList();
  }, []);

  return (
    <ShoppingListContext.Provider
      value={{ shoppingListItems: items, setShoppingListItems }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
