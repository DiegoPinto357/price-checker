import { useContext, useCallback } from 'react';
import Typography from '../lib/Typography';
import ProductList from './ProductList';
import ProductSearch from './ProductSearch';
import { ShoppingListContext } from '../Context';

import type { ShoppingListItem } from './types';
import type { ItemChange } from './ProductList';

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
      setItems(items => {
        const existingItem = items.find(
          ({ name }) => name.toLowerCase() === itemName.toLowerCase()
        );
        if (itemName && !existingItem)
          items.push({ name: itemName, checked: false });
        return sortItems(items);
      });
    },
    [setItems]
  );

  const handleListItemChange = useCallback(
    ({ name, newName, checked }: ItemChange) => {
      setItems(items => {
        const item = items.find(item => item.name === name);
        if (item) {
          if (newName !== undefined) item.name = newName;
          if (checked !== undefined) item.checked = checked;
        }
        return sortItems(items);
      });
    },
    [setItems]
  );

  const handleDeleteSelectedItems = useCallback(() => {
    setItems(items => items.filter(({ checked }) => !checked));
  }, [setItems]);

  return (
    <div
      data-testid="shopping-list"
      className="flex flex-col justify-between h-full"
    >
      <Typography variant="h1">Lista de Compras</Typography>
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
