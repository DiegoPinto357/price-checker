import { useState, useCallback } from 'react';
import {
  Checkbox,
  Autocomplete,
  AutocompleteItem,
  Button,
} from '@nextui-org/react';

const initialItems: string[] = [
  'Banana',
  'Batata',
  'Biritis',
  'Queijo illuminati',
  'Suculenta rara',
];

const ShoppingList = () => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [inputValue, setInputValue] = useState<string | number>('');

  const addItem = useCallback((item: string | number) => {
    setItems(items => [...items, item as string]);
  }, []);

  return (
    <div
      data-testid="shopping-list"
      className="flex flex-col justify-between h-full"
    >
      <div className="grow flex flex-col overflow-y-scroll">
        {items.map(item => (
          <Checkbox key={item} className="-my-1">
            {item}
          </Checkbox>
        ))}
      </div>

      <div className="flex">
        <Autocomplete
          className="mr-2"
          label={'Item'}
          allowsCustomValue
          radius="full"
          variant="bordered"
          onValueChange={setInputValue}
          onSelectionChange={setInputValue}
        >
          {initialItems.map(item => (
            <AutocompleteItem key={item}>{item}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Button
          className="h-14"
          color="secondary"
          onPress={() => addItem(inputValue)}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default ShoppingList;
