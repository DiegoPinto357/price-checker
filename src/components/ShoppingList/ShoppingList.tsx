import { useContext, useCallback } from 'react';
import ProductList from './ProductList';
import ProductSearch from './ProductSearch';
import { ShoppingListContext } from '../Context';

import type { ShoppingListItem } from './types';
import type { ItemChange } from './ProductListGroup';

const sortItems = (items: ShoppingListItem[]) => [
  ...items.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
];

const ShoppingList = () => {
  const { shoppingListItems: items, setShoppingListItems: setItems } =
    useContext(ShoppingListContext);

  const addItem = useCallback(
    (itemName: string) => {
      const existingItem = items.find(
        ({ name }) => name.toLowerCase() === itemName.toLowerCase()
      );
      if (itemName && !existingItem)
        items.push({ name: itemName, checked: false });
      setItems(sortItems(items));
    },
    [items, setItems]
  );

  const handleListItemChange = useCallback(
    ({ name, newName, checked, deleted }: ItemChange) => {
      const item = items.find(item => item.name === name);
      if (item) {
        if (newName !== undefined) item.name = newName;
        if (checked !== undefined) item.checked = checked;
        if (deleted !== undefined) {
          setItems(items.filter(item => item.name !== name));
          return;
        }
      }
      setItems(sortItems(items));
    },

    [items, setItems]
  );

  const handleDeleteSelectedItems = useCallback(() => {
    setItems(items.filter(({ checked }) => !checked));
  }, [items, setItems]);

  return (
    <div data-testid="shopping-list" className="flex flex-col h-full">
      <ProductList
        items={items}
        onItemChange={handleListItemChange}
        onDeleteSelectedItems={handleDeleteSelectedItems}
      />
      <ProductSearch onAddItem={addItem} />
    </div>
  );
};

export default ShoppingList;
