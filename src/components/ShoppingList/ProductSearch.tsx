import { useState, useCallback } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';
import { LuPlus } from 'react-icons/lu';

import type { KeyboardEvent } from 'react';
import type { ShoppingListItem } from './types';

type Props = {
  onAddItem: (name: string) => void;
};

const ProductSearch = ({ onAddItem }: Props) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onAddItem(inputValue.trim());
        setInputValue('');
      }
    },
    [onAddItem, inputValue]
  );

  const handleAddButtonPress = useCallback(() => {
    onAddItem(inputValue);
    setInputValue('');
  }, [onAddItem, inputValue]);

  return (
    <div className="flex gap-2 mx-4">
      <Autocomplete
        label="Buscar produto"
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
        color="primary"
        aria-label="add"
        isIconOnly
        onPress={handleAddButtonPress}
      >
        <LuPlus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ProductSearch;
