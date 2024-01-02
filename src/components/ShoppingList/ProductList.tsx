import { useCallback, useState } from 'react';
import { Divider, Button } from '@nextui-org/react';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import Typography from '../lib/Typography';
import ConfirmDialog from '../lib/ConfirmDialog';
import ProductListGroup from './ProductListGroup';
import EditProductModal from './EditProductModal';

import type { ShoppingListItem } from './types';
import type { ConfirmDialogUserAction } from '../lib/ConfirmDialog';
import type { ItemChange } from './ProductListGroup';
import type { ItemEdit } from './EditProductModal';

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
    <div className="h-full overflow-auto mb-4 pt-4">
      {unselectedItems.length ? (
        <ProductListGroup
          data-testid="unselected-items-group"
          items={unselectedItems}
          onItemChange={onItemChange}
          onItemContextMenu={handleItemContextMenu}
        />
      ) : null}

      {selectedItems.length ? (
        <>
          <div className="flex items-center gap-2 mt-4 mr-3 mb-4">
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

          <ProductListGroup
            data-testid="selected-items-group"
            items={selectedItems}
            onItemChange={onItemChange}
            onItemContextMenu={handleItemContextMenu}
          />
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
