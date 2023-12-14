import { useCallback, useState } from 'react';
import { CheckboxGroup, Checkbox, Divider, Button } from '@nextui-org/react';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import Typography from '../lib/Typography';
import ConfirmDialog from '../lib/ConfirmDialog';
import EditProductModal from './EditProductModal';

import type { ShoppingListItem } from './types';
import type { ConfirmDialogUserAction } from '../lib/ConfirmDialog';
import type { ItemEdit } from './EditProductModal';

export type ItemChange = ItemEdit & { checked?: boolean };

type Props = {
  items: ShoppingListItem[];
  onItemChange: (itemChange: ItemChange) => void;
  onDeleteSelectedItems: () => void;
};

const ProductList = ({ items, onItemChange, onDeleteSelectedItems }: Props) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const unselectedItems = items.filter(({ checked }) => !checked);
  const selectedItems = items.filter(({ checked }) => checked);

  const handleItemContextMenu = useCallback(
    (
      event: React.MouseEvent<HTMLInputElement, MouseEvent>,
      itemName: string
    ) => {
      event.preventDefault();
      setSelectedItem(itemName);
      setEditItemDialogOpen(true);
    },
    []
  );

  const handleConfirmDialogClose = useCallback(
    (userAction: ConfirmDialogUserAction) => {
      setConfirmDialogOpen(false);
      if (userAction === 'accept') {
        onDeleteSelectedItems();
      }
    },
    [onDeleteSelectedItems]
  );

  const handleEditItemDialogClose = useCallback(
    (newItemData?: ItemEdit) => {
      setEditItemDialogOpen(false);
      if (newItemData) {
        onItemChange(newItemData);
      }
    },
    [onItemChange]
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
              data-testid={`list-item-${item.name.toLowerCase()}`}
              key={`${item.name}-${item.checked}`}
              value={item.name}
              onChange={e =>
                onItemChange({
                  name: item.name,
                  checked: e.currentTarget.checked,
                })
              }
              onContextMenu={e => handleItemContextMenu(e, item.name)}
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
              onPress={() => setConfirmDialogOpen(true)}
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
                data-testid={`list-item-${item.name.toLowerCase()}`}
                key={`${item.name}-${item.checked}`}
                value={item.name}
                onChange={e =>
                  onItemChange({
                    name: item.name,
                    checked: e.currentTarget.checked,
                  })
                }
                onContextMenu={e => handleItemContextMenu(e, item.name)}
              >
                {item.name}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </>
      ) : null}

      <ConfirmDialog
        title="Deletar items?"
        isOpen={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
      />

      <EditProductModal
        isOpen={editItemDialogOpen}
        itemName={selectedItem}
        onClose={handleEditItemDialogClose}
      />
    </div>
  );
};

export default ProductList;
