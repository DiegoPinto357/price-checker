import { useState, useCallback } from 'react';
import {
  CheckboxGroup,
  Checkbox,
  Autocomplete,
  AutocompleteItem,
  Button,
} from '@nextui-org/react';

const initialItems: string[] = [
  // 'Batata',
  // 'Biritis',
  // 'Queijo illuminati',
  // 'Suculenta rara',
];

const ShoppingList = () => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleSelectionChange = useCallback((key: string | number) => {
    setInputValue(key as string);
    setSelectedKey(key as string);
  }, []);

  const handleAddButtonPress = useCallback((item: string | null) => {
    setItems(items => [...items, item as string]);
    setSelectedKey(null);
    setInputValue('');
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
          inputValue={inputValue}
          selectedKey={selectedKey}
          onInputChange={setInputValue}
          onSelectionChange={handleSelectionChange}
        >
          {[...initialItems, 'select this'].map(item => (
            <AutocompleteItem key={item}>{item}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Button
          className="h-14"
          color="secondary"
          onPress={() => handleAddButtonPress(inputValue)}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default ShoppingList;
