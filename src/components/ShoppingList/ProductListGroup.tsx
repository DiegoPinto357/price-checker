import { CheckboxGroup, Checkbox } from '@nextui-org/react';

import type { ShoppingListItem } from './types';
import type { ItemEdit } from './EditModal';

// FIXME duplication
export type ItemChange = ItemEdit & { checked?: boolean };

type ProductListGroupProps = {
  'data-testid'?: string;
  items: ShoppingListItem[];
  onItemChange: (itemChange: ItemChange) => void;
  onItemContextMenu: (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    itemName: string
  ) => void;
};

const ProductListGroup = ({
  items,
  onItemChange,
  onItemContextMenu,
  ...propsRest
}: ProductListGroupProps) => (
  <CheckboxGroup
    {...propsRest}
    classNames={{ wrapper: 'gap-4' }}
    lineThrough
    value={items.filter(({ checked }) => checked).map(({ name }) => name)}
  >
    {items.map((item, index) => {
      const bgColor = index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50';
      return (
        <Checkbox
          data-testid={`list-item-${item.name.toLowerCase()}`}
          key={`${item.name}-${item.checked}`}
          className={`max-w-none w-full ml-0 px-4 ${bgColor}`}
          value={item.name}
          onChange={e =>
            onItemChange({
              name: item.name,
              checked: e.currentTarget.checked,
            })
          }
          onContextMenu={e => onItemContextMenu(e, item.name)}
        >
          {item.name}
        </Checkbox>
      );
    })}
  </CheckboxGroup>
);

export default ProductListGroup;
