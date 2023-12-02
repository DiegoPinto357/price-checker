import { useState, useCallback } from 'react';
import {
  CheckboxGroup,
  Checkbox,
  Autocomplete,
  AutocompleteItem,
  Button,
} from '@nextui-org/react';
import { FaPlus } from 'react-icons/fa';

import type { KeyboardEvent } from 'react';

type Item = {
  name: string;
  checked: boolean;
};

const initialItems: Item[] = [
  // 'Batata',
  // 'Biritis',
  // 'Queijo illuminati',
  // 'Suculenta rara',
];

const sortItems = (items: Item[]) => [
  ...items
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1))
    .sort((a, b) => (a.checked && a.checked !== b.checked ? 1 : -1)),
];

const ShoppingList = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const addItem = useCallback((itemName: string | null) => {
    setItems(items => {
      const existingItem = items.find(({ name }) => name === itemName);
      if (itemName && !existingItem)
        items.push({ name: itemName, checked: false });
      return sortItems(items);
    });
    // setSelectedKey(null);
    setInputValue('');
  }, []);

  const handleSelectionChange = useCallback((key: string | number) => {
    if (typeof key === 'string') {
      setInputValue(key);
    }
  }, []);

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
    []
  );

  return (
    <div
      data-testid="shopping-list"
      className="flex flex-col justify-between h-full"
    >
      <h1 className="grow font-bold mb-4">Shopping List</h1>
      <CheckboxGroup
        className="h-full overflow-auto mb-4"
        lineThrough
        disableAnimation
      >
        {items.map(item => {
          return (
            <Checkbox
              data-testid={`list-item-${item.name}`}
              key={`${item.name}-${item.checked}`}
              value={item.name}
              checked={item.checked}
              onChange={e =>
                handleCheckboxChange(item.name, e.currentTarget.checked)
              }
            >
              {item.name}
            </Checkbox>
          );
        })}
      </CheckboxGroup>

      <div className="flex">
        <Autocomplete
          className="mr-2"
          label={'Buscar produto'}
          labelPlacement="outside"
          allowsCustomValue
          // radius="full"
          variant="bordered"
          defaultItems={items}
          inputValue={inputValue}
          // selectedKey={selectedKey}
          onInputChange={setInputValue}
          // onSelectionChange={handleSelectionChange}
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
