import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import ConfirmDialog from './ConfirmDialog';

import type { KeyboardEvent } from 'react';
import type { ConfirmDialogUserAction } from './ConfirmDialog';

export type ItemEdit = {
  name: string;
  newName?: string;
  deleted?: boolean;
};

type Props = {
  isOpen: boolean;
  itemName: string;
  onClose: (itemData?: ItemEdit) => void;
};

const EditModal = ({ isOpen, itemName, onClose }: Props) => {
  const [itemNameValue, setItemNameValue] = useState<string>('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setItemNameValue(itemName);
  }, [itemName]);

  const handleInputKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onClose({ name: itemName, newName: itemNameValue });
      }
    },
    [itemName, itemNameValue, onClose]
  );

  const handleConfirmDialogClose = useCallback(
    (userAction: ConfirmDialogUserAction) => {
      setConfirmDialogOpen(false);
      if (userAction === 'accept') {
        onClose({ name: itemName, deleted: true });
      }
    },
    [itemName, onClose]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose()}>
        <ModalContent>
          <ModalHeader>Editar item</ModalHeader>
          <ModalBody>
            <Input
              data-testid="edit-item-input"
              ref={inputRef}
              type="text"
              label="Nome"
              isClearable
              labelPlacement="outside"
              variant="bordered"
              value={itemNameValue}
              onValueChange={setItemNameValue}
              onKeyDown={handleInputKeyPress}
            />

            <Button
              color="danger"
              fullWidth
              onPress={() => setConfirmDialogOpen(true)}
            >
              Deletar
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={() => onClose()}>
              Cancelar
            </Button>

            <Button
              color="primary"
              onPress={() =>
                onClose({ name: itemName, newName: itemNameValue })
              }
            >
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        title="Deletar item?"
        isOpen={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
      />
    </>
  );
};

export default EditModal;
