import { useContext, useState, useCallback } from 'react';
import {
  CheckboxGroup,
  Checkbox,
  Autocomplete,
  AutocompleteItem,
  Button,
} from '@nextui-org/react';
import { FaPlus } from 'react-icons/fa';
import { ShoppingListContext } from '../Context';

import type { KeyboardEvent } from 'react';
import type { ShoppingListItem } from './types';

// const initialItems: ShoppingListItem[] = [
//   // 'Batata',
//   // 'Biritis',
//   // 'Queijo illuminati',
//   // 'Suculenta rara',
// ];

const sortItems = (items: ShoppingListItem[]) => [
  ...items
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1))
    .sort((a, b) => (a.checked && a.checked !== b.checked ? 1 : -1)),
];

const ShoppingList = () => {
  const { shoppingListItems: items, setShoppingListItems: setItems } =
    useContext(ShoppingListContext);
  const [inputValue, setInputValue] = useState<string>('');

  const addItem = useCallback(
    (itemName: string | null) => {
      setItems(items => {
        const existingItem = items.find(({ name }) => name === itemName);
        if (itemName && !existingItem)
          items.push({ name: itemName, checked: false });
        return sortItems(items);
      });
      setInputValue('');
    },
    [setItems]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        addItem(inputValue);
      }
    },
    [addItem, inputValue]
  );

  const handleCheckboxChange = useCallback(
    (itemName: string, checked: boolean) => {
      setItems(items => {
        const item = items.find(({ name }) => name === itemName);
        if (item) item.checked = checked;
        return sortItems(items);
      });
    },
    [setItems]
  );

  const selectedItems = items
    .filter(({ checked }) => checked)
    .map(({ name }) => name);

  return (
    <div
      data-testid="shopping-list"
      className="flex flex-col justify-between h-full"
    >
      <h1 className="mb-4 text-2xl">Lista de Compras</h1>
      <CheckboxGroup
        className="h-full overflow-auto mb-4"
        lineThrough
        disableAnimation
        value={selectedItems}
      >
        {items.map(item => (
          <Checkbox
            data-testid={`list-item-${item.name}`}
            key={`${item.name}-${item.checked}`}
            value={item.name}
            onChange={e =>
              handleCheckboxChange(item.name, e.currentTarget.checked)
            }
          >
            {item.name}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <div className="flex">
        <Autocomplete
          className="mr-2"
          label={'Buscar produto'}
          labelPlacement="outside"
          allowsCustomValue
          variant="bordered"
          defaultItems={[] as ShoppingListItem[]}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onKeyDown={handleKeyPress}
        >
          {item => (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
        <Button
          className="self-end"
          color="secondary"
          aria-label="add"
          isIconOnly
          onPress={() => addItem(inputValue)}
        >
          <FaPlus />
        </Button>
      </div>
    </div>
  );
};

export default ShoppingList;
