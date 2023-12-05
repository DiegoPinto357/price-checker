import { useCallback, useState } from 'react';
import { CheckboxGroup, Checkbox, Divider, Button } from '@nextui-org/react';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import Typography from '../lib/Typography';
import ConfirmDialog from '../lib/ConfirmDialog';

import type { ShoppingListItem } from './types';
import type { ConfirmDialogUserAction } from '../lib/ConfirmDialog';

type Props = {
  items: ShoppingListItem[];
  onItemChange: (name: string, checked: boolean) => void;
  onDeleteSelectedItems: () => void;
};

const ProductList = ({ items, onItemChange, onDeleteSelectedItems }: Props) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const unselectedItems = items.filter(({ checked }) => !checked);
  const selectedItems = items.filter(({ checked }) => checked);

  const handleDialogClose = useCallback(
    (userAction: ConfirmDialogUserAction) => {
      setDialogOpen(false);
      if (userAction === 'accept') {
        onDeleteSelectedItems();
      }
    },
    [onDeleteSelectedItems]
  );

  return (
    <div className="h-full overflow-auto mb-4">
      {unselectedItems.length ? (
        <CheckboxGroup
          data-testid="unselected-items-group"
          className="mb-2"
          lineThrough
          disableAnimation
          value={[]}
        >
          {unselectedItems.map(item => (
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
      ) : null}

      {selectedItems.length ? (
        <>
          <div className="flex items-center gap-2 mt-4 mr-4 mb-2">
            <Typography variant="h3" className="whitespace-nowrap">
              Produtos comprados
            </Typography>
            <Divider className="shrink my-4" />
            <Button
              aria-label="delete selected"
              size="sm"
              color="danger"
              isIconOnly
              onPress={() => setDialogOpen(true)}
            >
              <MdOutlineDeleteSweep className="w-5 h-5" />
            </Button>
          </div>

          <CheckboxGroup
            data-testid="selected-items-group"
            lineThrough
            disableAnimation
            value={selectedItems.map(({ name }) => name)}
          >
            {selectedItems.map(item => (
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
        </>
      ) : null}

      <ConfirmDialog
        title="Deletar items?"
        isOpen={dialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default ProductList;
