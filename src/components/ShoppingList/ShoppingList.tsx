import { useState, useCallback } from 'react';
import {
  CheckboxGroup,
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
      <h1 className="grow font-bold mb-4">Shopping List</h1>
      <CheckboxGroup
        className="h-full overflow-auto mb-4"
        lineThrough
        disableAnimation
      >
        {items.map(item => (
          <Checkbox key={item} value={item}>
            {item}
          </Checkbox>
        ))}
      </CheckboxGroup>

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
