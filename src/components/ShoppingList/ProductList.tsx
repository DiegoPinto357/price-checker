import { CheckboxGroup, Checkbox } from '@nextui-org/react';

import type { ShoppingListItem } from './types';

type Props = {
  items: ShoppingListItem[];
  onItemChange: (name: string, checked: boolean) => void;
};

const ProductList = ({ items, onItemChange }: Props) => {
  const selectedItems = items
    .filter(({ checked }) => checked)
    .map(({ name }) => name);

  return (
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
          onChange={e => onItemChange(item.name, e.currentTarget.checked)}
        >
          {item.name}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default ProductList;
