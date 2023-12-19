import { storage } from './proxies';

import type { ShoppingListItem } from './types';

const shoppingListFilename = 'shopping-list.json';

export const getShoppintList = async () => {
  const shoppingList = await storage.readFile<ShoppingListItem>(
    shoppingListFilename
  );
  if (!shoppingList) return [];
  return shoppingList;
};

export const setShoppingList = (shoppingList: ShoppingListItem[]) =>
  storage.writeFile(shoppingListFilename, shoppingList);
